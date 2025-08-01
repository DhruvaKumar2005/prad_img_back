import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import {fileURLToPath} from 'url';
import { dirname } from 'path';
import path from 'path';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'your-frontend-domain.com'
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello from DALL.E!',
  });
});

const startServer = async () => {
  try {
    // Enhanced debugging
    console.log('Starting server with configuration:', {
      mongoDbExists: !!process.env.MONGODB_URL,
      port: process.env.PORT || 8080,
      nodeEnv: process.env.NODE_ENV,
      currentDir: __dirname
    });

    // Validate environment
    if (!process.env.MONGODB_URL) {
      console.error('Missing required environment variable: MONGODB_URL');
      process.exit(1);
    }

    // Connect to database
    await connectDB(process.env.MONGODB_URL);
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Fatal error during startup:', error);
    process.exit(1);
  }
};

startServer();
