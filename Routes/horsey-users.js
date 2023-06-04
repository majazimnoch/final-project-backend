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
