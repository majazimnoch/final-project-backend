import express from 'express';
import { facts } from '../RandomFacts/facts.json';
const router = express.Router();

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/horsey";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

router.get('/random-fact', (req, res) => {
  const randomIndex = Math.floor(Math.random() * facts.length);
  const randomFact = facts[randomIndex];
  res.json(randomFact);
});

export default router;