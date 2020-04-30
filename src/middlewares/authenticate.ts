import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

const authenticateUser: RequestHandler = (req, res, next) => {
  const token = req.header('x-access-token');

  if (!token) {
    return res.status(401).json({
      errorMessage: 'Unauthorized User.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    console.error('authentication error', err);
    res.status(401).json({
      errorMessage: 'Invalid token'
    });
  }
};

export default authenticateUser;
