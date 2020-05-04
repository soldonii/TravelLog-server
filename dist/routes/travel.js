"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const travel_controller_1 = require("../controllers/travel.controller");
const travelRouter = express_1.Router();
travelRouter.post('/', authenticate_1.default, travel_controller_1.getCrawlingData);
// travel.get 하면 기록되어 있는 모든 여행들 정보 가져오기.
exports.default = travelRouter;
