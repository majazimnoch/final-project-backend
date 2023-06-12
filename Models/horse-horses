import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const HorseDetails = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50
    },
    description: {
      type: String, 
      required: true
    },
    horseYearOfBirth: {
      type: Number,
      required: true
    },
    horsePedigreeFather: {
      type: String
    },
    horsePedigreeMother: {
      type: String
    },
    horsePedigreeGrandfather: {
      type: String
    },
    horseLevelOfSportJumping: {
      type: Number
    },
    horseLevelOfSportDressage: {
      type: String
    },
    horseLevelOfSportCrossCountry: {
      type: String
    },
  })

  const HorseSchema = new mongoose.Schema({
    horse: {
      type: HorseDetails
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
  