import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Intelligently resolve the Backend URL to permanently prevent "Failed to fetch"
const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    // On Web, always hit the same host the browser is running on, bypassing stale hardcoded IPs.
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    return `http://${hostname}:3000/api`;
  }

  // On Mobile, use the explicitly set IP in .env, fallback to Android Emulator localhost
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  return Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';
};

const BASE_URL = getBaseUrl();

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('authToken');
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

export const signUp = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Signup failed');
  }
  return response.json();
};

export const guestLogin = async () => {
  const response = await fetch(`${BASE_URL}/auth/guest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Guest login failed');
  }
  return response.json();
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Login failed');
  }
  return response.json();
};

export const createPickupRequest = async (data: {
  base64Image: string;
  description: string;
  userId: string;
  mimeType?: string;
}) => {
  const response = await fetchWithAuth(`${BASE_URL}/pickups/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to create request');
  }
  return response.json();
};

export const schedulePickup = async (id: string, date: string, timeSlot: string, address: string) => {
  const response = await fetchWithAuth(`${BASE_URL}/pickups/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, date, timeSlot, address })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to schedule pickup');
  }
  return response.json();
};

export const predictEWaste = async (data: {
  base64Image: string;
  mimeType?: string;
}) => {
  const response = await fetchWithAuth(`${BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Prediction failed');
  }
  return response.json();
};

export const getPickupRequests = async () => {
  const response = await fetchWithAuth(`${BASE_URL}/pickups/worker`);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to fetch requests');
  }
  const result = await response.json();
  return result.data;
};

export const updatePickupRequestStatus = async (id: string, status: string) => {
  const response = await fetchWithAuth(`${BASE_URL}/pickups/update-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to update request status');
  }
  return response.json();
};

export const getPickupRequestsByUser = async (userId: string) => {
  if (!userId || userId === 'undefined') {
    return [];
  }
  const response = await fetchWithAuth(`${BASE_URL}/pickups/user/${userId}`);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to fetch user requests');
  }
  const result = await response.json();
  return result.data;
};
