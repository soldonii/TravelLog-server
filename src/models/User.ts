const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true
  },
  profile_image_url: {
    type: String,
    required: true
  },
  travelList: {
    type: mongoose.Types.ObjectId,
    ref: 'Travel'
  }
});

module.exports = mongoose.model('User', userSchema);


// import { Document, model, Types, Schema } from 'mongoose';
// import { IPost } from './Post';

// interface IParentsDocument extends Document {
//   mother: {
//     name: string;
//     date_of_birth: Date;
//     date_of_death?: Date;
//     profile_image_url: string;
//     favorites: Array<IFavorites>;
//     needs: Array<INeeds>;
//   },
//   father: {
//     name: string;
//     date_of_birth: Date;
//     date_of_death?: Date;
//     profile_image_url: string;
//     favorites: Array<IFavorites>;
//     needs: Array<INeeds>;
//   },
//   wedding_anniversary: Date;
// };

// interface IFavorites extends Document {
//   category: string;
//   title: string;
//   description?: string;
// };

// interface INeeds extends Document {
//   category: string;
//   title: string;
//   description?: string;
// };

// const parentsSchema = new Schema({
//   mother: {
//     name: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     date_of_birth: {
//       type: Date,
//       required: true
//     },
//     date_of_death: Date,
//     profile_image_url: {
//       type: String,
//       required: true
//     },
//     favorites: [{
//       category: {
//         type: String,
//         required: true
//       },
//       title: {
//         type: String,
//         required: true
//       },
//       description: String
//     }],
//     needs: [{
//       category: {
//         type: String,
//         required: true
//       },
//       title: {
//         type: String,
//         required: true
//       },
//       description: String
//     }]
//   },
//   father: {
//     name: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     date_of_birth: {
//       type: Date,
//       required: true
//     },
//     date_of_death: Date,
//     profile_image_url: {
//       type: String,
//       required: true
//     },
//     favorites: [{
//       categories: {
//         type: String,
//         required: true
//       },
//       title: {
//         type: String,
//         required: true
//       },
//       description: String
//     }],
//     needs: [{
//       categories: {
//         type: String,
//         required: true
//       },
//       title: {
//         type: String,
//         required: true
//       },
//       description: String
//     }]
//   },
//   wedding_anniversary: {
//     type: Date,
//     required: true
//   }
// });

// interface IUserDocument extends Document {
//   _id: Types.ObjectId;
//   username: string;
//   email: string;
//   profile_image_url: string;
//   parents: IParentsDocument;
//   payday: Date;
// };

// export interface IUser extends IUserDocument {
//   posts: IPost['_id'];
// };

// const userSchema = new Schema({
//   username: {
//     type: String,
//     trim: true,
//     required: true,
//     unique: true
//   },
//   email: {
//     type: String,
//     trim: true,
//     lowercase: true,
//     required: true,
//     unique: true
//   },
//   profile_image_url: {
//     type: String,
//     required: true
//   },
//   parents: {
//     type: [parentsSchema]
//   },
//   payday: {
//     type: Number,
//     required: true,
//     default: 25
//   },
//   posts: [{
//     type: Types.ObjectId,
//     ref: 'Post'
//   }]
// });

// export default model<IUserDocument>('User', userSchema);
