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
    default: () => crypto.randomBytes(128).toString("hex")
  },
  profileName: {
    type: String,
    default: ""
  },
  profileText: {
    type: String,
    default: "",
    minlength: 0,
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

// EXPLANATION/ANALYSIS REGARDING THE CODE FROM ChatGPT:

// This code defines a Mongoose schema called UserSchema for a user model, and then creates a Mongoose model called User based on that schema. Here's a breakdown of the code:
// It imports the mongoose and crypto modules.
// It destructures the Schema object from mongoose.
// The UserSchema variable is assigned a new instance of mongoose.Schema. This represents the schema definition for a user.
// Inside UserSchema, the following fields are defined:
// username: A required string field that must be unique.
// password: A required string field. You can add additional validation criteria for the password if needed.
// accessToken: A string field with a default value generated using crypto.randomBytes(128).toString("hex"). This generates a random access token with 128 bytes of data and converts it to a hexadecimal string.
// profileName: A string field with an empty default value.
// profileText: A string field with an empty default value. It also specifies a minimum length of 20 characters and a maximum length of 350 characters.
// profilePicture: A string field with a default value pointing to a default profile picture URL. You can change this value to your own URL if desired.
// The User variable is assigned the Mongoose model created by calling mongoose.model("User", UserSchema). This model represents the "User" collection in the MongoDB database.

// Finally, the User model is exported as the default export of the module.

// This code defines the schema and model for a user in Mongoose, with various fields for username, password, access token, profile name, profile text, and profile picture. The default values and validation criteria specified in the schema will be enforced when creating or updating user documents in the database.