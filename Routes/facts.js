import express from 'express';
const router = express.Router();

// Load the JSON file
import { facts } from './RandomFacts/facts.json';

// Define a route to retrieve a random fact
router.get('/random-fact', (req, res) => {
  const randomIndex = Math.floor(Math.random() * facts.length);
  const randomFact = facts[randomIndex];
  res.json(randomFact);
});

export default router;