import puppeteer from 'puppeteer';
import { AIRBNB_SELECTORS } from './selectors';

const AIRBNB_SEARCH_URI_FRONT = 'https://airbnb.co.kr/s/';
const AIRBNB_SEARCH_URI_MID = '/homes?tab_id=all_tab&refinement_paths%5B%5D=%2Fhomes&';
const AIRBNB_SEARCH_URI_BACK = '&adults=1&source=structured_search_input_header&search_type=search_query';

const getAirbnbSearchUrl = (city: string, travelDates: Array<string>) => {
  const departureDate = travelDates[0].slice(0, 10);
  const arrivalDate = travelDates[1].slice(0, 10);

  return AIRBNB_SEARCH_URI_FRONT + city + AIRBNB_SEARCH_URI_MID
    + `checkin=${departureDate}&checkout=${arrivalDate}` + AIRBNB_SEARCH_URI_BACK;
};

interface Result {
  description: string;
  title: string;
  infoList: string[];
  price: string[];
  image: string;
  link: string;
};

const getAirbnbCrawlingData = (city: string, travelDates: Array<string>) => {
  const airbnbUrl = getAirbnbSearchUrl(city, travelDates);
  const airbnbData: Result[] = [];

  return (async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, slowMo: 10 });
    const page = await browser.newPage();

    await page.goto(airbnbUrl, { waitUntil: 'networkidle0' });

    const resultDivs = await page.$$(AIRBNB_SELECTORS.RESULT_DIV);

    for await (const div of resultDivs) {
      let description = '';
      let title = '';
      let infoList: string[] = [];
      let price: string[] = [];
      let image = '';
      let link = '';

      try {
        const descSelector1 = await div.$(AIRBNB_SELECTORS.DESCRIPTION1);
        const descSelector2 = await div.$(AIRBNB_SELECTORS.DESCRIPTION2);
        const descSelector3 = await div.$(AIRBNB_SELECTORS.DESCRIPTION3);

        let descriptionSelector;
        if (descSelector1) descriptionSelector = AIRBNB_SELECTORS.DESCRIPTION1;
        else if (descSelector2) descriptionSelector = AIRBNB_SELECTORS.DESCRIPTION2;
        else if (descSelector3) descriptionSelector = AIRBNB_SELECTORS.DESCRIPTION3;

        if (descriptionSelector) {
          description = await div.$eval(
            descriptionSelector,
            desc => desc.textContent?.replace(/\n/g, '').trim()!
          );
        }
      } catch (err) {
        console.error('airbnb description error', err);
      }

      try {
        const titleSelector1 = await div.$(AIRBNB_SELECTORS.TITLE1);
        const titleSelector2 = await div.$(AIRBNB_SELECTORS.TITLE2);

        let titleSelector;
        if (titleSelector1) titleSelector = AIRBNB_SELECTORS.TITLE1;
        else if (titleSelector2) titleSelector = AIRBNB_SELECTORS.TITLE2;

        if (titleSelector) {
          title = await div.$eval(
            titleSelector,
            title => title.textContent?.replace(/\n/g, '').trim()!
          );
        }
      } catch (err) {
        console.error('airbnb title error', err);
      }

      try {
        const infoSelector1 = await div.$(AIRBNB_SELECTORS.INFO1);
        const infoSelector2 = await div.$(AIRBNB_SELECTORS.INFO2);

        let infoSelector;
        if (infoSelector1) infoSelector = AIRBNB_SELECTORS.INFO1;
        else if (infoSelector2) infoSelector = AIRBNB_SELECTORS.INFO2;

        if (infoSelector) {
          infoList = await div.$$eval(
            infoSelector,
            infos => infos.map(info => info.textContent?.replace(/\n/g, '').trim()!)
          );
        }
      } catch (err) {
        console.error('airbnb infoList error', err);
      }

      try {
        const priceSelector = await div.$(AIRBNB_SELECTORS.PRICE);

        if (priceSelector) {
          price = await div.$$eval(
            AIRBNB_SELECTORS.PRICE,
            prices => prices.filter(price => price.textContent !== '최저')
            .map(price => {
              return price.textContent?.replace(/\n|이전 가격:|할인 가격:|가격:/gi, '').trim()!.split('₩').slice(1);
            })[0]
          );
        }
      } catch (err) {
        console.error('airbnb price error', err);
      }

      try {
        const imageSelector1 = await div.$(AIRBNB_SELECTORS.IMAGE1);
        const imageSelector2 = await div.$(AIRBNB_SELECTORS.IMAGE2);
        const imageSelector3 = await div.$(AIRBNB_SELECTORS.IMAGE3);

        let imageSelector;

        if (imageSelector3) {
          image = await div.$eval(
            AIRBNB_SELECTORS.IMAGE3,
            image => image.getAttribute('data-original-uri')!
          );
        } else {
          if (imageSelector1) imageSelector = AIRBNB_SELECTORS.IMAGE1;
          else if (imageSelector2) imageSelector = AIRBNB_SELECTORS.IMAGE2;

          if (imageSelector) {
            image = await div.$eval(
              imageSelector,
              image => image.getAttribute('style')?.slice(0, -3).match(/\bhttps?:\/\/\S+/gi)![0]
            );
          }
        }
      } catch (err) {
        console.error('airbnb image error', err);
      }

      try {
        const linkSelector = await div.$(AIRBNB_SELECTORS.LINK);

        if (linkSelector) {
          link = await div.$eval(
            AIRBNB_SELECTORS.LINK,
            link => 'https://airbnb.co.kr' + link.getAttribute('href')!
          );
        }
      } catch (err) {
        console.error('airbnb link error', err);
      }

      const result: Result = {
        description,
        title,
        infoList,
        price,
        image,
        link
      };

      airbnbData.push(result);
    }

    return airbnbData;
  })();
};

export default getAirbnbCrawlingData;
