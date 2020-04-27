import { Document, model, Types, Schema } from 'mongoose';

interface IUserDocument extends Document {
  _id: Types.ObjectId;
  kakaoId: Number;
  nickname: string;
  email: string;
  profile_image: string;
  travelList: Types.Array<Types.ObjectId>;
};

const userSchema = new Schema({
  kakaoId: {
    type: Number,
    required: true
  },
  nickname: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true
  },
  profile_image: {
    type: String,
    required: true
  },
  travelList: [{
    type: Types.ObjectId,
    ref: 'Travel'
  }]
});

export default model<IUserDocument>('User', userSchema);
