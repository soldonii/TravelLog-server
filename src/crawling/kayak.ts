import puppeteer from 'puppeteer';
import { KAYAK_SELECTORS } from './selectors';

import countryList from '../crawling/countryList.json';

const KAYAK_URI_FRONT = 'https://www.kayak.co.kr/flights/ICN-';

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
  const arrivalDate = travelDates[0].slice(0, 10);

  return KAYAK_URI_FRONT + cityCode + '/' + departureDate + '/' + arrivalDate;
};

// interface KayakData {
//   airlineImageList: any[],
//   departureTimeList: string[],
//   arrivalTimeList: string[],
//   airlinesList: string[],
//   layoverTimeList: string[],
//   layoverAirportList: string[],
//   flightHoursList: string[],
//   airportsList: string[],
//   priceList: string[],
//   linkList: string[]
// };

const getKayakCrawlingData = (country: string, city: string, travelDates: Array<string>) => {
  const kayakUrl = getKayakSearchUrl(country, city, travelDates);

  return (async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, slowMo: 10 });
    const page = await browser.newPage();

    await page.goto(kayakUrl, { waitUntil: 'networkidle0' });

    const airlineImageList = await page.$$eval(
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

    const departureTimeList = await page.$$eval(
      KAYAK_SELECTORS.DEPARTURE_TIME,
      times => times.map(time => time.textContent!)
    );

    const arrivalTimeList = await page.$$eval(
      KAYAK_SELECTORS.ARRIVAL_TIME,
      times => times.map(time => time.textContent!)
    );

    const airlinesList = await page.$$eval(
      KAYAK_SELECTORS.AIRLINES,
      airlines => airlines.map(airline => airline.textContent!)
    ); // \n 없애기

    const layoverTimeList = await page.$$eval(
      KAYAK_SELECTORS.LAYOVER_TIME,
      times => times.map(time => time.textContent!)
    ); // \n 없애기

    const layoverAirportList = await page.$$eval(
      KAYAK_SELECTORS.LAYOVER_AIRPORT,
      airports => airports.map(airport => airport.textContent!)
    );

    const flightHoursList = await page.$$eval(
      KAYAK_SELECTORS.FLIGHT_HOURS,
      hours => hours.map(hour => hour.textContent!)
    ); // \n 없애기

    const airportsList = await page.$$eval(
      KAYAK_SELECTORS.AIRPORTS,
      airports => airports.map(airport => airport.textContent!)
    );

    const priceList = await page.$$eval(
      KAYAK_SELECTORS.PRICE,
      prices => prices.map(price => price.textContent!)
    );

    const linkList = await page.$$eval(
      KAYAK_SELECTORS.LINK,
      links => links.map(link => link.getAttribute('href')!)
    ); // link가 나오지 않음.

    console.log({
      airlineImageList,
      departureTimeList,
      arrivalTimeList,
      airlinesList,
      layoverTimeList,
      layoverAirportList,
      flightHoursList,
      airportsList,
      priceList,
      linkList
    });

    return {
      airlineImageList,
      departureTimeList,
      arrivalTimeList,
      airlinesList,
      layoverTimeList,
      layoverAirportList,
      flightHoursList,
      airportsList,
      priceList,
      linkList
    };
  })();
};

export default getKayakCrawlingData;
