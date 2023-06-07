import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "./Models/horsey-user";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/final-project-backend";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization");
  try {
    const user = await User.findOne({accessToken: accessToken});
    if (user) {
    req.user = user;
    next();
    } else {
        res.status(401).json({
          success: false,
          response: "Please log in"
      })
    }
  } catch (e) {
    res.status(500).json({
     success: false,
      response: e
    });
  }
};

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello horselover!");
});

// Register
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const salt = bcrypt.genSaltSync();
      const newUser = await new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt)
      }).save();
      res.status(201).json({
        success: true,
        response: {
          name: newUser.name,
          id: newUser._id,
          accessToken: newUser.accessToken
        }
      })
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e
      })
    }
});

// Only logged in users can see
app.get("/secrets", authenticateUser);
app.get("/secrets", (req, res) => {
  res.json({ user: req.user, secret: "you're logged in!"});
});


app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({name: name})
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        success: true,
        response: {
          username: user.name,
          id: user._id,
          accessToken: user.accessToken
        }
      });
  } else {
      res.status(400).json({
        success: false,
        response: "Credentials do not match"
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      response: e
    })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});