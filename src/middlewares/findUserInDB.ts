import { RequestHandler } from 'express';
import User from '../models/User';

interface Property {
  nickname: string,
  profile_image: string,
  email?: string
};

const findUserInDB: RequestHandler = async (req, res, next) => {
  type RequestBody = {
    id: number;
    properties: Property;
    nickname: string;
    profile_image: string;
    email: string;
  };

  const { id: kakaoId, properties: { nickname, email, profile_image } }: RequestBody = req.body;
  const user = await User.findOne({ kakaoId });
  console.log(req.body);

  if (!user) {
    console.log('no user');
    const newUser = await User.create({
      kakaoId,
      nickname,
      email,
      profile_image,
      travelList: []
    });

    res.locals.user = newUser;
  } else {
    console.log('user', user);
    res.locals.user = user;
  }

  next();
};

export default findUserInDB;
