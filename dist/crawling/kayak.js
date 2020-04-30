"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const selectors_1 = require("./selectors");
const countryList_json_1 = __importDefault(require("../crawling/countryList.json"));
const KAYAK_URI_FRONT = 'https://www.kayak.co.kr/flights/ICN-';
const getCityCode = (countryName, cityName) => {
    for (const country of countryList_json_1.default) {
        if (country.Name === countryName) {
            for (const city of country.Cities) {
                if (city.Name === cityName) {
                    return city.IataCode;
                }
            }
        }
    }
};
const getKayakSearchUrl = (country, city, travelDates) => {
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
const getKayakCrawlingData = (country, city, travelDates) => {
    const kayakUrl = getKayakSearchUrl(country, city, travelDates);
    return (async () => {
        const browser = await puppeteer_1.default.launch({ headless: false, defaultViewport: null, slowMo: 10 });
        const page = await browser.newPage();
        await page.goto(kayakUrl, { waitUntil: 'networkidle0' });
        const airlineImageList = await page.$$eval(selectors_1.KAYAK_SELECTORS.AIRLINE_IMAGE, divs => divs.map(div => {
            const imageList = [];
            const airlines = div.children;
            for (const airline of airlines) {
                imageList.push(airline.children[0].getAttribute('src'));
            }
            return imageList;
        }));
        const departureTimeList = await page.$$eval(selectors_1.KAYAK_SELECTORS.DEPARTURE_TIME, times => times.map(time => time.textContent));
        const arrivalTimeList = await page.$$eval(selectors_1.KAYAK_SELECTORS.ARRIVAL_TIME, times => times.map(time => time.textContent));
        const airlinesList = await page.$$eval(selectors_1.KAYAK_SELECTORS.AIRLINES, airlines => airlines.map(airline => airline.textContent)); // \n 없애기
        const layoverTimeList = await page.$$eval(selectors_1.KAYAK_SELECTORS.LAYOVER_TIME, times => times.map(time => time.textContent)); // \n 없애기
        const layoverAirportList = await page.$$eval(selectors_1.KAYAK_SELECTORS.LAYOVER_AIRPORT, airports => airports.map(airport => airport.textContent));
        const flightHoursList = await page.$$eval(selectors_1.KAYAK_SELECTORS.FLIGHT_HOURS, hours => hours.map(hour => hour.textContent)); // \n 없애기
        const airportsList = await page.$$eval(selectors_1.KAYAK_SELECTORS.AIRPORTS, airports => airports.map(airport => airport.textContent));
        const priceList = await page.$$eval(selectors_1.KAYAK_SELECTORS.PRICE, prices => prices.map(price => price.textContent));
        const linkList = await page.$$eval(selectors_1.KAYAK_SELECTORS.LINK, links => links.map(link => link.getAttribute('href'))); // link가 나오지 않음.
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
exports.default = getKayakCrawlingData;
