import { Request, Response } from 'express';
import { ValorantService } from '../services/valorant.service.js';

export const getPlayerProfileHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, tag } = req.params;
    const profile = await ValorantService.getPlayerProfile(name, tag);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Không thể lấy thông tin người chơi',
    });
  }
};