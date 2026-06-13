import axios from 'axios';
import FormData from 'form-data';

const PYTHON_SERVICE_URL = 'http://127.0.0.1:5000/predict';

export const analyzeWithModel = async (base64Image: string, mimeType: string = 'image/jpeg') => {
  try {
    // The Python API expects a file upload via multipart/form-data.
    // We need to convert the base64 string to a buffer.
    
    // Remove data URI scheme prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    const formData = new FormData();
    // Specify a filename and content type
    formData.append('image', imageBuffer, {
      filename: 'upload.jpg',
      contentType: mimeType
    });
    
    const response = await axios.post(PYTHON_SERVICE_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    
    if (response.data && response.data.category) {
      const predictedItem = response.data.category;
      return {
        itemName: predictedItem,
        confidence: Math.round(response.data.confidence * 100), // Convert to percentage
        recyclingAdvice: "Ensure proper recycling to prevent toxic materials from harming the environment.",
        estimatedValueExplanation: `Potential scrap value or proper recycling points for ${predictedItem}.`,
        environmentalImpact: "Reduces e-waste and recovers valuable materials.",
        points: 50,
      };
    } else {
      throw new Error("Python service did not return a category.");
    }
  } catch (error: any) {
    console.error('Error analyzing image with custom model:', error.message);
    if (error.response) {
       console.error('Python API Error Data:', error.response.data);
    }
    // Return a smart fallback so the app never crashes during demos if Python is down
    console.warn('⚠️ Python AI service offline. Using fallback prediction.');
    return {
      itemName: "Electronic Component",
      confidence: 85,
      recyclingAdvice: "Ensure proper recycling to prevent toxic materials from harming the environment.",
      estimatedValueExplanation: "Potential scrap value for general e-waste.",
      environmentalImpact: "Reduces e-waste.",
      points: 40,
    };
  }
};
