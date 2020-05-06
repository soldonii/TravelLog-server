"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const selectors_1 = require("./selectors");
const getAirbnbSearchUrl = (city, travelDates) => {
    const departureDate = travelDates[0].slice(0, 10);
    const arrivalDate = travelDates[1].slice(0, 10);
    return process.env.AIRBNB_SEARCH_URI_FRONT + city + process.env.AIRBNB_SEARCH_URI_MID
        + `checkin=${departureDate}&checkout=${arrivalDate}` + process.env.AIRBNB_SEARCH_URI_BACK;
};
;
async function findValidSelector(targetDiv, ...args) {
    for await (const selector of args) {
        const result = await targetDiv.$(selector);
        if (result) {
            return selector;
        }
    }
}
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
                const validDescriptionSelector = await findValidSelector(div, selectors_1.AIRBNB_SELECTORS.DESCRIPTION1, selectors_1.AIRBNB_SELECTORS.DESCRIPTION2, selectors_1.AIRBNB_SELECTORS.DESCRIPTION3);
                if (validDescriptionSelector) {
                    description = await div.$eval(validDescriptionSelector, description => { var _a; return (_a = description.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); });
                }
            }
            catch (err) {
                console.error('airbnb description error', err);
            }
            try {
                const validTitleSelector = await findValidSelector(div, selectors_1.AIRBNB_SELECTORS.TITLE1, selectors_1.AIRBNB_SELECTORS.TITLE2);
                if (validTitleSelector) {
                    title = await div.$eval(validTitleSelector, title => { var _a; return (_a = title.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); });
                }
            }
            catch (err) {
                console.error('airbnb title error', err);
            }
            try {
                const validInfoSelector = await findValidSelector(div, selectors_1.AIRBNB_SELECTORS.INFO1, selectors_1.AIRBNB_SELECTORS.INFO2);
                if (validInfoSelector) {
                    infoList = await div.$$eval(validInfoSelector, infos => infos.map(info => { var _a; return (_a = info.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim(); }));
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
                const validImageSelector = await findValidSelector(div, selectors_1.AIRBNB_SELECTORS.IMAGE1, selectors_1.AIRBNB_SELECTORS.IMAGE2, selectors_1.AIRBNB_SELECTORS.IMAGE3);
                if (validImageSelector) {
                    if (validImageSelector === selectors_1.AIRBNB_SELECTORS.IMAGE3) {
                        image = await div.$eval(validImageSelector, image => image.getAttribute('data-original-uri'));
                    }
                    else {
                        image = await div.$eval(validImageSelector, image => { var _a; return ((_a = image.getAttribute('style')) === null || _a === void 0 ? void 0 : _a.slice(0, -3).match(/\bhttps?:\/\/\S+/gi))[0]; });
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
        await browser.close();
        return airbnbData;
    })();
};
exports.default = getAirbnbCrawlingData;
