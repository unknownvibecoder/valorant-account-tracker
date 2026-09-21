import { Router } from 'express';
import { getPlayerProfileHandler } from '../controllers/player.controller.js';

const router = Router();

router.get('/:name/:tag', getPlayerProfileHandler);

export default router;