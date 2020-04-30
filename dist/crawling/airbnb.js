"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const selectors_1 = require("./selectors");
const AIRBNB_SEARCH_URI_FRONT = 'https://airbnb.co.kr/s/';
const AIRBNB_SEARCH_URI_MID = '/homes?tab_id=all_tab&refinement_paths%5B%5D=%2Fhomes&';
const AIRBNB_SEARCH_URI_BACK = '&adults=1&source=structured_search_input_header&search_type=search_query';
const getAirbnbSearchUrl = (city, travelDates) => {
    const departureDate = travelDates[0].slice(0, 10);
    const arrivalDate = travelDates[1].slice(0, 10);
    return AIRBNB_SEARCH_URI_FRONT + city + AIRBNB_SEARCH_URI_MID
        + `checkin=${departureDate}&checkout=${arrivalDate}` + AIRBNB_SEARCH_URI_BACK;
};
const getAirbnbCrawlingData = (city, travelDates) => {
    const airbnbUrl = getAirbnbSearchUrl(city, travelDates);
    return (async () => {
        const browser = await puppeteer_1.default.launch({ headless: false, defaultViewport: null, slowMo: 10 });
        const page = await browser.newPage();
        await page.goto(airbnbUrl, { waitUntil: 'networkidle0' });
        const typeList = await page.$$eval(selectors_1.AIRBNB_SELECTORS.TYPE, types => types.map(type => type.textContent));
        const titleList = await page.$$eval(selectors_1.AIRBNB_SELECTORS.TITLE, titles => titles.map(title => title.textContent));
        const infoList = await page.$$eval(selectors_1.AIRBNB_SELECTORS.INFO, infos => infos.map(info => info.textContent));
        const priceList = await page.$$eval(selectors_1.AIRBNB_SELECTORS.PRICE, prices => prices.filter(price => price.textContent !== '최저').map(price => price.textContent));
        const imageList = await page.$$eval(selectors_1.AIRBNB_SELECTORS.IMAGE, images => images.map(image => image.getAttribute('style')));
        const linkList = await page.$$eval(selectors_1.AIRBNB_SELECTORS.LINK, links => links.map(link => link.getAttribute('href')));
        return {
            typeList,
            titleList,
            infoList,
            priceList,
            imageList,
            linkList
        };
    })();
};
exports.default = getAirbnbCrawlingData;
