"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kayak_1 = __importDefault(require("../crawling/kayak"));
const airbnb_1 = __importDefault(require("../crawling/airbnb"));
exports.getCrawlingData = async (req, res) => {
    const { country, city, travelDates } = req.body;
    const kayakData = await kayak_1.default(country, city, travelDates);
    console.log('kayak', kayakData);
    const airbnbData = await airbnb_1.default(city, travelDates);
    console.log('airbnb', airbnbData);
    res.status(200).send('hello');
};
