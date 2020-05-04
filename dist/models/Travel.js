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
