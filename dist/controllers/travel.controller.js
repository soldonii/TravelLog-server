"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const kayak_1 = __importDefault(require("../crawling/kayak"));
const airbnb_1 = __importDefault(require("../crawling/airbnb"));
exports.getCrawlingData = async (req, res) => {
    const { country, city, travelDates } = req.body;
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
    const kayakData = await kayak_1.default(country, city, travelDates);
    console.log(util_1.default.inspect(kayakData, { showHidden: false, depth: null }));
    const airbnbData = await airbnb_1.default(city, travelDates);
    console.log('airbnbData', util_1.default.inspect(airbnbData, { showHidden: false, depth: null }));
    res.status(200).json({
        result: 'success',
        kayak: kayakData,
        airbnb: airbnbData
    });
};
