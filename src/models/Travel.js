const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const travelSchema = new Schema({
  travelList: [{
    country: {
      type: String,
      required: true
    },
    dates: [{
      before_travel: [{
        expenditure_amount: Number,
        expenditure_description: String,
        expenditure_category: String,
        number_of_people: Number,
        location: {
          coordinates: String,
          title: String
        },
        memo: {
          image_url: String,
          memo_description: String
        }
      }]
    }]
  }]
});

module.exports = travelSchema('Travel', travelSchema);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const travelSchema = new Schema({
  travelList: [{
    country: {
      type: String,
      required: true
    },
    dates: [{
      before_travel: [{
        expenditure_amount: Number,
        expenditure_description: String,
        expenditure_category: String,
        number_of_people: Number,
        location: {
          coordinates: String,
          title: String
        },
        memo: {
          image_url: String,
          memo_description: String
        }
      }]
    }]
  }]
});

module.exports = travelSchema('Travel', travelSchema);
