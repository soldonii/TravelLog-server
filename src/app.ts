import dotenv from 'dotenv';
import express, { Request, Response, NextFunction, json, urlencoded } from 'express';
import logger from 'morgan';
import cors from 'cors';
import createError, { HttpError } from 'http-errors';

dotenv.config();
require('./config/mongoose'); // 수정

import authRouter from './routes/auth';

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/', (req, res) => res.status(200).json({ result: 'ok' }));

app.use((req, res, next) => {
  next(createError(404, 'Invalid Url'));
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
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
