import express from "express";
const router = express.Router()
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
// import authenticateUser from '../Middlewares/middlewares'
// import User from '../Models/user';

// dotenv.config();
require('dotenv').config();
// mongodb://127.0.0.1/xxxxxx
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/horsey"
mongoose.set('strictQuery', false);
mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.Promise = Promise

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