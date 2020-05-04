"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import util from 'util';
// import getKayakCrawlingData from '../crawling/kayak';
// import getAirbnbCrawlingData from '../crawling/airbnb';
const sampleData_json_1 = __importDefault(require("../crawling/sampleData.json"));
exports.getCrawlingData = async (req, res) => {
    const { country, city, travelDates } = req.body;
    const timeout = setTimeout(() => {
        res.status(200).send(sampleData_json_1.default);
        // res.status(500).json({
        //   errorMessage: 'error'
        // });
        clearTimeout(timeout);
    }, 2000);
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
