import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
// import crypto from "crypto";
import bcrypt from 'bcrypt';
import authenticateUser from './Middlewares/authentication';
import User from './Models/user-users';
import Horse from './Models/horse-horses';

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1/horsey';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// const authenticateUser = async (req, res, next) => {
//   const accessToken = req.header("Authorization");
//   try {
//     const user = await User.findOne({accessToken: accessToken});
//     if (user) {
//     req.user = user;
//     next();
//     } else {
//         res.status(401).json({
//           success: false,
//           response: "Please log in"
//       })
//     }
//   } catch (e) {
//     res.status(500).json({
//      success: false,
//       response: e
//     });
//   }
// };

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello horselover!");
});

// POST-routes

// Registering new user
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
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

// Logging in existing user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({email: email})
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

// Posts new horse
app.post("/horses", authenticateUser)
app.post("/horses", async (req, res) => {
  const { horse } = req.body
  const accessToken = req.header("Authorization")
  const user = await User.findOne({accessToken: accessToken})

  try {
    const newHorse = await new Horse({horse, userId: user._id, username: user.username}).save()
    res.status(201).json({
      success: true,
      response: newHorse
    })
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e
    })
  }
});

// GET-routes

// Only logged in users can see
app.get("/secrets", authenticateUser);
app.get("/secrets", (req, res) => {
  res.json({ user: req.user, secret: "welcome to Horsey!"});
});

// All users
app.get("/users", authenticateUser)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json({
     success: true,
     response: users
    })
  } catch (e) {
     res.status(400).json({success: false, response: e});
   }
});

// All horses
app.get("/horses", authenticateUser)
app.get("/horses", async (req, res) => {
  try {
    const horses = await Horse.find()
    res.status(200).json({
     success: true,
     response: horses
    })
  } catch (e) {
     res.status(400).json({success: false, response: e});
   }
});

//Show data from a specific user by id
app.get("/users/:userId", authenticateUser)
app.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const userData = await User.findById({_id: userId})
    res.status(200).json({
     success: true,
     response: userData
    })
  } catch (e) {
     res.status(400).json({success: false, response: e});
   }
});

// Show data from a single horse based on id
app.get("/horses/:horseId", authenticateUser)
app.get("/horses/:horseId", async (req, res) => {
  const { horseId } = req.params;
  try {
    const singleHorse = await Horse.find({ _id: horseId }).sort({createdAt: 'desc'})
    res.status(200).json({
     success: true,
     response: singleHorse
    })
  } catch (e) {
     res.status(400).json({success: false, response: e});
   }
});

//Show horses from a specific user
app.get("/users/:userId/horses", authenticateUser)
app.get("/users/:userId/horses", async (req, res) => {
  const { userId } = req.params;
  try {
    const usersHorses = await Horse.find({userId: userId}).sort({createdAt: 'desc'})
    const user = await User.findById({_id: userId})
    res.status(200).json({
     success: true,
     response: usersHorses, user
    })
  } catch (e) {
     res.status(400).json({success: false, response: e});
   }
});

//Patch and delete routes
// Delete horse
app.delete("/horses/:horseId", async (req, res) => {
  const { horseId } = req.params
  try {
    const horseToDelete = await Horse.findByIdAndRemove({_id: horseId})
    res.status(200).json({
      success: true,
      response: "Horse deleted", horseToDelete
    })
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e
    })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});