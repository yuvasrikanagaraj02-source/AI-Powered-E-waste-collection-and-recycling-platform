import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (base64Image: string, mimeType: string = 'image/jpeg'): Promise<{ url: string, tags: string[] }> => {
  try {
    // Standard upload (Auto-tagging removed because free tier accounts reject it)
    const uploadResponse = await cloudinary.uploader.upload(`data:${mimeType};base64,${base64Image}`, {
      folder: 'ewaste_images',
    });

    return {
      url: uploadResponse.secure_url,
      tags: []
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};
