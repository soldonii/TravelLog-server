"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const randomstring_1 = __importDefault(require("randomstring"));
const sampleData_json_1 = __importDefault(require("../crawling/sampleData.json"));
const sampleQuotes_json_1 = __importDefault(require("../lib/sampleQuotes.json"));
const currency_json_1 = __importDefault(require("../lib/currency.json"));
const Travel_1 = __importDefault(require("../models/Travel"));
const expenditureCategory_1 = __importDefault(require("../lib/expenditureCategory"));
exports.getCrawlingData = async (req, res) => {
    const { country, city, travelDates } = req.body;
    const timeout = setTimeout(() => {
        res.status(200).send(sampleData_json_1.default);
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
exports.saveTravelData = async (req, res) => {
    const { flightPrice, accomodationPrice, travelCountry, travelDayList } = req.body;
    travelDayList.splice(0, 0, '출발 전');
    const spendingByDates = {};
    travelDayList.forEach(day => spendingByDates[day] = []);
    spendingByDates['출발 전'].push({
        category: expenditureCategory_1.default.FLIGHT,
        description: '항공권 구매',
        amount: flightPrice,
        location: {
            title: '출발 전',
            coordinates: ''
        },
        spendingId: randomstring_1.default.generate(6)
    }, {
        category: expenditureCategory_1.default.ACCOMODATION,
        description: '에어비앤비 숙소 구매',
        amount: accomodationPrice,
        location: {
            title: '출발 전',
            coordinates: ''
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
    const usdToCode = quotes[`USD${currencyCode}`];
    const usdToWon = quotes.USDKRW;
    const currencyExchange = Math.round(usdToWon / usdToCode);
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
        const idx = spendingByDates[day].findIndex(list => list.spendingId === spendingId);
        if (idx > -1) {
            spendingByDates[day][idx] = spendingData;
        }
        else {
            spendingByDates[day].push(spendingData);
        }
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
