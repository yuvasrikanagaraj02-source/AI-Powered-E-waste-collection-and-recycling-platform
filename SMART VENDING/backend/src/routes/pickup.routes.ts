import { Router } from 'express';
import { uploadImageToCloudinary } from '../services/cloudinary.service';
import { analyzeWithModel } from '../services/model.service';
import { requireAuth } from '../middleware/auth.middleware';
import {
  createPickupRequest,
  getPickupRequests,
  updatePickupRequestStatus,
  getPickupRequestsByUser,
  updatePickupSchedule
} from '../services/firebase.service';

const router = Router();

// Apply auth middleware to all pickup routes
router.use(requireAuth);

// Endpoint: Upload Image -> AI Analysis -> Save to DB
router.post('/create', async (req, res) => {
  try {
    const { base64Image, description, userId, mimeType } = req.body;

    if (!base64Image || !userId) {
      return res.status(400).json({ error: 'Missing base64Image or userId' });
    }

    const effectiveMimeType = mimeType || 'image/jpeg';

    // 1. Upload to Cloudinary (now returns auto-tags!)
    const cloudinaryData = await uploadImageToCloudinary(base64Image, effectiveMimeType);
    const cloudinaryUrl = cloudinaryData.url;
    const cloudinaryTags = cloudinaryData.tags;

    // 2. Analyze with custom trained model via Python microservice
    const aiResult = await analyzeWithModel(base64Image, effectiveMimeType);

    if (!aiResult) {
      return res.status(500).json({ error: 'AI Analysis failed' });
    }

    // 3. Save Structured Data to Firebase
    const pickupId = await createPickupRequest({
      imageUrl: cloudinaryUrl,
      description: description || '',
      userId,
      itemName: aiResult.itemName,
      confidence: aiResult.confidence || 95,
      estimatedValue: aiResult.estimatedValueExplanation,
      advice: aiResult.recyclingAdvice,
      points: aiResult.points,
    });

    res.json({
      message: 'Pickup request created successfully',
      pickupId,
      cloudinaryUrl,
      aiResult
    });
  } catch (error: any) {
    console.error('Error creating pickup request:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Fetch all requests (Worker)
router.get('/worker', async (req, res) => {
  try {
    const requests = await getPickupRequests();
    res.json({ data: requests });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Update status (Worker)
router.post('/update-status', async (req, res) => {
  try {
    const { id, status } = req.body;
    await updatePickupRequestStatus(id, status);
    res.json({ message: 'Status updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Update schedule (User)
router.post('/schedule', async (req, res) => {
  try {
    const { id, date, timeSlot, address } = req.body;
    await updatePickupSchedule(id, date, timeSlot, address);
    res.json({ message: 'Schedule updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Fetch user requests
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await getPickupRequestsByUser(userId);
    res.json({ data: requests });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
