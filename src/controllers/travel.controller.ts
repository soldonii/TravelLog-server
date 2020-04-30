import { RequestHandler } from 'express';
import puppeteer from 'puppeteer';

// country United States
// city San Francisco
// travelDates [ '2020-05-05T15:00:00.000Z', '2020-05-14T14:59:59.999Z' ]

import getKayakCrawlingData from '../crawling/kayak';
import getAirbnbCrawlingData from '../crawling/airbnb';

export const getCrawlingData: RequestHandler = async (req, res) => {
  const { country, city, travelDates }: { country: string, city: string, travelDates: Array<string> } = req.body;

  const kayakData = getKayakCrawlingData(country, city, travelDates);
  // const airbnbData = await getAirbnbCrawlingData(city, travelDates);

  res.status(200).send('hello');
};
