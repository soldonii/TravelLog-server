"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const findUserInDB_1 = __importDefault(require("../middlewares/findUserInDB"));
const auth_controller_1 = require("../controllers/auth.controller");
const authRouter = express_1.Router();
authRouter.post('/login', findUserInDB_1.default, auth_controller_1.login);
exports.default = authRouter;
