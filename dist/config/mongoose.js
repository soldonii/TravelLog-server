"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const URL = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'production' ?
    process.env.MONGODB_URI : process.env.MONGODB_URI_TEST;
mongoose_1.default.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'production') {
    mongoose_1.default.connection.on('error', () => console.error('Connection Error!'));
    mongoose_1.default.connection.once('open', () => console.log('Connected!'));
}
else if (process.env.NODE_ENV === 'test') {
    mongoose_1.default.connection.on('error', () => console.error('Connection Error!'));
    mongoose_1.default.connection.once('open', () => console.log('Connected to test db!'));
}
