"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const travelSchema = new mongoose_1.Schema({
    country: {
        type: String,
        required: true
    },
    spendingByDates: {}
});
exports.default = mongoose_1.model('Travel', travelSchema);
// const dates = {
//   출발전: [
//     {
//       amount: 30000,
//       description: '',
//       category: '식사',
//       location: {
//         title: '',
//         coordinates: ''
//       },
//       memo: '메모'
//     },
//     {
//       amount: 30000,
//       description: '',
//       category: '식사',
//       location: {
//         title: '',
//         coordinates: ''
//       },
//       memo: '메모'
//     },
//   ],
//   '2020-05-19(화)': [
//     {
//       amount: 30000,
//       description: '',
//       category: '식사',
//       location: {
//         title: '',
//         coordinates: ''
//       },
//       memo: '메모'
//     },
//   ]
// }
