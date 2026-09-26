import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from './config/passport.js';
import playerRoutes from './routes/player.route.js';
import authRoutes from './routes/auth.routes.js';
import { env } from './config/env.js';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const app = express();
const PORT = env.PORT || process.env.PORT || 5000;
const FRONTEND_URL = env.FRONTEND_URL || process.env.FRONTEND_URL || 'http://localhost:5173';

// --------------------------------------------------
// KẾT NỐI TỚI MONGODB ATLAS
// --------------------------------------------------
const mongoUri = env.MONGO_URI || process.env.MONGO_URI;

if (!mongoUri) {
  console.error('❌ Thất bại: Chưa khai báo MONGO_URI trong file .env!');
} else {
  mongoose
    .connect(mongoUri)
    .then(() => console.log('✅ Đã kết nối thành công tới MongoDB Atlas!'))
    .catch((err: any) => console.error('❌ Lỗi kết nối MongoDB:', err));
}
// --------------------------------------------------

// Log kiểm tra xem Key đã được Backend đọc thành công chưa
const apiKey = env.HENRIK_API_KEY || process.env.HENRIK_API_KEY;
if (apiKey) {
  console.log(`🔑 Đã nạp API Key thành công: ${apiKey.substring(0, 8)}...`);
} else {
  console.log('⚠️ CHƯA NẠP ĐƯỢC API KEY! Đang thiếu biến HENRIK_API_KEY.');
}

// Cấu hình CORS cho phép truyền Session Cookie từ Frontend
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình Session & Khởi tạo Passport OAuth
app.use(
  session({
    secret: env.SESSION_SECRET || process.env.SESSION_SECRET || 'valorant_tracker_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Health Check
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', environment: env.NODE_ENV || process.env.NODE_ENV || 'development' });
});

// Import Router Handlers
const playerRouter = (playerRoutes as any).default || playerRoutes;
const authRouter = (authRoutes as any).default || authRoutes;

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/v1/player', playerRouter);

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

export default app;