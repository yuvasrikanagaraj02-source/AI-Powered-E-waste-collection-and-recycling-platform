import * as admin from 'firebase-admin';
import path from 'path';

// Initialize Firebase Admin
try {
  const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath))
  });
  console.log('✅ Firebase Admin initialized securely.');
} catch (error) {
  console.error('❌ ERROR: Firebase Admin initialization failed. Make sure you have serviceAccountKey.json in the backend root directory.');
}

export const db = admin.firestore();
db.settings({ preferRest: true, ignoreUndefinedProperties: true });

// ---------------------------
// 🗑️ CREATE PICKUP REQUEST
// ---------------------------
export const createPickupRequest = async (data: {
  imageUrl: string;
  description: string;
  userId: string;
  location?: string;
  itemName: string;
  confidence: number;
  estimatedValue: string;
  advice: string;
  points: number;
}) => {
  try {
    const docRef = await db.collection('pickup_requests').add({
      image_url: data.imageUrl,
      description: data.description,
      user_id: data.userId,
      location: data.location || 'Eco City',
      status: 'Pending',
      item_name: data.itemName,
      confidence: data.confidence,
      estimated_value: data.estimatedValue,
      advice: data.advice,
      points: data.points,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create request in Firestore');
  }
};

// ---------------------------
// 📄 GET REQUESTS (FOR WORKER)
// ---------------------------
export const getPickupRequests = async () => {
  try {
    const snapshot = await db.collection('pickup_requests')
      .orderBy('created_at', 'desc')
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.user_id,
        imageUrl: data.image_url,
        itemName: data.item_name,
        description: data.description,
        status: data.status,
        location: data.location,
        points: data.points,
        createdAt: data.created_at?.toDate() || new Date(),
      };
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch requests');
  }
};

// ---------------------------
// 🔄 UPDATE REQUEST STATUS
// ---------------------------
export const updatePickupRequestStatus = async (id: string, status: string) => {
  try {
    await db.collection('pickup_requests').doc(id).update({ status });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update request status');
  }
};

// ---------------------------
// 📅 UPDATE REQUEST SCHEDULE
// ---------------------------
export const updatePickupSchedule = async (id: string, date: string, timeSlot: string, address: string) => {
  try {
    await db.collection('pickup_requests').doc(id).update({ 
      schedule_date: date,
      time_slot: timeSlot,
      address: address,
      status: 'Scheduled'
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update request schedule');
  }
};

// ---------------------------
// 👤 GET REQUESTS BY USER
// ---------------------------
export const getPickupRequestsByUser = async (userId: string) => {
  if (!userId || userId === 'undefined') {
    return [];
  }
  try {
    const snapshot = await db.collection('pickup_requests')
      .where('user_id', '==', userId)
      .get();

    const results = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.user_id,
        imageUrl: data.image_url,
        itemName: data.item_name,
        description: data.description,
        status: data.status,
        location: data.location,
        points: data.points,
        createdAt: data.created_at?.toDate() || new Date(0),
      };
    });

    // Sort in memory to avoid Firebase Composite Index requirement
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return results;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch user requests');
  }
};
