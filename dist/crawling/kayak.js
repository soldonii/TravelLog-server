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
    const arrivalDate = travelDates[1].slice(0, 10);
    return KAYAK_URI_FRONT + cityCode + '/' + departureDate + '/' + arrivalDate;
};
const getKayakCrawlingData = (country, city, travelDates) => {
    const kayakUrl = getKayakSearchUrl(country, city, travelDates);
    return (async () => {
        const browser = await puppeteer_1.default.launch({ headless: false, defaultViewport: null, slowMo: 10 });
        const page = await browser.newPage();
        await page.goto(kayakUrl, { waitUntil: 'networkidle0' });
        const kayakData = [];
        const resultDivs = await page.$$(selectors_1.KAYAK_SELECTORS.RESULT_DIV);
        for await (const div of resultDivs) {
            const airlineImageList = await div.$$eval(selectors_1.KAYAK_SELECTORS.AIRLINE_IMAGE, divs => divs.map(div => {
                const imageList = [];
                const airlines = div.children;
                for (const airline of airlines) {
                    imageList.push(airline.children[0].getAttribute('src'));
                }
                return imageList;
            }));
            const departureTimeList = await div.$$eval(selectors_1.KAYAK_SELECTORS.DEPARTURE_TIME, times => times.map(time => { var _a; return (_a = time.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
            const arrivalTimeList = await div.$$eval(selectors_1.KAYAK_SELECTORS.ARRIVAL_TIME, times => times.map(time => { var _a; return (_a = time.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
            const airlinesList = await div.$$eval(selectors_1.KAYAK_SELECTORS.AIRLINES, airlines => airlines.map(airline => { var _a; return (_a = airline.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
            const layoverTimeList = await div.$$eval(selectors_1.KAYAK_SELECTORS.LAYOVER_TIME, times => times.map(time => { var _a; return (_a = time.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
            const layoverAirportList = await div.$$eval(selectors_1.KAYAK_SELECTORS.LAYOVER_AIRPORT, airports => airports.map(airport => { var _a; return (_a = airport.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
            const flightHoursList = await div.$$eval(selectors_1.KAYAK_SELECTORS.FLIGHT_HOURS, hours => hours.map(hour => { var _a; return (_a = hour.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
            const airportsList = await div.$$eval(selectors_1.KAYAK_SELECTORS.AIRPORTS, airports => airports.map(airport => airport.textContent).filter(airport => !airport.includes('\n')));
            const priceList = await div.$$eval(selectors_1.KAYAK_SELECTORS.PRICE, prices => prices.map(price => { var _a; return (_a = price.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
            const linkList = await div.$$eval(selectors_1.KAYAK_SELECTORS.LINK, links => links.map(link => 'https://kayak.co.kr' + link.getAttribute('href')));
            const result = {
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
            kayakData.push(result);
        }
        return kayakData;
    })();
};
exports.default = getKayakCrawlingData;
