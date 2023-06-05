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

const Horse = mongoose.model("Horses", HorseSchema);

module.exports = Horse;