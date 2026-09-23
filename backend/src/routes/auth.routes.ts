import { Router } from 'express';
import passport from '../config/passport';
import { env } from '../config/env';

const router = Router();

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