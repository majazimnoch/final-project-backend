import mongoose from 'mongoose';
import crypto from 'crypto'

const { Schema } = mongoose;
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // might add more here like minLength, or other criterias
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex')
  },
  profileName: {
    type: String,
    default: ""
  },
  profileText: {
    type: String,
    default: "",
    minlength: 20,
    maxlength: 350
  },
  profilePicture: {
    type: String,
    default: "https://commons.wikimedia.org/wiki/File:Default_pfp.svg"
  }
});
//don't yet know how to change above default profile picture to our own.
const User = mongoose.model("User", UserSchema);

export default User;