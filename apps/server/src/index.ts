import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectDB } from './lib/db';
import authRouter from './routes/auth.route';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Attempt to connect to DB, but don't prevent server from running if it fails
connectDB().then((conn) => {
  if (!conn) {
    console.warn('Proceeding without MongoDB connection');
  }
});
