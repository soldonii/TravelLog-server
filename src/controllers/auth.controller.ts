// import { RequestHandler } from 'express';
// import jwt from 'jsonwebtoken';

// export const login: RequestHandler = async (req, res) => {
//   const { username }: { username: string } = res.locals;

//   try {
//     const payload = { username };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: 1000 * 60 * 60 },
//       (err, token) => {
//         if (err) {
//           console.error('jwt sign error', err);
//           return res.status(500).json({
//             errorMessage: 'Server error. Please try again.'
//           });
//         }

//         res.status(200).json({ token, username });
//       }
//     );
//   } catch (err) {
//     console.error('login error', err);
//     res.status(500).json({
//       errorMessage: 'Server error. Please try again.'
//     });
//   }
// };
