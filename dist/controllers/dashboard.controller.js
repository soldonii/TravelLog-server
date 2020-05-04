"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const randomstring_1 = __importDefault(require("randomstring"));
const Travel_1 = __importDefault(require("../models/Travel"));
const sampleQuotes_json_1 = __importDefault(require("../lib/sampleQuotes.json"));
const currency_json_1 = __importDefault(require("../lib/currency.json"));
const spendingCategory_1 = __importDefault(require("../lib/spendingCategory"));
const SEOUL_LATLNG = {
    lat: 37.566536,
    lng: 126.977966
};
;
exports.saveTravelData = async (req, res) => {
    const { flightPrice, accomodationPrice, travelCountry, travelDayList } = req.body;
    travelDayList.splice(0, 0, '출발 전');
    const spendingByDates = {};
    travelDayList.forEach((day) => spendingByDates[day] = []);
    spendingByDates['출발 전'].push({
        category: spendingCategory_1.default.FLIGHT,
        description: '항공권 구매',
        amount: flightPrice,
        location: {
            title: '출발 전',
            coordinates: { lat: SEOUL_LATLNG.lat, lng: SEOUL_LATLNG.lng }
        },
        spendingId: randomstring_1.default.generate(6)
    }, {
        category: spendingCategory_1.default.ACCOMODATION,
        description: '에어비앤비 숙소 구매',
        amount: accomodationPrice,
        location: {
            title: '출발 전',
            coordinates: { lat: SEOUL_LATLNG.lat, lng: SEOUL_LATLNG.lng }
        },
        spendingId: randomstring_1.default.generate(6)
    });
    try {
        const newTravel = await Travel_1.default.create({
            country: travelCountry,
            spendingByDates
        });
        res.status(200).json({
            travelId: newTravel._id
        });
    }
    catch (err) {
        console.error('saving travel info error', err);
        res.status(500).json({
            errorMessage: 'Server error. Please try again.'
        });
    }
};
exports.sendInitialData = async (req, res) => {
    const { travelId } = req.query;
    const travel = await Travel_1.default.findById(travelId);
    const travelCountry = travel.country;
    const currencyCode = Object.keys(currency_json_1.default).find(code => {
        return currency_json_1.default[code].toLowerCase().includes(travelCountry.toLowerCase());
    }) || 'USD';
    // const { response: { data: { quotes } } } = await axios.get(process.env.CURRENCY_API_ENDPOINT);
    const quotes = sampleQuotes_json_1.default;
    const USD_TO_CURRENCYCODE = quotes[`USD${currencyCode}`];
    const USD_TO_KOREAN_CURRENCY = quotes.USDKRW;
    const currencyExchange = Math.round(USD_TO_KOREAN_CURRENCY / USD_TO_CURRENCYCODE);
    res.status(200).json({
        travelCountry,
        spendingByDates: travel.spendingByDates,
        currencyExchange,
        currencyCode,
    });
};
exports.registerSpending = async (req, res) => {
    const data = req.body.data;
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
        const currentTravel = await Travel_1.default.findById(travelId);
        const spendingByDates = currentTravel.spendingByDates;
        let prevDay;
        let index;
        for (const dayStr in spendingByDates) {
            const idx = spendingByDates[dayStr].findIndex((list) => list.spendingId === spendingId);
            if (idx > -1) {
                if (dayStr !== day) {
                    prevDay = dayStr;
                    index = idx;
                }
                else {
                    spendingByDates[dayStr].splice(idx, 1);
                }
            }
        }
        if (prevDay)
            spendingByDates[prevDay].splice(index, 1);
        spendingByDates[day].push(spendingData);
        await (currentTravel === null || currentTravel === void 0 ? void 0 : currentTravel.updateOne({ spendingByDates }, { new: true }));
        res.status(200).json({
            spendingByDates
        });
    }
    catch (err) {
        console.error('saving spending error', err);
        res.status(500).json({
            error: '지출 내용을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.'
        });
    }
};