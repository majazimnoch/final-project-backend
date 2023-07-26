import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const HorseDetails = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String, 
    required: true
  },
  characteristics: {
    type: [String],
    required: true
  },
  instructions: {
    type: [String],
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  }
})

const HorseSchema = new Schema({
  horse: {
    type: HorseDetails,
    ref: "HorseDetails"
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  }
});

export default mongoose.model("Horse", HorseSchema, "horses");