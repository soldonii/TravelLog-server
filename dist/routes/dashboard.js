"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const dashboardRouter = express_1.Router();
dashboardRouter.get('/', authenticate_1.default, dashboard_controller_1.sendInitialData);
dashboardRouter.post('/', authenticate_1.default, dashboard_controller_1.saveTravelData);
dashboardRouter.put('/', authenticate_1.default, dashboard_controller_1.registerSpending);
dashboardRouter.delete('/', authenticate_1.default, dashboard_controller_1.deleteSpending);
exports.default = dashboardRouter;
