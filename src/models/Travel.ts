import { Document, model, Types, Schema } from 'mongoose';

interface ITravelDocument extends Document {
  _id: Types.ObjectId;
  country: string,
  spendingByDates: Object
};

const travelSchema = new Schema({
  country: {
    type: String,
    required: true
  },
  spendingByDates: {}
});

export default model<ITravelDocument>('Travel', travelSchema);
