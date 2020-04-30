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
        const airbnbData = [];
        const resultDivs = await page.$$(selectors_1.AIRBNB_SELECTORS.RESULT_DIV);
        for (const div of resultDivs) {
            const descFlag1 = await div.$(selectors_1.AIRBNB_SELECTORS.DESCRIPTION1);
            let description;
            if (descFlag1) {
                description = await div.$eval(selectors_1.AIRBNB_SELECTORS.DESCRIPTION1, description => { var _a; return (_a = description.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); });
            }
            else {
                const descFlag2 = await div.$(selectors_1.AIRBNB_SELECTORS.DESCRIPTION2);
                if (descFlag2) {
                    description = await div.$eval(selectors_1.AIRBNB_SELECTORS.DESCRIPTION2, description => { var _a; return (_a = description.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); });
                }
                else {
                    description = await div.$eval(selectors_1.AIRBNB_SELECTORS.DESCRIPTION3, description => { var _a; return (_a = description.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); });
                }
            }
            const titleFlag = await div.$(selectors_1.AIRBNB_SELECTORS.TITLE1);
            let title;
            if (titleFlag) {
                title = await div.$eval(selectors_1.AIRBNB_SELECTORS.TITLE1, title => { var _a; return (_a = title.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); });
            }
            else {
                title = await div.$eval(selectors_1.AIRBNB_SELECTORS.TITLE2, title => { var _a; return (_a = title.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); });
            }
            const infoFlag = await div.$(selectors_1.AIRBNB_SELECTORS.INFO1);
            let infoList;
            if (infoFlag) {
                infoList = await div.$$eval(selectors_1.AIRBNB_SELECTORS.INFO1, infos => infos.map(info => { var _a; return (_a = info.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
            }
            else {
                infoList = await div.$$eval(selectors_1.AIRBNB_SELECTORS.INFO2, infos => infos.map(info => { var _a; return (_a = info.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
            }
            const price = await div.$$eval(selectors_1.AIRBNB_SELECTORS.PRICE, prices => prices.filter(price => price.textContent !== '최저')
                .map(price => { var _a; return (_a = price.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); })[0]);
            const imageFlag = await div.$(selectors_1.AIRBNB_SELECTORS.IMAGE1);
            let image;
            if (imageFlag) {
                image = await div.$eval(selectors_1.AIRBNB_SELECTORS.IMAGE1, image => { var _a; return ((_a = image.getAttribute('style')) === null || _a === void 0 ? void 0 : _a.match(/\bhttps?:\/\/\S+/gi))[0]; });
            }
            else {
                image = await div.$eval(selectors_1.AIRBNB_SELECTORS.IMAGE2, image => { var _a; return ((_a = image.getAttribute('style')) === null || _a === void 0 ? void 0 : _a.match(/\bhttps?:\/\/\S+/gi))[0]; });
            }
            const link = await div.$eval(selectors_1.AIRBNB_SELECTORS.LINK, link => 'https://airbnb.co.kr' + link.getAttribute('href'));
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
exports.default = getAirbnbCrawlingData;
