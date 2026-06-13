import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UploadImageScreen from '../screens/UploadImageScreen';
import AIAnalysisScreen from '../screens/AIAnalysisScreen';
import WorkerDashboardScreen from '../screens/WorkerDashboardScreen';
import RewardsScreen from '../screens/RewardsScreen';
import CertificateScreen from '../screens/CertificateScreen';
import PickupSchedulerScreen from '../screens/PickupSchedulerScreen';
import ConfirmCollectionScreen from '../screens/ConfirmCollectionScreen';
import WorkerTrackingScreen from '../screens/WorkerTrackingScreen';
import WorkerPickupRequestsScreen from '../screens/WorkerPickupRequestsScreen';
import WorkerOverflowDashboardScreen from '../screens/WorkerOverflowDashboardScreen';
import MyPickupsScreen from '../screens/MyPickupsScreen';
import OTPScreen from '../screens/OTPScreen';
import ProfileScreen from '../screens/ProfileScreen';
import StoreScreen from '../screens/StoreScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.surface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="UploadImage" 
          component={UploadImageScreen} 
          options={{ title: 'New Request' }} 
        />
        <Stack.Screen 
          name="AIAnalysis" 
          component={AIAnalysisScreen} 
          options={{ title: 'AI Analysis' }} 
        />
        <Stack.Screen 
          name="WorkerDashboard" 
          component={WorkerDashboardScreen} 
          options={{ title: 'Worker Dashboard' }} 
        />
        <Stack.Screen 
          name="PickupScheduler" 
          component={PickupSchedulerScreen} 
          options={{ title: 'Schedule Pickup' }} 
        />
        <Stack.Screen 
          name="ConfirmCollection" 
          component={ConfirmCollectionScreen} 
          options={{ title: 'Confirm Collection' }} 
        />
        <Stack.Screen 
          name="WorkerTracking" 
          component={WorkerTrackingScreen} 
          options={{ title: 'Worker Tracking' }} 
        />
        <Stack.Screen 
          name="Rewards" 
          component={RewardsScreen} 
          options={{ title: 'My Rewards' }} 
        />
        <Stack.Screen 
          name="Certificate" 
          component={CertificateScreen} 
          options={{ title: 'Recycling Certificate' }} 
        />
        <Stack.Screen
          name="WorkerPickupRequests"
          component={WorkerPickupRequestsScreen}
          options={{ title: 'Pickup Requests' }}
        />
        <Stack.Screen
          name="WorkerOverflowDashboard"
          component={WorkerOverflowDashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyPickups"
          component={MyPickupsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OTP"
          component={OTPScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Store"
          component={StoreScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
