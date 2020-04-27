import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

interface User {
  nickname: string,
  profile_image: string
};

export const login: RequestHandler = async (req, res) => {
  const { user: { nickname, profile_image } }: { user: User } = res.locals;

  try {
    const payload = { nickname };

    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: 1000 * 60 * 60 },
      (err, token) => {
        if (err) {
          console.error('jwt sign error', err);
          return res.status(500).json({
            errorMessage: 'Server error. Please try again.'
          });
        }

        res.status(200).json({ token, nickname, profile_image });
      }
    );
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({
      errorMessage: 'Server error. Please try again.'
    });
  }
};
