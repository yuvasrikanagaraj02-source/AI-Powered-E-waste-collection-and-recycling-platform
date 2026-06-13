import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen({ navigation }: any) {
  const { userId, isWorker, isLoading } = useAuth();

  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(progress, {
        toValue: 100,
        duration: 10000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      })
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(scale, {
          toValue: 0.95,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (userId) {
        if (isWorker) {
          navigation.replace('Login');
        } else {
          navigation.replace('Login');
        }
      } else {
        navigation.replace('Onboarding');
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigation, isLoading, userId, isWorker]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.container}>

      {/* Decorative Leaves */}

      <Text style={styles.topLeftLeaf}>🌿</Text>
      <Text style={styles.topRightLeaf}>🍃</Text>
      <Text style={styles.bottomLeftLeaf}>🌱</Text>
      <Text style={styles.bottomRightLeaf}>🌿</Text>

      {/* Background Rings */}

      <Animated.View style={[styles.outerRing, { opacity: fade }]}>
        <View style={styles.middleRing}>
          <View style={styles.innerRing}>

            <Animated.View style={[styles.logoCircle, { transform: [{ scale }] }]}>
              <Text style={styles.recycleIcon}>♻</Text>
            </Animated.View>

            <Text style={styles.title}>
              EcoRecycle
            </Text>

            <Text style={styles.subtitle}>
              Responsible E-Waste Management
            </Text>

            <Text style={styles.features}>
              Upload • Recycle • Earn • Certify
            </Text>

            {/* Loading */}

            <View style={styles.loadingContainer}>
              <View style={styles.loadingTrack}>
                <Animated.View style={[styles.loadingFill, { width: progressWidth }]} />
              </View>

              <Text style={styles.loadingText}>
                Loading...
              </Text>
            </View>

          </View>
        </View>
      </Animated.View>

      {/* Footer */}

      <View style={styles.footer}>

        <Text style={styles.footerText}>
          Powered by AI • Green India Initiative
        </Text>

        <Text style={styles.version}>
          v1.0.0
        </Text>

        <View style={styles.dotsContainer}>
          <View style={styles.activeDot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#16691F',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },

  outerRing: {
    width: 650,
    height: 650,
    borderRadius: 325,
    backgroundColor: 'rgba(80,180,80,0.15)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  middleRing: {
    width: 480,
    height: 480,
    borderRadius: 240,
    backgroundColor: 'rgba(90,190,90,0.12)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  innerRing: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(120,220,120,0.08)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#57C257',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8
  },

  recycleIcon: {
    fontSize: 54,
    color: '#000'
  },

  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 20
  },

  subtitle: {
    fontSize: 20,
    color: '#DCEFD8',
    marginTop: 10,
    textAlign: 'center'
  },

  features: {
    marginTop: 30,
    fontSize: 16,
    color: '#BEE2B6',
    textAlign: 'center'
  },

  loadingContainer: {
    marginTop: 40,
    alignItems: 'center'
  },

  loadingTrack: {
    width: 130,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 10,
    overflow: 'hidden'
  },

  loadingFill: {
    width: '68%',
    height: '100%',
    backgroundColor: '#DFF5D7'
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#DCEFD8'
  },

  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center'
  },

  footerText: {
    fontSize: 14,
    color: '#BEE2B6'
  },

  version: {
    marginTop: 12,
    fontSize: 13,
    color: '#BEE2B6'
  },

  dotsContainer: {
    flexDirection: 'row',
    marginTop: 18
  },

  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
    marginHorizontal: 4
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4
  },

  topLeftLeaf: {
    position: 'absolute',
    top: 70,
    left: 25,
    fontSize: 36,
    opacity: 0.35
  },

  topRightLeaf: {
    position: 'absolute',
    top: 90,
    right: 35,
    fontSize: 34,
    opacity: 0.25
  },

  bottomLeftLeaf: {
    position: 'absolute',
    bottom: 120,
    left: 40,
    fontSize: 30,
    opacity: 0.25
  },

  bottomRightLeaf: {
    position: 'absolute',
    bottom: 130,
    right: 30,
    fontSize: 34,
    opacity: 0.3
  }

});
