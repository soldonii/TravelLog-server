import request from 'request-promise-native';
import poll from 'promise-poller';

const SKYSCANNER_SITEKEY = '6Lcj-R8TAAAAABs3FrRPuQhLMbp5QrHsHufzLf7b';
const CAPTCHA_APIKEY = '450a7496ba4fb286b62c9cd08d2f1add';

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const requestCaptchaResults = (apiKey: string, requestId: string) => {
  const url = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`;

  return async () => {
    return new Promise(async (resolve, reject) => {
      const rawResponse = await request.get(url);
      const response = JSON.parse(rawResponse);

      if (!response.status) {
        return reject(response.request);
      }

      resolve(response.request);
    });
  };
};

export const initiateCaptchaRequest = async (url: string) => {
  const formData = {
    method: 'userrecaptcha',
    googlekey: SKYSCANNER_SITEKEY,
    key: CAPTCHA_APIKEY,
    pageurl: url,
    json: 1
  };

  const response = await request.post('http://2captcha.com/in.php', { form: formData });
  return JSON.parse(response).request;
};

export const pollForRequestResults = async (requestId: string, retries = 30, interval = 1500, delay = 15000) => {
  await timeout(delay);

  return poll({
    taskFn: requestCaptchaResults(CAPTCHA_APIKEY, requestId),
    interval,
    retries
  });
};
