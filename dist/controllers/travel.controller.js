"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sampleData_json_1 = __importDefault(require("../crawling/sampleData.json"));
exports.getCrawlingData = async (req, res) => {
    const { country, city, travelDates } = req.body;
    const timeout = setTimeout(() => {
        res.status(200).send(sampleData_json_1.default);
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
