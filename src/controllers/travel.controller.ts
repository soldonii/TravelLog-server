import util from 'util';
import { RequestHandler } from 'express';

import axios from 'axios';

import getKayakCrawlingData from '../crawling/kayak';
import getAirbnbCrawlingData from '../crawling/airbnb';

import sample from '../crawling/sampleData.json';
import sampleQuotes from '../lib/sampleQuotes.json';
import currency from '../lib/currency.json';

import Travel from '../models/Travel';

import CATEGORY from '../lib/expenditureCategory';

export const getCrawlingData: RequestHandler = async (req, res) => {
  const { country, city, travelDates }: { country: string, city: string, travelDates: Array<string> } = req.body;

  const timeout = setTimeout(() => {
    res.status(200).send(sample);

    clearTimeout(timeout);
  }, 5000);

  // const kayakData = await getKayakCrawlingData(country, city, travelDates);
  // console.log(util.inspect(kayakData, { showHidden: false, depth: null }));

  // const airbnbData = await getAirbnbCrawlingData(city, travelDates);
  // console.log(util.inspect(airbnbData, { showHidden: false, depth: null }));

  // res.status(200).json({
  //   result: 'success',
  //   kayak: kayakData,
  //   // airbnb: airbnbData
  // });
};

export const saveTravelData: RequestHandler = async (req, res) => {
  const { flightPrice, accomodationPrice, travelCountry, travelDayList } = req.body;
  travelDayList.splice(0, 0, '출발 전');

  const dates = {};
  travelDayList.forEach(day => dates[day] = []);
  dates['출발 전'].push({
    category: CATEGORY.FLIGHT,
    description: '항공권 구매',
    amount: flightPrice,
    location: {
      title: '출발 전',
      coordinates: ''
    },
    memo: '항공권 구매'
  }, {
    category: CATEGORY.ACCOMODATION,
    description: '에어비앤비 숙소 구매',
    amount: accomodationPrice,
    location: {
      title: '출발 전',
      coordinates: ''
    },
    memo: '에어비앤비 숙소 구매'
  });

  try {
    const newTravel = await Travel.create({
      country: travelCountry,
      dates
    });

    res.status(200).json({
      travelId: newTravel._id
    });
  } catch (err) {
    console.error('saving travel info error', err);
    res.status(500).json({
      errorMessage: 'Server error. Please try again.'
    });
  }
};

export const sendInitialData: RequestHandler = async (req, res) => {
  const { travelId } = req.query;

  // 위 아이디에 해당되는 정보 뽑아서 가져다주기.
  const travel = await Travel.findById(travelId);

  const travelCountry = travel!.country;
  // const flightPrice = travel!.dates['출발 전'][0].amount;
  // const accomodationPrice = travel!.dates['출발 전'][1].amount;

  const currencyCode = Object.keys(currency).find(code => {
    return currency[code].toLowerCase().includes(travelCountry.toLowerCase())
  });

  // const { response: { data: { quotes } } } = await axios.get(process.env.CURRENCY_API_ENDPOINT);
  const quotes = sampleQuotes;

  const usdToCode = quotes[`USD${currencyCode}`];
  const usdToWon = quotes.USDKRW;

  const currencyExchange = Math.round(usdToWon / usdToCode);

  res.status(200).json({
    travelCountry,
    spendingByDates: travel!.dates,
    currencyExchange,
    currencyCode
  });
};
