import { RequestHandler } from 'express';

import getKayakCrawlingData from '../crawling/kayak';
import getAirbnbCrawlingData from '../crawling/airbnb';

export const getCrawlingData: RequestHandler = async (req, res) => {
  const { country, city, travelDates }: { country: string, city: string, travelDates: Array<string> } = req.body;

  const kayakData = await getKayakCrawlingData(country, city, travelDates);
  console.log('kayak', kayakData);
  const airbnbData = await getAirbnbCrawlingData(city, travelDates);
  console.log('airbnb', airbnbData);

  res.status(200).json({
    result: 'success',
    kayak: kayakData,
    airbnb: airbnbData
  });
};
