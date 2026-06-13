import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing, Alert, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { colors, spacing, typography } from '../theme';

export default function CertificateScreen({ route, navigation }: any) {
  const { item, date, points, id } = route.params || {};
  const { userName } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const viewShotRef = useRef<any>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const toastAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, easing: Easing.out(Easing.exp), useNativeDriver: false })
    ]).start();
  }, []);

  const showToast = () => {
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 50, duration: 400, easing: Easing.out(Easing.back(1.5)), useNativeDriver: false }),
      Animated.delay(2500),
      Animated.timing(toastAnim, { toValue: -100, duration: 400, easing: Easing.in(Easing.ease), useNativeDriver: false })
    ]).start();
  };

  // Helper to capture the screen safely on both Web and Mobile
  const captureCertificateImage = async (): Promise<string> => {
    if (Platform.OS === 'web') {
      // 100% bulletproof Web Capture using direct html2canvas
      if (!(window as any).html2canvas) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      const element = document.getElementById('certificate-card');
      if (!element) throw new Error("Certificate element not found");
      
      const canvas = await (window as any).html2canvas(element, {
        backgroundColor: '#0B192C',
        scale: 2, // High-res image
        useCORS: true
      });
      return canvas.toDataURL("image/png");
    } else {
      // Native Mobile Capture
      return await viewShotRef.current.capture();
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const uri = await captureCertificateImage();

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = uri;
        link.download = `Green_Certificate_${id || '001'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast();
      } else {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'We need permission to save the certificate to your gallery.');
          setDownloading(false);
          return;
        }
        await MediaLibrary.saveToLibraryAsync(uri);
        showToast();
      }
    } catch (error) {
      console.error('Failed to download certificate', error);
      Alert.alert('Error', 'Failed to save the certificate. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const uri = await captureCertificateImage();
      
      if (Platform.OS === 'web') {
        try {
          if (navigator.share) {
            // Convert base64 URI to a true File object
            const response = await fetch(uri);
            const blob = await response.blob();
            const file = new File([blob], `Green_Certificate_${id || '001'}.png`, { type: 'image/png' });
            
            // Check if the browser allows file sharing
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: 'My Green Certificate',
                text: `I just recycled my ${item || 'e-waste'} and earned ${points || 0} Green Points! Join me in saving the planet!`,
              });
            } else {
              // Fallback: Share text and download the image
              await navigator.share({
                title: 'My Green Certificate',
                text: `I just recycled my ${item || 'e-waste'} and earned ${points || 0} Green Points! Join me in saving the planet!`,
              });
              handleDownload();
            }
          } else {
            alert("Your browser does not support direct social sharing. We have downloaded the image for you to share manually!");
            handleDownload();
          }
        } catch (shareError: any) {
          // If the user cancels the share dialog or the browser blocks it
          if (shareError.name !== 'AbortError') {
            alert("Sharing blocked by browser. Downloading image instead...");
            handleDownload();
          }
        }
        return;
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share your Green Certificate!',
          UTI: 'public.png'
        });
      } else {
        Alert.alert("Sharing not available", "Sharing is not supported on this device.");
      }
    } catch (error) {
      console.error('Error sharing', error);
      Alert.alert('Error', 'Failed to share the certificate.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated Success Toast */}
      <Animated.View style={[styles.toast, { transform: [{ translateY: toastAnim }] }]}>
        <Text style={styles.toastText}>✅ Certificate Saved to Gallery!</Text>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          
          <View style={styles.certificateWrapper}>
            <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }} style={{ backgroundColor: '#FFFCF2', borderRadius: 12 }}>
              
              {/* USER'S UI FRAGMENT */}
              <View nativeID="certificate-card" style={styles.certificateCard}>

                <View style={styles.certHeader}>
                  <Text style={styles.certHeaderText}>
                    CERTIFICATE OF RESPONSIBLE RECYCLING
                  </Text>
                </View>

                <View style={styles.leafRow}>
                  <Text style={styles.leaf}>🌿</Text>
                  <Text style={styles.leaf}>🌿</Text>
                </View>

                <Text style={styles.certifiesText}>
                  This certifies that
                </Text>

                <Text style={styles.certUser}>
                  {userName}
                </Text>

                <View style={styles.nameUnderlineRow}>
                  <View style={styles.nameLine}/>
                  <View style={styles.nameLine}/>
                </View>

                <Text style={styles.bodyText}>
                  has responsibly recycled
                </Text>

                <Text style={styles.itemText}>
                  1 {item || 'Dell Inspiron Laptop'}
                </Text>

                <Text style={styles.bodyText}>
                  through our AI-powered recycling platform.
                </Text>

                <View style={styles.statsRow}>
                  <View style={styles.statBlock}>
                    <Text style={styles.statLabel}>CO₂ Saved</Text>
                    <Text style={styles.statValue}>24 kg</Text>
                  </View>

                  <View style={styles.statBlock}>
                    <Text style={styles.statLabel}>Points Earned</Text>
                    <Text style={styles.statValue}>+{points || 200}</Text>
                  </View>

                  <View style={styles.statBlock}>
                    <Text style={styles.statLabel}>Items Recycled</Text>
                    <Text style={styles.statValue}>3</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View>
                    <Text style={styles.infoLabel}>Date</Text>
                    <Text style={styles.infoValue}>
                      {date || '24 May 2025'}
                    </Text>
                  </View>

                  <View>
                    <Text style={styles.infoLabel}>Cert ID</Text>
                    <Text style={styles.infoValue}>
                      #{id || 'EW-2025-0012'}
                    </Text>
                  </View>
                </View>

                <View style={styles.bottomSection}>
                  <View style={styles.qrBox}>
                    <Text style={styles.qrCode}>
                      ▓▓{"\n"}▓░▓{"\n"}░▓▓
                    </Text>

                    <Text style={styles.qrText}>
                      Scan to verify certificate
                    </Text>

                    <Text style={styles.verifyText}>
                      EWaste verified
                    </Text>
                  </View>

                  <View style={styles.medal}>
                    <Text style={styles.medalIcon}>
                      🏅
                    </Text>
                  </View>
                </View>

                <Text style={styles.footerText}>
                  Your contribution supports environmental sustainability
                  and responsible resource recovery.
                </Text>

              </View>
              {/* END USER'S UI FRAGMENT */}

            </ViewShot>
          </View>

          {/* USER'S ACTION BUTTONS */}
          <View style={styles.buttonRow}>

            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={handleDownload}
            >
              <Text style={styles.downloadBtnText}>
                {downloading ? 'Downloading...' : '⬇ Download PDF'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareBtn}
              onPress={handleShare}
            >
              <Text style={styles.shareBtnText}>
                ↗ Share
              </Text>
            </TouchableOpacity>

          </View>

          <View style={styles.socialContainer}>
            <Text style={styles.socialTitle}>
              Share your green achievement
            </Text>

            <View style={styles.socialRow}>
              <Text style={styles.socialIcon}>📱</Text>
              <Text style={styles.socialIcon}>✉️</Text>
              <Text style={styles.socialIcon}>🔗</Text>
              <Text style={styles.socialIcon}>🐦</Text>
              <Text style={styles.socialIcon}>💼</Text>
            </View>
          </View>
          {/* END USER'S ACTION BUTTONS */}

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Store')}>
            <Text style={styles.backButtonText}>Redeem Rewards →</Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B192C' }, // Deep tech background
  content: { padding: spacing.l, paddingBottom: spacing.xxl, alignItems: 'center' },
  
  toast: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: '#00C853',
    padding: spacing.m,
    borderRadius: 12,
    zIndex: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  toastText: {
    ...typography.title,
    color: '#FFF',
    fontSize: 16,
  },

  certificateWrapper: {
    width: '100%',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  
  certificateCard: {
    backgroundColor: '#FFFCF2', // Rich parchment color
    borderRadius: 12,
    paddingBottom: 20,
    borderWidth: 2,
    borderColor: '#D4AF37', // Gold border
    overflow: 'hidden',
  },

  backButton: {
    paddingVertical: spacing.m,
    marginTop: 20,
  },
  backButtonText: {
    ...typography.title,
    color: '#FFF',
    fontSize: 16,
    textDecorationLine: 'underline',
    opacity: 0.8,
  },

  certHeader:{
    backgroundColor:'#16661d',
    paddingVertical:14,
    alignItems:'center',
  },

  certHeaderText:{
    color:'#fff',
    fontWeight:'700',
    fontSize:18,
  },

  leafRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:15,
    marginTop:8,
  },

  leaf:{
    fontSize:24,
  },

  certifiesText:{
    textAlign:'center',
    color:'#777',
    marginTop:10,
  },

  certUser:{
    fontSize:36,
    fontWeight:'700',
    color:'#2e7d32',
    textAlign:'center',
    marginTop:6,
  },

  nameUnderlineRow:{
    flexDirection:'row',
    justifyContent:'center',
    marginTop:5,
  },

  nameLine:{
    width:70,
    height:2,
    backgroundColor:'#4caf50',
    marginHorizontal:15,
  },

  bodyText:{
    textAlign:'center',
    color:'#666',
    marginTop:10,
  },

  itemText:{
    textAlign:'center',
    fontSize:28,
    fontWeight:'700',
    color:'#333',
    marginVertical:10,
  },

  statsRow:{
    flexDirection:'row',
    justifyContent:'space-around',
    marginTop:25,
    borderTopWidth:1,
    borderBottomWidth:1,
    borderColor:'#eee',
    paddingVertical:15,
  },

  statBlock:{
    alignItems:'center',
  },

  statLabel:{
    color:'#777',
  },

  statValue:{
    color:'#2e7d32',
    fontSize:24,
    fontWeight:'700',
  },

  infoRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:25,
    marginTop:20,
  },

  infoLabel:{
    color:'#999',
  },

  infoValue:{
    fontWeight:'700',
    color:'#444',
  },

  bottomSection:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:25,
    paddingHorizontal:20,
  },

  qrBox:{
    width:110,
    height:110,
    borderWidth:1,
    borderColor:'#c8e6c9',
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
  },

  qrCode:{
    fontSize:14,
  },

  qrText:{
    fontSize:9,
    textAlign:'center',
  },

  verifyText:{
    fontSize:10,
    color:'#2e7d32',
  },

  medal:{
    width:60,
    height:60,
    borderRadius:30,
    backgroundColor:'#fbc02d',
    justifyContent:'center',
    alignItems:'center',
  },

  medalIcon:{
    fontSize:30,
  },

  footerText:{
    textAlign:'center',
    color:'#777',
    marginTop:20,
    fontSize:12,
  },

  buttonRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:20,
    width:'100%',
  },

  downloadBtn:{
    width:'47%',
    backgroundColor:'#2e7d32',
    paddingVertical:18,
    borderRadius:15,
    alignItems:'center',
  },

  downloadBtnText:{
    color:'#fff',
    fontWeight:'700',
  },

  shareBtn:{
    width:'47%',
    borderWidth:2,
    borderColor:'#4caf50',
    paddingVertical:18,
    borderRadius:15,
    alignItems:'center',
  },

  shareBtnText:{
    color:'#2e7d32',
    fontWeight:'700',
  },

  socialContainer:{
    marginTop:18,
    backgroundColor:'#edf5e8',
    borderRadius:15,
    padding:15,
    width:'100%',
  },

  socialTitle:{
    textAlign:'center',
    color:'#4e7f45',
    marginBottom:10,
  },

  socialRow:{
    flexDirection:'row',
    justifyContent:'space-around',
  },

  socialIcon:{
    fontSize:28,
  },
});