import { Router } from 'express';
import passport from '../config/passport.js';
import { env } from '../config/env.js';
import User from '../models/user.model.js';

const router = Router();

// ==========================================
// 1. ĐĂNG KÝ & ĐĂNG NHẬP THƯỜNG (EMAIL / USERNAME)
// ==========================================

// Route Đăng ký: POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    // 1. Kiểm tra tài khoản hoặc email đã tồn tại chưa
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Tên người dùng hoặc Email đã được sử dụng!' });
    }

    // 2. LƯU MẬT KHẨU THẬT (PLAINTEXT) VÀO MONGODB
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: password, // Giữ nguyên mật khẩu rõ dạng chữ
    });

    await newUser.save(); // Lệnh lưu chính thức vào MongoDB Atlas

    return res.status(201).json({
      message: 'Đăng ký tài khoản thành công!',
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    console.error('Lỗi Register:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống máy chủ.' });
  }
});

// Route Đăng nhập: POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập tài khoản và mật khẩu!' });
    }

    // 1. Tìm User bằng Username hoặc Email
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });
    }

    // 2. So sánh trực tiếp chuỗi mật khẩu gốc
    if (user.password !== password) {
      return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });
    }

    return res.status(200).json({
      message: 'Đăng nhập thành công!',
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error('Lỗi Login:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống máy chủ.' });
  }
});

// ==========================================
// 2. ĐĂNG NHẬP MẠNG XÃ HỘI (OAUTH)
// ==========================================

// --- GOOGLE ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${env.FRONTEND_URL}?error=login_failed` }),
  (req, res) => {
    res.redirect(`${env.FRONTEND_URL}?status=success`);
  }
);

// --- DISCORD ---
router.get('/discord', passport.authenticate('discord'));
router.get(
  '/discord/callback',
  passport.authenticate('discord', { failureRedirect: `${env.FRONTEND_URL}?error=login_failed` }),
  (req, res) => {
    res.redirect(`${env.FRONTEND_URL}?status=success`);
  }
);

// --- FACEBOOK ---
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: `${env.FRONTEND_URL}?error=login_failed` }),
  (req, res) => {
    res.redirect(`${env.FRONTEND_URL}?status=success`);
  }
);

export default router;