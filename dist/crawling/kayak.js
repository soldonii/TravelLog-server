"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const selectors_1 = require("./selectors");
const countryList_json_1 = __importDefault(require("../crawling/countryList.json"));
const KAYAK_URI_FRONT = 'https://kayak.co.kr/flights/ICN-';
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
const getKayakCrawlingData = (country, city, travelDates) => {
    const kayakUrl = getKayakSearchUrl(country, city, travelDates);
    const kayakData = [];
    return (async () => {
        const browser = await puppeteer_1.default.launch({
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
            const priceAndProviderWithLinks = await div.$$eval(selectors_1.KAYAK_SELECTORS.LINK, links => links.map(link => {
                var _a, _b;
                const flag = link.children[1];
                if (flag) {
                    const linkVal = link.getAttribute('href');
                    if (!linkVal.includes('javascript')) {
                        const linkStr = 'https://kayak.co.kr' + link.getAttribute('href');
                        const price = (_a = link.children[0].children[0].textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim();
                        const provider = (_b = link.children[1].textContent) === null || _b === void 0 ? void 0 : _b.replace(/\n/g, '').trim();
                        return { link: linkStr, price, provider };
                    }
                }
            }).filter(obj => obj !== null && obj));
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
exports.default = getKayakCrawlingData;
