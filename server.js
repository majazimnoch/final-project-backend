import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
// THE ROUTES - for enabling the interaction with the files in our Routes-folder
import mongoUsersRoute from './Routes/horsey-users';
import mongoHorseyHorsesRoute from './Routes/horsey-horses';
import facts from './RandomFacts/facts.json';
import authenticateApiKey from "./Middlewares/apikey-authentication";
// import randomFacts from './Routes/facts';

dotenv.config();
// YK - I installed "npm i node-fetch" to simplify fetches in the backend -
// https://www.npmjs.com/package/node-fetch

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const apikey = process.env.API_KEY
const app = express();
const listEndpoints = require('express-list-endpoints');

// CORS-options
const corsOptions = {
  origin: '*', // Allowing all origins
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Allowing GET and POST requests
};

// Add middlewares to enable cors and json body parsing
app.use(cors(corsOptions));
app.use(express.json());
app.use(authenticateApiKey);
app.options('*', cors());

// Adds the Route's file's routes to the application at the root path
app.use("/", mongoUsersRoute);
app.use("/", mongoHorseyHorsesRoute);
// app.use("/", randomFacts);
//REMEMBER - add more Route's if we add more later - f.ex. app.use("/", theNameOfTheRouteGoesHereRoute);
//OTHERWISE - remove these two lines with comments.

// Start defining your routes here
app.get("/", (req, res) => {
  const welcomeMessage = "Final Project Horsey API";
  const endpoints = listEndpoints(app);

  res.status(200).json({
    success: true,
    message: "OK",
    body: {
      welcomeMessage,
      endpoints
    }
  });
});

const factsData = require('./RandomFacts/facts.json');

// Define a route to retrieve a random fact
app.get('/random-fact', (req, res) => {
  const randomIndex = Math.floor(Math.random() * factsData.facts.length);
  const randomFact = factsData.facts[randomIndex];
  res.json(randomFact);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
