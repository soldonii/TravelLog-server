"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kayak_1 = __importDefault(require("../crawling/kayak"));
const airbnb_1 = __importDefault(require("../crawling/airbnb"));
const Travel_1 = __importDefault(require("../models/Travel"));
exports.getKayakData = async (req, res) => {
    const { country, city, travelDates } = req.body;
    const kayakData = await kayak_1.default(country, city, travelDates);
    res.status(200).json({
        result: 'success',
        kayak: kayakData
    });
};
exports.getAirbnbData = async (req, res) => {
    const { city, travelDates } = req.body;
    const airbnbData = await airbnb_1.default(city, travelDates);
    res.status(200).json({
        result: 'success',
        airbnb: airbnbData
    });
};
exports.sendAllTravelData = async (req, res) => {
    const allTravels = await Travel_1.default.find({});
    res.status(200).json({
        allTravels
    });
};
