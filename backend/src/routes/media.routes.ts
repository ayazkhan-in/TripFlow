import { Router, Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary.js';

const router = Router();

// POST /api/v1/media/signature - Generate signature for direct client-side upload to Cloudinary
router.post('/signature', (req: Request, res: Response) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const { folder = 'tripflow/vault' } = req.body;

    const apiSecret = process.env.CLOUDINARY_API_SECRET || '';
    const apiKey = process.env.CLOUDINARY_API_KEY || '';
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'demo';

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      apiSecret
    );

    res.json({
      success: true,
      timestamp,
      signature,
      apiKey,
      cloudName,
      folder,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
