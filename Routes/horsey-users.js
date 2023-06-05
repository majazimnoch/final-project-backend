import express from "express";
const router = express.Router()
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
import authenticateUser from '../Middlewares/middlewares'
import User from '../Models/horsey-user';

dotenv.config();
// require('dotenv').config();
// mongodb://127.0.0.1/xxxxxx
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/horsey";
mongoose.set('strictQuery', false);
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// when using the routing method in node js the word app gets replaced with "router.get/router.post" etc
// depending on which requests that we send do the database

// BELOW IS FOR TESTING - will delete later!
router.get("/users", async (req, res) => {
    try {
        const allUsers = await User.find();
        if (allUsers) {
            res.status(200).json({
                success: true,
                body: allUsers,
                message: "All users in the database",
            })
        }
        } catch (e) {
            res.status(500).json({
                success: false,
                response: e
            })
        }
})

// CREATE NEW HORSEY USER
router.post("/users/register", async (req, res) => {
    const { username, password } = req.body
    try {
        const salt = bcrypt.genSaltSync();
        const newUser = await new User({
            username: username,
            password: bcrypt.hashSync(password, salt)
        }).save();
// if we would like to add a link to the Users instagram for example we could add it in the response below
// profileInstagram: newUser.profileInstagram
        res.status(201).json({
            success: true,
            response: {
                username: newUser.username,
                id: newUser._id,
                accessToken: newUser.accessToken,
                profileName: newUser.profileName,
                profileText: newUser.profileText,
                profilePicture: newUser.profilePicture,
                message: "User created with a loud neigh!"
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            response: {
                error: error,
                message: "Failed to create user"
            }
        })
    }
});

// LOGIN
router.post("/users/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(password, user.password)) {
            res.status(201).json({
                success: true,
                response: {
                    username: user.username,
                    is: user._id,
                    accessToken: user.accessToken,
                    profileName: user.profileName,
                    profileText: user.profileText,
                    profilePicture: user.profilePicture,
                    message: "You are logged in, lets create some magic!"
                }
            })
        } else {
            res.status(404).json({
                success: false,
                response: {
                    message: "Oops, the credentials are not valid"
                }
            })
          }
        } catch (error) {
            res.status(500).json({
                success: false,
                response: error
            })
        }
    });

// Single User by ID
router.get("/users/:userId", authenticateUser, async (req, res) => {
    const { userId } = req.params; //Getting the user id from the parameters of the request
    const loggedinUserId = req.loggedinuser._id; //Getting the id of the user who are logged-in

    try {
        if (userId === loggedinUserId.toString()) {
            // this gives access to the user only if the ID requested matches the user logged-in ID
            const singleUser = await User.findById(userId);
            if (singleUser) {
                res.status(200).json({
                    success: true,
                    body: singleUser,
                    message: "Single user is listed",
                });
            } else {
                res.status(404).json({
                    success: false,
                    response: {
                        message: "Could not find the user"
                    }
                });
            }
        } else {
            // When the requested ID doesn't match the ID of the logged-in user
            res.status(403).json({
                success: false,
                response: {
                    message: "Authorization for this user is declined - information unavailable"
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            response: error,
            message: "An error occured, not possible to fetch the user data",
        })
    }
})

router.patch("/users/:userId", authenticateUser, async (req, res) => {
    const { userId } = req.params; //Getting the user id from the parameters of the request

    try {
        const { profileName, profileText, profilePicture } = req.body;
        const loggedinUserId = req.loggedinuser._id; //Getting the id of the user who are logged-in
        if (userId === loggedinUserId.toString()) {
        // this gives access to the user only if the ID requested matches the user logged-in ID    
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                profileName: profileName,
                profileText: profileText,
                profilePicture: profilePicture,
                profileInstagram: profileInstagram
              },
              { new: true }
            );
            if (updatedUser) {
              res.status(200).json({
                success: true,
                response: {
                  message: "User is successfully updated",
                  data: updatedUser,
                },
              });
            } else {
              res.status(404).json({
                success: false,
                response: {
                  message: "User could not be updated",
                },
              });
            }
          } else {
            // If the requested ID does not match the logged-in user's ID
            res.status(403).json({
              success: false,
              response: {
                message: "Authorization to update this user is declined - please try again"
              }
            });
          }
        } catch (error) {
          res.status(500).json({
            success: false,
            response: error,
            message: "An error occured, not possible to update the user data",
          });
        }
      });

export default router;