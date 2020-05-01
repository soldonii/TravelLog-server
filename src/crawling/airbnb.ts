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

const getAirbnbCrawlingData = (city: string, travelDates: Array<string>) => {
  const airbnbUrl = getAirbnbSearchUrl(city, travelDates);

  return (async () => {
    const browser = await puppeteer.launch({ headless: true, defaultViewport: null, slowMo: 10 });
    const page = await browser.newPage();

    console.log('airbnb url', airbnbUrl);
    await page.goto(airbnbUrl, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'airbnb.png', fullPage: true });

    const airbnbData: any[] = [];

    await page.waitFor(7000);
    const resultDivs = await page.$$(AIRBNB_SELECTORS.RESULT_DIV);

    for await (const div of resultDivs) {
      const descFlag1 = await div.$(AIRBNB_SELECTORS.DESCRIPTION1);
      let description;

      if (descFlag1) {
        description = await div.$eval(
          AIRBNB_SELECTORS.DESCRIPTION1,
          description => description.textContent?.replace(/\n/g, '').trim()!
        );
      } else {
        const descFlag2 = await div.$(AIRBNB_SELECTORS.DESCRIPTION2);

        if (descFlag2) {
          description = await div.$eval(
            AIRBNB_SELECTORS.DESCRIPTION2,
            description => description.textContent?.replace(/\n/g, '').trim()!
          );
        } else {
          description = await div.$eval(
            AIRBNB_SELECTORS.DESCRIPTION3,
            description => description.textContent?.replace(/\n/g, '').trim()!
          );
        }
      }

      const titleFlag = await div.$(AIRBNB_SELECTORS.TITLE1);
      let title;

      if (titleFlag) {
        title = await div.$eval(
          AIRBNB_SELECTORS.TITLE1,
          title => title.textContent?.replace(/\n/g, '').trim()!
        );
      } else {
        title = await div.$eval(
          AIRBNB_SELECTORS.TITLE2,
          title => title.textContent?.replace(/\n/g, '').trim()!
        );
      }

      const infoFlag = await div.$(AIRBNB_SELECTORS.INFO1);
      let infoList;

      if (infoFlag) {
        infoList = await div.$$eval(
          AIRBNB_SELECTORS.INFO1,
          infos => infos.map(info => info.textContent?.replace(/\n/g, '').trim()!)
        );
      } else {
        infoList = await div.$$eval(
          AIRBNB_SELECTORS.INFO2,
          infos => infos.map(info => info.textContent?.replace(/\n/g, '').trim()!)
        );
      }

      const price = await div.$$eval(
        AIRBNB_SELECTORS.PRICE,
        prices => prices.filter(price => price.textContent !== '최저')
          .map(price => price.textContent?.replace(/\n/g, '').trim()!)[0]
      );

      const imageFlag = await div.$(AIRBNB_SELECTORS.IMAGE1);
      let image;

      if (imageFlag) {
        image = await div.$eval(
          AIRBNB_SELECTORS.IMAGE1,
          image => image.getAttribute('style')?.match(/\bhttps?:\/\/\S+/gi)![0]
        );
      } else {
        image = await div.$eval(
          AIRBNB_SELECTORS.IMAGE2,
          image => image.getAttribute('style')?.match(/\bhttps?:\/\/\S+/gi)![0]
        );
      }

      const link = await div.$eval(
        AIRBNB_SELECTORS.LINK,
        link => 'https://airbnb.co.kr' + link.getAttribute('href')!
      );

      const result = {
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
