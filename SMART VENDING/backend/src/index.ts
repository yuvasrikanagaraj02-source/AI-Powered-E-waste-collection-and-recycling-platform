import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.routes';
import pickupRoutes from './routes/pickup.routes';
import { analyzeWithModel } from './services/model.service';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'E-Waste Backend is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pickups', pickupRoutes);

// New standalone predict endpoint
app.post('/api/predict', async (req, res) => {
  try {
    const { base64Image, mimeType } = req.body;
    if (!base64Image) {
      return res.status(400).json({ error: 'Missing base64Image' });
    }
    const result = await analyzeWithModel(base64Image, mimeType);
    if (!result) {
      return res.status(500).json({ error: 'Prediction failed' });
    }
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
