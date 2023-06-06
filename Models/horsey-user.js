import mongoose from 'mongoose';
import crypto from 'crypto';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
      type: String,
      unique: true,
      required: true,
      minlength: 1,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      minlength: 1,
    },
    password: {
      type: String,
      required: true,
      minlength: 3
    },
    accessToken: {
      type: String,
      default: () => crypto.randomBytes(128).toString('hex')
    }
  });

export default mongoose.model("User", UserSchema);