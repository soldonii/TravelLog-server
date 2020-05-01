import util from 'util';
import { RequestHandler } from 'express';

import getKayakCrawlingData from '../crawling/kayak';
import getAirbnbCrawlingData from '../crawling/airbnb';
import sample from '../crawling/sampleData.json';

export const getCrawlingData: RequestHandler = async (req, res) => {
  const { country, city, travelDates }: { country: string, city: string, travelDates: Array<string> } = req.body;

  const timeout = setTimeout(() => {
    res.status(200).send(sample);

    clearTimeout(timeout);
  }, 5000);

  // const kayakData = await getKayakCrawlingData(country, city, travelDates);
  // console.log(util.inspect(kayakData, { showHidden: false, depth: null }));

  // const airbnbData = await getAirbnbCrawlingData(city, travelDates);
  // console.log('airbnb', airbnbData);

  // res.status(200).json({
  //   result: 'success',
  //   kayak: kayakData,
  //   // airbnb: airbnbData
  // });
};
