import { RequestHandler } from 'express';
import util from 'util';
import fs from 'fs';

import getKayakCrawlingData from '../crawling/kayak';
import getAirbnbCrawlingData from '../crawling/airbnb';

import sample from '../crawling/sampleData.json';

export const getCrawlingData: RequestHandler = async (req, res) => {
  const { country, city, travelDates }: { country: string, city: string, travelDates: Array<string> } = req.body;

  // const timeout = setTimeout(() => {
  //   res.status(200).json({
  //     result: 'success mocking',
  //     kayak: sample[0],
  //     airbnb: sample[1]
  //   });
  //   // res.status(500).json({
  //   //   errorMessage: 'error'
  //   // });

  //   clearTimeout(timeout);
  // }, 2000);

  const kayakData = await getKayakCrawlingData(country, city, travelDates);
  console.log(util.inspect(kayakData, { showHidden: false, depth: null }));

  const airbnbData = await getAirbnbCrawlingData(city, travelDates);
  console.log('airbnbData', util.inspect(airbnbData, { showHidden: false, depth: null }));

  res.status(200).json({
    result: 'success',
    kayak: kayakData,
    airbnb: airbnbData
  });
};
