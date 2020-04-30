// import puppeteer, { Page } from 'puppeteer';

// import { SKYSCANNER_SELECTORS } from './selectors';
// import { initiateCaptchaRequest, pollForRequestResults } from './captchaHelpers';

// import cityList from '../crawling/cityList.json';

// const SKYSCANNER_SEARCH_URI_FRONT = 'https://www.skyscanner.co.kr/transport/flights/sela';
// const SKYSCANNER_SEARCH_URI_BACK = '?adults=1&children=0&adultsv2=1&childrenv2=&infants=0&cabinclass=economy&rtn=1&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&ref=home';

// const getSkyScannerSearchUrl = (city: string, travelDates: Array<string>) => {
//   const cityId = cityList.find(item => item.officialName === city)?.id;
//   const startDate = travelDates[0].slice(2, 10).replace(/-/gi, '');
//   const endDate = travelDates[1].slice(2, 10).replace(/-/gi, '');

//   const searchUrl
//     = SKYSCANNER_SEARCH_URI_FRONT + '/' + cityId + '/'
//       + startDate + '/' + endDate + '/' + SKYSCANNER_SEARCH_URI_BACK;

//   return searchUrl;
// };

// // interface User {
// //   typeList: string[],
// //   titleList: string[],
// //   infoList: string[],
// //   priceList: string[],
// //   linkList: string[]
// // };

// const passRecaptcha = async (page: Page, url: string) => {
//   try {
//     await page.waitForSelector('.g-recaptcha', { timeout: 10000 });

//     const requestId = await initiateCaptchaRequest(url); // 63783224969
//     const response = await pollForRequestResults(requestId);

//     await page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${response}";`);
//   } catch (err) {
//     console.error('recaptcha doesn\'t appeared.', err);
//   }

//   return;
// };

// const getSkyScannerCrawlingData = (city: string, travelDates: Array<string>) => {
//   const skyScannerUrl = getSkyScannerSearchUrl(city, travelDates);

//   return (async () => {
//     const browser = await puppeteer.launch({ headless: false, defaultViewport: null, slowMo: 10 });
//     const page = await browser.newPage();

//     await page.goto('https://www.kayak.co.kr/flights/ICN-ATL/2020-05-29/2020-06-05?sort=bestflight_a');
//     // await passRecaptcha(page, skyScannerUrl);

//     // await page.waitForSelector(SKYSCANNER_SELECTORS.SUMMARY);
//     // const summary = await page.$eval(SKYSCANNER_SELECTORS.SUMMARY, summary => summary.textContent!);

//     // console.log('summary', summary);
//   })();
// };

// export default getSkyScannerCrawlingData;
