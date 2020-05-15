import { RequestHandler } from 'express';
import rs from 'randomstring';
// import axios from 'axios';

import Travel from '../models/Travel';

import CURRENCY_CODE from '../lib/currencyCode.json';
import CURRENCY from '../crawling/currency.json';
import CATEGORY from '../lib/spendingCategory';

const SEOUL_LATLNG = {
  lat: 37.566536,
  lng: 126.977966
};

interface TravelData {
  flightPrice: number;
  accomodationPrice: number;
  travelCountry: string;
  travelDayList: string[]
};

export const saveTravelData: RequestHandler = async (req, res) => {
  const { flightPrice, accomodationPrice, travelCountry, travelDayList }: TravelData = req.body
  travelDayList.splice(0, 0, '출발 전');

  const spendingByDates = {};

  travelDayList.forEach((day: string) => spendingByDates[day] = []);

  spendingByDates['출발 전'].push({
    category: CATEGORY.FLIGHT,
    description: '항공권 구매',
    amount: flightPrice,
    location: {
      title: '출발 전',
      coordinates: { lat: SEOUL_LATLNG.lat, lng: SEOUL_LATLNG.lng }
    },
    spendingId: rs.generate(6)
  }, {
    category: CATEGORY.ACCOMODATION,
    description: '에어비앤비 숙소 구매',
    amount: accomodationPrice,
    location: {
      title: '출발 전',
      coordinates: { lat: SEOUL_LATLNG.lat, lng: SEOUL_LATLNG.lng }
    },
    spendingId: rs.generate(6)
  });

  try {
    const newTravel = await Travel.create({
      country: travelCountry,
      spendingByDates
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

  const travel = await Travel.findById(travelId);
  const travelCountry = travel!.country;

  const currencyCode = Object.keys(CURRENCY_CODE).find(code => {
    return CURRENCY_CODE[code].toLowerCase().includes(travelCountry.toLowerCase())
  }) || 'USD';

  // api request limit exceeded.(2020-05-08)
  // const response = await axios.get(process.env.CURRENCY_API_ENDPOINT);
  const quotes = CURRENCY;

  const USD_TO_CURRENCYCODE = quotes[`USD${currencyCode}`];
  const USD_TO_KOREAN_CURRENCY = quotes.USDKRW;

  const currencyExchange = Math.round(USD_TO_KOREAN_CURRENCY / USD_TO_CURRENCYCODE);

  res.status(200).json({
    travelCountry,
    spendingByDates: travel!.spendingByDates,
    currencyExchange,
    currencyCode,
  });
};

interface Spending {
  travelId: string,
  day: string,
  spending: string,
  chosenCategory: string,
  description: string,
  location: string,
  coordinates: {
    lat: number,
    lng: number
  }
  spendingId: string
}

export const registerSpending: RequestHandler = async (req, res) => {
  const data: Spending = req.body.data;

  const { travelId, day, spending, chosenCategory, description, location, coordinates, spendingId } = data;

  const spendingData = {
    category: chosenCategory,
    description,
    amount: parseInt(spending),
    location: {
      title: location,
      coordinates
    },
    spendingId
  };

  try {
    const currentTravel = await Travel.findById(travelId);
    const spendingByDates = currentTravel!.spendingByDates;


    let prevDay;
    let index;
    for (const dayStr in spendingByDates) {
      const idx = spendingByDates[dayStr].findIndex((list: Spending) => list.spendingId === spendingId);

      if (idx > -1) {
        if (dayStr !== day) {
          prevDay = dayStr;
          index = idx;
        } else {
          spendingByDates[dayStr].splice(idx, 1);
        }
      }
    }

    if (prevDay) spendingByDates[prevDay].splice(index, 1);
    spendingByDates[day].push(spendingData);

    await currentTravel?.updateOne({ spendingByDates }, { new: true });

    res.status(200).json({
      spendingByDates
    });
  } catch (err) {
    console.error('saving spending error', err);

    res.status(500).json({
      error: '지출 내용을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.'
    });
  }
};

export const deleteSpending: RequestHandler = async (req, res) => {
  const { travelId, spendingId } = req.body;

  const currentTravel = await Travel.findById(travelId);

  const spendingByDates = currentTravel!.spendingByDates;
  for (const date in spendingByDates) {
    const idx = spendingByDates[date].findIndex(list => list.spendingId === spendingId);

    if (idx > -1) {
      spendingByDates[date].splice(idx, 1);
      break;
    }
  }

  await currentTravel?.updateOne({ spendingByDates }, { new: true });

  res.status(200).json({
    spendingByDates
  });
};
