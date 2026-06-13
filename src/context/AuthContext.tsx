import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  userId: string | null;
  userName: string | null;
  authToken: string | null;
  isWorker: boolean;
  isLoading: boolean;
  login: (id: string, name: string, token: string, worker: boolean) => Promise<void>;
  logout: () => Promise<void>;
  setPoints: (points: number) => void;
  points: number | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isWorker, setIsWorker] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUserName = await AsyncStorage.getItem('userName');
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedIsWorker = await AsyncStorage.getItem('isWorker');

        if (storedUserId) setUserId(storedUserId);
        if (storedUserName) setUserName(storedUserName);
        if (storedToken) setAuthToken(storedToken);
        if (storedIsWorker === 'true') setIsWorker(true);
      } catch (error) {
        console.error('Failed to load auth data', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const login = async (id: string, name: string, token: string, worker: boolean) => {
    setUserId(id);
    setUserName(name);
    setAuthToken(token);
    setIsWorker(worker);

    await AsyncStorage.setItem('userId', id);
    await AsyncStorage.setItem('userName', name);
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('isWorker', worker ? 'true' : 'false');
  };

  const logout = async () => {
    setUserId(null);
    setUserName(null);
    setAuthToken(null);
    setIsWorker(false);
    setPoints(null);

    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('isWorker');
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        userName,
        authToken,
        isWorker,
        isLoading,
        login,
        logout,
        points,
        setPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
