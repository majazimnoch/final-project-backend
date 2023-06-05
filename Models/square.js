import mongoose from 'mongoose';

const { Schema } = mongoose;
const SquareSchema = new mongoose.Schema({
  squareIcon: {
    type: String,
    default: ""
  },
  squareName: {
    type: String,
    default: ""
  },
  squarePhotoRef: {
    type: String,
    default: ""
  },
  squarePlaceId: {
    type: String,
    default: ""
  },
  squareRating: {
    type: Number,
    default: null
  },
  squareVicinity: {
    type: String,
    default: ""
  },
  squareComment: {
    type: String,
    default: "",
    maxLength: 100
  },
  squareStars: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Square = mongoose.model("Square", SquareSchema);

export default SquareSchema;