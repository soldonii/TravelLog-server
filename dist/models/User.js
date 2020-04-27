"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const userSchema = new mongoose_1.Schema({
    kakaoId: {
        type: Number,
        required: true
    },
    nickname: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true
    },
    profile_image: {
        type: String,
        required: true
    },
    travelList: [{
            type: mongoose_1.Types.ObjectId,
            ref: 'Travel'
        }]
});
exports.default = mongoose_1.model('User', userSchema);
