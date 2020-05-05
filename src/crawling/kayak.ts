import puppeteer from 'puppeteer';
import { KAYAK_SELECTORS } from './selectors';

import countryList from '../crawling/countryList.json';

const KAYAK_URI_FRONT = 'https://kayak.co.kr/flights/ICN-';

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

  return KAYAK_URI_FRONT + cityCode + '/' + departureDate + '/' + arrivalDate;
};

// interface IPriceWithLinks {
//   link: string;
//   price: string;
//   provider: string;
// };

// interface Result {
//   airlineImageList: Array<string[]>;
//   departureTimeList: string[];
//   arrivalTimeList: string[];
//   airlinesList: string[];
//   layoverTimeList: string[];
//   layoverAirportList: string[];
//   flightHoursList: string[];
//   airportsList: string[];
//   priceAndProviderWithLinks: Array<IPriceWithLinks>;
// }

const getKayakCrawlingData = (country: string, city: string, travelDates: Array<string>) => {
  const kayakUrl = getKayakSearchUrl(country, city, travelDates);
  const kayakData: any[] = [];

  return (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      slowMo: 10,
      args: ['--window-size=1,1', '--window-position=3000,1000']
    });

    const page = await browser.newPage();
    await page.goto(kayakUrl);
    await page.waitForFunction('document.querySelector(".Common-Results-ProgressBar > .bar") && document.querySelector(".Common-Results-ProgressBar > .bar").style.transform === "translateX(100%)"', {
      timeout: 60000
    });

    const resultDivs = await page.$$(KAYAK_SELECTORS.RESULT_DIV);

    for await (const div of resultDivs) {
      const airlineImageList = await div.$$eval(
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

      const departureTimeList = await div.$$eval(
        KAYAK_SELECTORS.DEPARTURE_TIME,
        times => times.map(time => time.textContent?.replace(/\n/g, '').trim()!)
      );

      const arrivalTimeList = await div.$$eval(
        KAYAK_SELECTORS.ARRIVAL_TIME,
        times => times.map(time => time.textContent?.replace(/\n/g, '').trim()!)
      );

      const airlinesList = await div.$$eval(
        KAYAK_SELECTORS.AIRLINES,
        airlines => airlines.map(airline => airline.textContent?.replace(/\n/g, '').trim()!)
      );

      const layoverTimeList = await div.$$eval(
        KAYAK_SELECTORS.LAYOVER_TIME,
        times => times.map(time => time.textContent?.replace(/\n/g, '').trim()!)
      );

      const layoverAirportList = await div.$$eval(
        KAYAK_SELECTORS.LAYOVER_AIRPORT,
        airports => airports.map(airport => airport.textContent?.replace(/\n/g, '').trim()!)
      );

      const flightHoursList = await div.$$eval(
        KAYAK_SELECTORS.FLIGHT_HOURS,
        hours => hours.map(hour => hour.textContent?.replace(/\n/g, '').trim()!)
      );

      const airportsList = await div.$$eval(
        KAYAK_SELECTORS.AIRPORTS,
        airports => airports.map(airport => airport.textContent!).filter(airport => !airport.includes('\n'))
      );

      const priceAndProviderWithLinks = await div.$$eval(
        KAYAK_SELECTORS.LINK,
        links => links.map(link => {
          const flag = link.children[1]

          if (flag) {
            const linkVal = link.getAttribute('href')!;
            if (!linkVal.includes('javascript')) {
              const linkStr = 'https://kayak.co.kr' + link.getAttribute('href')!;
              const price = link.children[0].children[0].textContent?.replace(/\n/g, '').trim()!;
              const provider = link.children[1].textContent?.replace(/\n/g, '').trim()!;

              return { link: linkStr, price, provider };
            }
          }
        }).filter(obj => obj !== null && obj)
      );

      const result = {
        airlineImageList,
        departureTimeList,
        arrivalTimeList,
        airlinesList,
        layoverTimeList,
        layoverAirportList,
        flightHoursList,
        airportsList,
        priceAndProviderWithLinks
      };

      kayakData.push(result);
    }

    return kayakData;
  })();
};

export default getKayakCrawlingData;
