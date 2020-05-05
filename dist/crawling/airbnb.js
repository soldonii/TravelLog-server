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
;
const getAirbnbCrawlingData = (city, travelDates) => {
    const airbnbUrl = getAirbnbSearchUrl(city, travelDates);
    const airbnbData = [];
    return (async () => {
        const browser = await puppeteer_1.default.launch({ headless: false, defaultViewport: null, slowMo: 10 });
        const page = await browser.newPage();
        await page.goto(airbnbUrl, { waitUntil: 'networkidle0' });
        const resultDivs = await page.$$(selectors_1.AIRBNB_SELECTORS.RESULT_DIV);
        for await (const div of resultDivs) {
            let description = '';
            let title = '';
            let infoList = [];
            let price = [];
            let image = '';
            let link = '';
            try {
                const descSelector1 = await div.$(selectors_1.AIRBNB_SELECTORS.DESCRIPTION1);
                const descSelector2 = await div.$(selectors_1.AIRBNB_SELECTORS.DESCRIPTION2);
                const descSelector3 = await div.$(selectors_1.AIRBNB_SELECTORS.DESCRIPTION3);
                let descriptionSelector;
                if (descSelector1)
                    descriptionSelector = selectors_1.AIRBNB_SELECTORS.DESCRIPTION1;
                else if (descSelector2)
                    descriptionSelector = selectors_1.AIRBNB_SELECTORS.DESCRIPTION2;
                else if (descSelector3)
                    descriptionSelector = selectors_1.AIRBNB_SELECTORS.DESCRIPTION3;
                if (descriptionSelector) {
                    description = await div.$eval(descriptionSelector, desc => { var _a; return (_a = desc.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); });
                }
            }
            catch (err) {
                console.error('airbnb description error', err);
            }
            try {
                const titleSelector1 = await div.$(selectors_1.AIRBNB_SELECTORS.TITLE1);
                const titleSelector2 = await div.$(selectors_1.AIRBNB_SELECTORS.TITLE2);
                let titleSelector;
                if (titleSelector1)
                    titleSelector = selectors_1.AIRBNB_SELECTORS.TITLE1;
                else if (titleSelector2)
                    titleSelector = selectors_1.AIRBNB_SELECTORS.TITLE2;
                if (titleSelector) {
                    title = await div.$eval(titleSelector, title => { var _a; return (_a = title.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); });
                }
            }
            catch (err) {
                console.error('airbnb title error', err);
            }
            try {
                const infoSelector1 = await div.$(selectors_1.AIRBNB_SELECTORS.INFO1);
                const infoSelector2 = await div.$(selectors_1.AIRBNB_SELECTORS.INFO2);
                let infoSelector;
                if (infoSelector1)
                    infoSelector = selectors_1.AIRBNB_SELECTORS.INFO1;
                else if (infoSelector2)
                    infoSelector = selectors_1.AIRBNB_SELECTORS.INFO2;
                if (infoSelector) {
                    infoList = await div.$$eval(infoSelector, infos => infos.map(info => { var _a; return (_a = info.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
                }
            }
            catch (err) {
                console.error('airbnb infoList error', err);
            }
            try {
                const priceSelector = await div.$(selectors_1.AIRBNB_SELECTORS.PRICE);
                if (priceSelector) {
                    price = await div.$$eval(selectors_1.AIRBNB_SELECTORS.PRICE, prices => prices.filter(price => price.textContent !== '최저')
                        .map(price => {
                        var _a;
                        return ((_a = price.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n|이전 가격:|할인 가격:|가격:/gi, '').trim()).split('₩').slice(1);
                    })[0]);
                }
            }
            catch (err) {
                console.error('airbnb price error', err);
            }
            try {
                const imageSelector1 = await div.$(selectors_1.AIRBNB_SELECTORS.IMAGE1);
                const imageSelector2 = await div.$(selectors_1.AIRBNB_SELECTORS.IMAGE2);
                const imageSelector3 = await div.$(selectors_1.AIRBNB_SELECTORS.IMAGE3);
                let imageSelector;
                if (imageSelector3) {
                    image = await div.$eval(selectors_1.AIRBNB_SELECTORS.IMAGE3, image => image.getAttribute('data-original-uri'));
                }
                else {
                    if (imageSelector1)
                        imageSelector = selectors_1.AIRBNB_SELECTORS.IMAGE1;
                    else if (imageSelector2)
                        imageSelector = selectors_1.AIRBNB_SELECTORS.IMAGE2;
                    if (imageSelector) {
                        image = await div.$eval(imageSelector, image => { var _a; return ((_a = image.getAttribute('style')) === null || _a === void 0 ? void 0 : _a.slice(0, -3).match(/\bhttps?:\/\/\S+/gi))[0]; });
                    }
                }
            }
            catch (err) {
                console.error('airbnb image error', err);
            }
            try {
                const linkSelector = await div.$(selectors_1.AIRBNB_SELECTORS.LINK);
                if (linkSelector) {
                    link = await div.$eval(selectors_1.AIRBNB_SELECTORS.LINK, link => 'https://airbnb.co.kr' + link.getAttribute('href'));
                }
            }
            catch (err) {
                console.error('airbnb link error', err);
            }
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
