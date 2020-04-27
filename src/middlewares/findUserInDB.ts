// import { RequestHandler } from 'express';
// import User from '../models/User';

// const findUserInDB: RequestHandler = async (req, res, next) => {
//   type RequestBody = {
//     email: string;
//     name: string;
//     profileUrl: string;
//   };

//   const { email, name, profileUrl }: RequestBody = req.body;
//   const user = await User.findOne({ email });
//   console.log(req.body);

//   if (!user) {
//     console.log('no user');
//     const newUser = await User.create({
//       username: name,
//       email,
//       profile_image_url: profileUrl,
//       payday: 25,
//       parents: [],
//       posts: []
//     });

//     res.locals.username = newUser.username;
//   } else {
//     console.log('user', user);
//     res.locals.username = user.username;
//   }

//   next();
// };

// export default findUserInDB;
