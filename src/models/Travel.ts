import { Document, model, Types, Schema } from 'mongoose';

// interface Expenditure {
//   amount: number,
//   description: string,
//   category: string,
//   location: {
//     coordinates: string,
//     title: string
//   },
//   memo: string
// };

interface ITravelDocument extends Document {
  _id: Types.ObjectId;
  country: string,
  dates: Object
};

const travelSchema = new Schema({
  country: {
    type: String,
    required: true
  },
  dates: {}
});

export default model<ITravelDocument>('Travel', travelSchema);

// const dates = {
//   출발전: [
//     {
//       amount: 30000,
//       description: '',
//       category: '식사',
//       location: {
//         title: '',
//         coordinates: ''
//       },
//       memo: '메모'
//     },
//     {
//       amount: 30000,
//       description: '',
//       category: '식사',
//       location: {
//         title: '',
//         coordinates: ''
//       },
//       memo: '메모'
//     },
//   ],
//   '2020-05-19(화)': [
//     {
//       amount: 30000,
//       description: '',
//       category: '식사',
//       location: {
//         title: '',
//         coordinates: ''
//       },
//       memo: '메모'
//     },
//   ]
// }