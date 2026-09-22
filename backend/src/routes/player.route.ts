import { Router } from 'express';
import { getPlayerProfileHandler, getPlayerMatchesHandler } from '../controllers/player.controller.js';

const router = Router();

router.get('/:name/:tag', getPlayerProfileHandler);
router.get('/:name/:tag/matches', getPlayerMatchesHandler);

export default router;