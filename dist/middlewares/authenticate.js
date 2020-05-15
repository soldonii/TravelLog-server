"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = (req, res, next) => {
    const token = req.header('x-access-token');
    if (!token) {
        return res.status(401).json({
            errorMessage: 'Unauthorized User.'
        });
    }
    try {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        next();
    }
    catch (err) {
        console.error('authentication error', err);
        res.status(401).json({
            errorMessage: 'Invalid token'
        });
    }
};
exports.default = authenticateUser;
