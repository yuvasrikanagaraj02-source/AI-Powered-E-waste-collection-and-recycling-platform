import { Router } from 'express';

const router = Router();
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || '';

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Signup failed');
    res.json({ user: { id: data.localId, email: data.email }, session: { access_token: data.idToken } });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Login failed');
    res.json({ user: { id: data.localId, email: data.email }, session: { access_token: data.idToken } });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/guest', async (req, res) => {
  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Guest login failed');
    res.json({ user: { id: data.localId }, session: { access_token: data.idToken } });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
