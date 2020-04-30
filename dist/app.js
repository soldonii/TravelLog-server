"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importStar(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const http_errors_1 = __importDefault(require("http-errors"));
dotenv_1.default.config();
require('./config/mongoose'); // 수정
const auth_1 = __importDefault(require("./routes/auth"));
const travel_1 = __importDefault(require("./routes/travel"));
const app = express_1.default();
app.use(cors_1.default());
app.use(morgan_1.default('dev'));
app.use(express_1.json());
app.use(express_1.urlencoded({ extended: false }));
app.use('/auth', auth_1.default);
app.use('/travel', travel_1.default);
app.use('/', (req, res) => res.status(200).json({ result: 'ok' }));
app.use((req, res, next) => {
    next(http_errors_1.default(404, 'Invalid Url'));
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500).json({
        message: err.message
    });
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT}`);
});
module.exports = app;
