"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const selectors_1 = require("./selectors");
const countryList_json_1 = __importDefault(require("../crawling/countryList.json"));
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
    return process.env.KAYAK_URI_FRONT + cityCode + '/' + departureDate + '/' + arrivalDate;
};
;
;
const getKayakCrawlingData = (country, city, travelDates) => {
    const kayakUrl = getKayakSearchUrl(country, city, travelDates);
    const kayakData = [];
    return (async () => {
        const browser = await puppeteer_extra_1.default.use(puppeteer_extra_plugin_stealth_1.default()).launch({
            headless: true,
            defaultViewport: null,
            slowMo: 10,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        try {
            await page.goto(kayakUrl, { timeout: 25 * 1000 });
            await page.waitForFunction('document.querySelector(".Common-Results-ProgressBar > .bar") && parseInt(document.querySelector(".Common-Results-ProgressBar > .bar").style.transform.slice(11, -2)) > 30', {
                timeout: 25 * 1000
            });
        }
        catch (err) {
            console.error('kayak connection error', err);
        }
        const resultDivs = await page.$$(selectors_1.KAYAK_SELECTORS.RESULT_DIV);
        for await (const div of resultDivs) {
            const result = {
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
                result.airlineImageList = await div.$$eval(selectors_1.KAYAK_SELECTORS.AIRLINE_IMAGE, divs => divs.map(div => {
                    const imageList = [];
                    const airlines = div.children;
                    for (const airline of airlines) {
                        imageList.push(airline.children[0].getAttribute('src'));
                    }
                    return imageList;
                }));
            }
            catch (err) {
                console.error('kayak image error', err);
            }
            try {
                result.departureTimeList = await div.$$eval(selectors_1.KAYAK_SELECTORS.DEPARTURE_TIME, times => times.map(time => { var _a; return (_a = time.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
            }
            catch (err) {
                console.error('kayak departure time error', err);
            }
            try {
                result.arrivalTimeList = await div.$$eval(selectors_1.KAYAK_SELECTORS.ARRIVAL_TIME, times => times.map(time => { var _a; return (_a = time.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
            }
            catch (err) {
                console.error('kayak arrival time error', err);
            }
            try {
                result.airlinesList = await div.$$eval(selectors_1.KAYAK_SELECTORS.AIRLINES, airlines => airlines.map(airline => { var _a; return (_a = airline.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
            }
            catch (err) {
                console.error('kayak airline list error', err);
            }
            try {
                result.layoverTimeList = await div.$$eval(selectors_1.KAYAK_SELECTORS.LAYOVER_TIME, times => times.map(time => { var _a; return (_a = time.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
            }
            catch (err) {
                console.error('kayak layover time error', err);
            }
            try {
                result.layoverAirportList = await div.$$eval(selectors_1.KAYAK_SELECTORS.LAYOVER_AIRPORT, airports => airports.map(airport => { var _a; return (_a = airport.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
            }
            catch (err) {
                console.error('kayak layover airport list error', err);
            }
            try {
                result.flightHoursList = await div.$$eval(selectors_1.KAYAK_SELECTORS.FLIGHT_HOURS, hours => hours.map(hour => { var _a; return (_a = hour.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
            }
            catch (err) {
                console.error('kayak flight hours error', err);
            }
            try {
                result.airportsList = await div.$$eval(selectors_1.KAYAK_SELECTORS.AIRPORTS, airports => airports.map(airport => airport.textContent).filter(airport => !airport.includes('\n')));
            }
            catch (err) {
                console.error('kayak airports list error', err);
            }
            try {
                result.priceAndProviderWithLinks = await div.$$eval(selectors_1.KAYAK_SELECTORS.LINK, links => links.map(link => {
                    var _a, _b;
                    const flag = link.children[1];
                    if (!flag)
                        return null;
                    const linkVal = link.getAttribute('href');
                    if (!linkVal.includes('javascript')) {
                        const linkStr = 'https://kayak.co.kr' + link.getAttribute('href');
                        const price = (_a = link.children[0].children[0].textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim();
                        const provider = (_b = link.children[1].textContent) === null || _b === void 0 ? void 0 : _b.replace(/\n/g, '').trim();
                        return { link: linkStr, price, provider };
                    }
                    return null;
                }).filter(obj => obj !== null));
            }
            catch (err) {
                console.error('kayak price and provider error', err);
            }
            kayakData.push(result);
        }
        return kayakData;
    })();
};
exports.default = getKayakCrawlingData;
