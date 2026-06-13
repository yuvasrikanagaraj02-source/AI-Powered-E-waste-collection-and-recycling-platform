import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../theme';
import { login, signUp, guestLogin } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isWorker, setIsWorker] = useState(false);
  const { login: authLogin } = useAuth();

  const showError = (title: string, msg: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${msg}`);
    } else {
      Alert.alert(title, msg);
    }
  };

  const handleAuthentication = async () => {
    if (!email || !password) {
      showError('Error', 'Please enter all fields.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isWorker && !emailRegex.test(email)) {
      showError('Error', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      showError('Error', 'Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      let userCredential;

      if (isLogin) {
        userCredential = await login(email, password);
      } else {
        userCredential = await signUp(email, password);
      }

      const user = userCredential.user;
      const session = userCredential.session;

      if (!user) {
        throw new Error('User not found after authentication.');
      }

      await authLogin(
        user.id,
        user.email ? user.email.split('@')[0] : 'Eco Warrior',
        session?.access_token || '',
        false
      );

      navigation.replace('Home');
    } catch (error: any) {
      console.error('Auth error:', error);
      showError('Authentication Failed', error.message || 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      const userCredential = await guestLogin();
      const user = userCredential.user;
      const session = userCredential.session;

      await authLogin(
        user?.id || 'guest-fallback',
        'Demo Guest',
        session?.access_token || 'guest-bypass-token',
        false
      );

      navigation.replace('Home');
    } catch (error: any) {
      console.error('Guest Auth error:', error);
      await authLogin('guest-fallback', 'Demo Guest', 'guest-bypass-token', false);
      navigation.replace('Home');
    } finally {
      setLoading(false);
    }
  };

  const handleWorkerLogin = async () => {
    if (!email || !password) {
      showError('Error', 'Please enter both Employee ID and password.');
      return;
    }
    try {
      setLoading(true);
      // Inject the bypass token so the backend doesn't reject the worker's requests
      await authLogin('worker-demo', 'Demo Worker', 'guest-bypass-token', true);
      navigation.replace('WorkerDashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>

        {/* Logo Section */}

        <View style={styles.logoSection}>
          <Text style={styles.logoIcon}>♻️</Text>
          <Text style={styles.logoTitle}>EcoRecycle</Text>
          <Text style={styles.logoSubtitle}>
            Smart E-Waste Recycling
          </Text>
        </View>

        {/* User Worker Toggle */}

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              !isWorker && styles.roleButtonActive,
            ]}
            onPress={() => setIsWorker(false)}
          >
            <Ionicons name="person" size={18} color={!isWorker ? "#FFF" : "#555"} style={styles.roleIcon} />
            <Text
              style={[
                styles.roleText,
                !isWorker && styles.roleTextActive,
              ]}
            >
              USER
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              isWorker && styles.roleButtonActive,
            ]}
            onPress={() => setIsWorker(true)}
          >
            <MaterialCommunityIcons name="account-hard-hat" size={18} color={isWorker ? "#FFF" : "#555"} style={styles.roleIcon} />
            <Text
              style={[
                styles.roleText,
                isWorker && styles.roleTextActive,
              ]}
            >
              WORKER
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>
          Welcome Back 👋
        </Text>

        <Text style={styles.subtitle}>
          Sign in to continue your green journey
        </Text>

        {/* Email */}

        <Text style={styles.label}>
          Email / Employee ID
        </Text>

        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons name="email-outline" size={24} color="#555" style={styles.inputIcon} />
          <TextInput
            style={styles.inputElement}
            placeholder={
              isWorker
                ? 'Enter Employee ID'
                : 'Enter Email Address'
            }
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            autoCapitalize="none"
          />
        </View>

        {/* Password */}

        <Text style={styles.label}>
          Password
        </Text>

        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons name="lock-outline" size={24} color="#555" style={styles.inputIcon} />
          <TextInput
            style={styles.inputElement}
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#555" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Sign In */}

        <TouchableOpacity
          style={styles.button}
          disabled={loading}
          onPress={
            isWorker
              ? handleWorkerLogin
              : handleAuthentication
          }
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              SIGN IN
            </Text>
          )}
        </TouchableOpacity>

        {/* Divider */}

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>
            OR CONTINUE WITH
          </Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google */}

        <TouchableOpacity style={styles.socialButton}>
          <MaterialCommunityIcons name="google" size={24} color="#DB4437" style={{ marginRight: 15 }} />
          <Text style={styles.socialText}>Google Login</Text>
        </TouchableOpacity>

        {/* OTP */}

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => navigation.navigate('OTP')}
        >
          <Ionicons name="phone-portrait-outline" size={24} color="#2E7D32" style={styles.socialIcon} />
          <Text style={styles.socialText}>Phone OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomLink}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.bottomTextNormal}>
            {isLogin ? 'New User? ' : 'Already have an account? '}
            <Text style={styles.bottomTextBold}>
              {isLogin ? 'Create Account' : 'Sign In'}
            </Text>
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#EEF5E8',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 30,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 700,
    borderWidth: 1,
    borderColor: '#5A8F53',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },

  logoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logoIcon: {
    fontSize: 70,
    marginBottom: 10,
  },

  logoTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1F7A31',
  },

  logoSubtitle: {
    fontSize: 18,
    color: '#555',
    marginTop: 5,
  },

  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#CCC',
  },

  roleButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },

  roleButtonActive: {
    backgroundColor: '#387B3B',
  },

  roleIcon: {
    marginRight: 6,
  },

  roleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#555',
  },

  roleTextActive: {
    color: '#FFF',
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 25,
    color: '#111',
  },

  subtitle: {
    display: 'none', // Removed subtitle to match mockup
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
    color: '#333',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderWidth: 1,
    borderColor: '#A8A8A8',
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginBottom: 15,
  },

  inputIcon: {
    marginLeft: 15,
    marginRight: 10,
  },

  eyeIcon: {
    padding: 10,
    marginRight: 5,
  },

  inputElement: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    color: '#333',
  },

  forgotBtn: {
    alignSelf: 'center',
    marginBottom: 20,
  },

  forgotText: {
    fontSize: 15,
    color: '#387B3B',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  button: {
    height: 60,
    backgroundColor: '#387B3B',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DADADA',
  },

  dividerText: {
    marginHorizontal: 15,
    fontWeight: '600',
    color: '#888',
    fontSize: 13,
    letterSpacing: 1,
  },

  socialButton: {
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  socialIcon: {
    marginRight: 15,
  },

  socialText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  bottomLink: {
    alignItems: 'center',
    marginTop: 15,
  },

  bottomTextNormal: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },

  bottomTextBold: {
    color: '#387B3B',
    fontWeight: '700',
  },

});