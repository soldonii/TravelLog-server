"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const promise_poller_1 = __importDefault(require("promise-poller"));
const SKYSCANNER_SITEKEY = '6Lcj-R8TAAAAABs3FrRPuQhLMbp5QrHsHufzLf7b';
const CAPTCHA_APIKEY = '450a7496ba4fb286b62c9cd08d2f1add';
const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const requestCaptchaResults = (apiKey, requestId) => {
    const url = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`;
    return async () => {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await request_promise_native_1.default.get(url);
            const response = JSON.parse(rawResponse);
            if (!response.status) {
                return reject(response.request);
            }
            resolve(response.request);
        });
    };
};
exports.initiateCaptchaRequest = async (url) => {
    const formData = {
        method: 'userrecaptcha',
        googlekey: SKYSCANNER_SITEKEY,
        key: CAPTCHA_APIKEY,
        pageurl: url,
        json: 1
    };
    const response = await request_promise_native_1.default.post('http://2captcha.com/in.php', { form: formData });
    return JSON.parse(response).request;
};
exports.pollForRequestResults = async (requestId, retries = 30, interval = 1500, delay = 15000) => {
    await timeout(delay);
    return promise_poller_1.default({
        taskFn: requestCaptchaResults(CAPTCHA_APIKEY, requestId),
        interval,
        retries
    });
};
