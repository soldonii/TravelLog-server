import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { KAYAK_SELECTORS } from './selectors';

import countryList from '../crawling/countryList.json';

const getCityCode = (countryName: string, cityName: string) => {
  for (const country of countryList) {
    if (country.Name === countryName) {
      for (const city of country.Cities) {
        if (city.Name === cityName) {
          return city.IataCode;
        }
      }
    }
  }
};

const getKayakSearchUrl = (country: string, city: string, travelDates: Array<string>) => {
  const cityCode = getCityCode(country, city);
  const departureDate = travelDates[0].slice(0, 10);
  const arrivalDate = travelDates[1].slice(0, 10);

  return process.env.KAYAK_URI_FRONT + cityCode + '/' + departureDate + '/' + arrivalDate;
};

interface IPriceWithLinks {
  link: string;
  price: string;
  provider: string;
};

interface Result {
  airlineImageList: Array<string[]>;
  departureTimeList: string[];
  arrivalTimeList: string[];
  airlinesList: string[];
  layoverTimeList: string[];
  layoverAirportList: string[];
  flightHoursList: string[];
  airportsList: string[];
  priceAndProviderWithLinks: Array<IPriceWithLinks | null>;
};

const getKayakCrawlingData = (country: string, city: string, travelDates: Array<string>) => {
  const kayakUrl = getKayakSearchUrl(country, city, travelDates);
  const kayakData: Result[] = [];

  return (async () => {
    const browser = await puppeteer.use(StealthPlugin()).launch({
      headless: true,
      defaultViewport: null,
      slowMo: 10,
      args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
    });

    const page = await browser.newPage();

    try {
      await page.goto(kayakUrl, { timeout: 50 * 1000 });
      await page.waitForFunction('document.querySelector(".Common-Results-ProgressBar > .bar") && parseInt(document.querySelector(".Common-Results-ProgressBar > .bar").style.transform.slice(11, -2)) > 35', {
        timeout: 50 * 1000
      });
    } catch (err) {
      console.error('kayak connection error', err);
    }

    const resultDivs = await page.$$(KAYAK_SELECTORS.RESULT_DIV);

    for await (const div of resultDivs) {
      const result: Result = {
        airlineImageList: [],
        departureTimeList: [],
        arrivalTimeList: [],
        airlinesList: [],
        layoverTimeList: [],
        layoverAirportList: [],
        flightHoursList: [],
        airportsList: [],
        priceAndProviderWithLinks: []
      };

      try {
        result.airlineImageList = await div.$$eval(
          KAYAK_SELECTORS.AIRLINE_IMAGE,
          divs => divs.map(div => {
            const imageList: string[] = [];
            const airlines = div.children;

            for (const airline of airlines) {
              imageList.push(airline.children[0].getAttribute('src')!);
            }

            return imageList;
          })
        );

      } catch (err) {
        console.error('kayak image error', err);
      }

      try {
        result.departureTimeList = await div.$$eval(
          KAYAK_SELECTORS.DEPARTURE_TIME,
          times => times.map(time => time.textContent?.replace(/\n/g, '').trim()!)
        );
      } catch (err) {
        console.error('kayak departure time error', err);
      }

      try {
        result.arrivalTimeList = await div.$$eval(
          KAYAK_SELECTORS.ARRIVAL_TIME,
          times => times.map(time => time.textContent?.replace(/\n/g, '').trim()!)
        );
      } catch (err) {
        console.error('kayak arrival time error', err);
      }

      try {
        result.airlinesList = await div.$$eval(
          KAYAK_SELECTORS.AIRLINES,
          airlines => airlines.map(airline => airline.textContent?.replace(/\n/g, '').trim()!)
        );
      } catch (err) {
        console.error('kayak airline list error', err);
      }

      try {
        result.layoverTimeList = await div.$$eval(
          KAYAK_SELECTORS.LAYOVER_TIME,
          times => times.map(time => time.textContent?.replace(/\n/g, '').trim()!)
        );
      } catch (err) {
        console.error('kayak layover time error', err);
      }

      try {
        result.layoverAirportList = await div.$$eval(
          KAYAK_SELECTORS.LAYOVER_AIRPORT,
          airports => airports.map(airport => airport.textContent?.replace(/\n/g, '').trim()!)
        );
      } catch (err) {
        console.error('kayak layover airport list error', err);
      }

      try {
        result.flightHoursList = await div.$$eval(
          KAYAK_SELECTORS.FLIGHT_HOURS,
          hours => hours.map(hour => hour.textContent?.replace(/\n/g, '').trim()!)
        );
      } catch (err) {
        console.error('kayak flight hours error', err);
      }

      try {
        result.airportsList = await div.$$eval(
          KAYAK_SELECTORS.AIRPORTS,
          airports => airports.map(airport => airport.textContent!).filter(airport => !airport.includes('\n'))
        );
      } catch (err) {
        console.error('kayak airports list error', err);
      }

      try {
        result.priceAndProviderWithLinks = await div.$$eval(
          KAYAK_SELECTORS.LINK,
          links => links.map(link => {
            const flag = link.children[1];

            if (!flag) return null;

            const linkVal = link.getAttribute('href')!;

            if (!linkVal.includes('javascript')) {
              const linkStr = 'https://kayak.co.kr' + link.getAttribute('href')!;
              const price = link.children[0].children[0].textContent?.replace(/\n/g, '').trim()!;
              const provider = link.children[1].textContent?.replace(/\n/g, '').trim()!;

              return { link: linkStr, price, provider };
            }

            return null;
          }).filter(obj => obj !== null)
        );
      } catch (err) {
        console.error('kayak price and provider error', err);
      }

      kayakData.push(result);
    }

    return kayakData;
  })();
};

export default getKayakCrawlingData;
