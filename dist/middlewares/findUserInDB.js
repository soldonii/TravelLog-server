"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
;
const findUserInDB = async (req, res, next) => {
    const { id: kakaoId, properties: { nickname, email, profile_image } } = req.body;
    const user = await User_1.default.findOne({ kakaoId });
    if (!user) {
        const newUser = await User_1.default.create({
            kakaoId,
            nickname,
            email,
            profile_image,
            travelList: []
        });
        res.locals.user = newUser;
    }
    else {
        res.locals.user = user;
    }
    next();
};
exports.default = findUserInDB;
