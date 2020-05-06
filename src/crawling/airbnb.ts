import puppeteer, { ElementHandle } from 'puppeteer';
import { AIRBNB_SELECTORS } from './selectors';

const getAirbnbSearchUrl = (city: string, travelDates: Array<string>) => {
  const departureDate = travelDates[0].slice(0, 10);
  const arrivalDate = travelDates[1].slice(0, 10);

  return process.env.AIRBNB_SEARCH_URI_FRONT + city + process.env.AIRBNB_SEARCH_URI_MID
    + `checkin=${departureDate}&checkout=${arrivalDate}` + process.env.AIRBNB_SEARCH_URI_BACK;
};

interface Result {
  description: string;
  title: string;
  infoList: string[];
  price: string[];
  image: string;
  link: string;
};

async function findValidSelector(targetDiv: ElementHandle, ...args: string[]) {
  for await (const selector of args) {
    const result = await targetDiv.$(selector);

    if (result) {
      return selector;
    }
  }
}

const getAirbnbCrawlingData = (city: string, travelDates: Array<string>) => {
  const airbnbUrl = getAirbnbSearchUrl(city, travelDates);
  const airbnbData: Result[] = [];

  return (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      slowMo: 10,
      args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
    });
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
        const validDescriptionSelector = await findValidSelector(
          div,
          AIRBNB_SELECTORS.DESCRIPTION1,
          AIRBNB_SELECTORS.DESCRIPTION2,
          AIRBNB_SELECTORS.DESCRIPTION3,
        );

        if (validDescriptionSelector) {
          description = await div.$eval(
            validDescriptionSelector,
            description => description.textContent?.replace(/\n/g, '').trim()!
          );
        }
      } catch (err) {
        console.error('airbnb description error', err);
      }

      try {
        const validTitleSelector = await findValidSelector(
          div,
          AIRBNB_SELECTORS.TITLE1,
          AIRBNB_SELECTORS.TITLE2
        );

        if (validTitleSelector) {
          title = await div.$eval(
            validTitleSelector,
            title => title.textContent?.replace(/\n/g, '').trim()!
          );
        }
      } catch (err) {
        console.error('airbnb title error', err);
      }

      try {
        const validInfoSelector = await findValidSelector(
          div,
          AIRBNB_SELECTORS.INFO1,
          AIRBNB_SELECTORS.INFO2
        );

        if (validInfoSelector) {
          infoList = await div.$$eval(
            validInfoSelector,
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
        const validImageSelector = await findValidSelector(
          div,
          AIRBNB_SELECTORS.IMAGE1,
          AIRBNB_SELECTORS.IMAGE2,
          AIRBNB_SELECTORS.IMAGE3
        );

        if (validImageSelector) {
          if (validImageSelector === AIRBNB_SELECTORS.IMAGE3) {
            image = await div.$eval(
              validImageSelector,
              image => image.getAttribute('data-original-uri')!
            );
          } else {
            image = await div.$eval(
              validImageSelector,
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

    await browser.close();
    return airbnbData;
  })();
};

export default getAirbnbCrawlingData;
