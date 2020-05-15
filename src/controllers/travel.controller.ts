import { RequestHandler } from 'express';

import getKayakCrawlingData from '../crawling/kayak';
import getAirbnbCrawlingData from '../crawling/airbnb';

import Travel from '../models/Travel';

export const getKayakData: RequestHandler = async (req, res) => {
  const { country, city, travelDates }: { country: string, city: string, travelDates: Array<string> } = req.body;

  const kayakData = await getKayakCrawlingData(country, city, travelDates);

  res.status(200).json({
    result: 'success',
    kayak: kayakData
  });
};

export const getAirbnbData: RequestHandler = async (req, res) => {
  const { city, travelDates }: { city: string, travelDates: Array<string> } = req.body;

  const airbnbData = await getAirbnbCrawlingData(city, travelDates);

  res.status(200).json({
    result: 'success',
    airbnb: airbnbData
  });
};

export const sendAllTravelData: RequestHandler = async (req, res) => {
  const allTravels = await Travel.find({});

  res.status(200).json({
    allTravels
  });
};
