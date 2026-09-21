import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import playerRoutes from './routes/player.route.js';

// Nạp file .env từ cả thư mục hiện tại lẫn thư mục backend
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Log kiểm tra xem Key đã được Backend đọc thành công chưa
const apiKey = process.env.HENRIK_API_KEY;
if (apiKey) {
  console.log(`🔑 Đã nạp API Key thành công: ${apiKey.substring(0, 8)}...`);
} else {
  console.log('⚠️ CHƯA NẠP ĐƯỢC API KEY! Đang thiếu biến HENRIK_API_KEY.');
}

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

// Player Routes
const playerRouter = (playerRoutes as any).default || playerRoutes;
app.use('/api/v1/player', playerRouter);

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

export default app;