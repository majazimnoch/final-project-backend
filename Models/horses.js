import mongoose from 'mongoose';
import SquareSchema from './square';

const { Schema } = mongoose;
const HorseSchema = new mongoose.Schema({
  horseName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50
  },
  horseYearOfBirth: {
    type: Number,
    required: true,
  },
  horsePedigreeFather: {
    type: String,
  },
  horsePedigreeMother: {
    type: String,
  },
  horsePedigreeGrandfather: {
    type: String,
  },
  horseLevelOfSportJumping: {
    type: Number,
  },
  horseLevelOfSportDressage: {
    type: String,
  },
  horseLevelOfSportCrossCountry: {
    type: String,
  },
  horsePrevious: {
    type: Boolean,
    default: false,
  },
  horseActiveuser: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  squares: [SquareSchema]
});

const Horse = mongoose.model("Horse", HorseSchema);

module.exports = Horse;