"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// country United States
// city San Francisco
// travelDates [ '2020-05-05T15:00:00.000Z', '2020-05-14T14:59:59.999Z' ]
const kayak_1 = __importDefault(require("../crawling/kayak"));
exports.getCrawlingData = async (req, res) => {
    const { country, city, travelDates } = req.body;
    const kayakData = kayak_1.default(country, city, travelDates);
    // const airbnbData = await getAirbnbCrawlingData(city, travelDates);
    res.status(200).send('hello');
};
