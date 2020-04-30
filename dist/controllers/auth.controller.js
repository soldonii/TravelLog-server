"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
;
exports.login = async (req, res) => {
    const { user: { _id, nickname, profile_image } } = res.locals;
    try {
        const payload = { nickname };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 1000 * 60 * 60 }, (err, token) => {
            if (err) {
                console.error('jwt sign error', err);
                return res.status(500).json({
                    errorMessage: 'Server error. Please try again.'
                });
            }
            res.status(200).json({ userId: _id, token, nickname, profile_image });
        });
    }
    catch (err) {
        console.error('login error', err);
        res.status(500).json({
            errorMessage: 'Server error. Please try again.'
        });
    }
};
