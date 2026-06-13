import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const isDesktop = width > 900;
const isTablet = width > 600 && width <= 900;
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, typography } from '../theme';
import * as FileSystem from 'expo-file-system';
import { createPickupRequest } from '../services/apiClient';

export default function UploadImageScreen({ navigation }: any) {
  const { userId } = useAuth();
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [deviceType, setDeviceType] = useState<string | null>(null);

  const showAlert = (title: string, msg: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${msg}`);
    } else {
      Alert.alert(title, msg);
    }
  };

  const pickImage = async (useCamera: boolean = false) => {
    try {
      let result;

      if (useCamera && Platform.OS !== 'web') {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
          showAlert('Permission required', 'Camera permission is required!');
          return;
        }
        result = await ImagePicker.launchCameraAsync({ base64: true });
      } else {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          showAlert('Permission required', 'Gallery permission is required!');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({ base64: true });
      }

      if (!result.canceled && result.assets?.length > 0) {
        setImageUri(result.assets[0].uri);

        let b64 = result.assets[0].base64 || null;
        if (b64 && b64.includes('base64,')) {
          b64 = b64.split('base64,')[1];
        }
        setImageBase64(b64);
        setMimeType(result.assets[0].mimeType);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      showAlert('Error', 'Failed to pick image.');
    }
  };

  const showImagePickerOptions = () => {
    if (Platform.OS === 'web') {
      pickImage(false);
      return;
    }

    Alert.alert(
      'Select Image Source',
      'Choose Camera or Gallery',
      [
        { text: 'Camera', onPress: () => pickImage(true) },
        { text: 'Gallery', onPress: () => pickImage(false) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!imageUri) {
      showAlert('Error', 'Please select an image.');
      return;
    }

    if (!description.trim() && !deviceType) {
      showAlert('Error', 'Please select a device type or add a description.');
      return;
    }

    const finalDescription = deviceType ? `[${deviceType}] ${description}` : description;

    try {
      setLoading(true);

      let finalBase64 = imageBase64;

      if (!finalBase64 && Platform.OS !== 'web') {
        finalBase64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      if (!finalBase64) {
        showAlert('Error', 'Failed to process image data.');
        setLoading(false);
        return;
      }

      const actualUserId = userId || 'demo-user';
      console.log('📤 Submitting pickup request for user:', actualUserId);

      const response = await createPickupRequest({
        base64Image: finalBase64,
        description: finalDescription,
        userId: actualUserId,
        mimeType: mimeType || 'image/jpeg'
      });

      navigation.navigate('AIAnalysis', {
        pickupId: response.pickupId,
        imageUri: response.cloudinaryUrl,
        description: finalDescription,
        aiResult: response.aiResult,
        alreadyAnalyzed: true
      });

    } catch (error: any) {
      console.log('UPLOAD ERROR:', error);
      showAlert('Server Rejected Request', "Exact Error: " + (error.message || String(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.backText}>← Back</Text>

        <Text style={styles.mainTitle}>
          Upload E-Waste Item
        </Text>

        <Text style={styles.stepText}>
          Step 1 of 8
        </Text>

        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
      </View>

      {/* Upload Area */}

      <TouchableOpacity
        style={styles.uploadBox}
        onPress={showImagePickerOptions}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
          />
        ) : (
          <>
            <View style={styles.cameraCircle}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>

            <Text style={styles.uploadTitle}>
              Take Photo or Upload
            </Text>

            <Text style={styles.uploadSub}>
              Tap to open camera or gallery
            </Text>

            <Text style={styles.uploadFormat}>
              Supported: JPG, PNG, HEIC
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Camera / Gallery */}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => pickImage(true)}
        >
          <Text style={styles.actionText}>
            📷 Camera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => pickImage(false)}
        >
          <Text style={styles.actionText}>
            🖼 Gallery
          </Text>
        </TouchableOpacity>
      </View>

      {/* Device Type */}

      <Text style={styles.sectionTitle}>
        Device Type
      </Text>

      <View style={[styles.dropdown, { backgroundColor: '#F0F0F0', borderColor: '#E0E0E0' }]}>
        <Text style={styles.dropdownText}>
          {deviceType ? `Selected: ${deviceType}` : 'Tap a category below ⬇'}
        </Text>
      </View>

      <View style={styles.chipRow}>
        {['Laptop', 'Mobile', 'TV', 'Appliance'].map((type) => (
          <TouchableOpacity
            key={type}
            style={deviceType === type ? styles.activeChip : styles.chip}
            onPress={() => setDeviceType(deviceType === type ? null : type)}
          >
            <Text style={deviceType === type ? styles.activeChipText : styles.chipText}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Description */}

      <Text style={styles.sectionTitle}>
        Describe the Issue
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. My laptop is not working properly, hinge broken and battery issue..."
        placeholderTextColor="#9E9E9E"
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={300}
      />

      {/* Submit */}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.submitText}>
            Upload & Continue →
          </Text>
        )}
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F7F8F6',
  },

  contentContainer: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: isDesktop ? 900 : 500,
    paddingBottom: 40,
  },

  header: {
    backgroundColor: '#166B20',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  backText: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 10,
  },

  mainTitle: {
    fontSize: isDesktop ? 36 : 28,
    color: '#FFF',
    fontWeight: '700',
    textAlign: 'center',
  },

  stepText: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 6,
    fontSize: 16,
  },

  progressBar: {
    height: 5,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    marginTop: 25,
    overflow: 'hidden',
  },

  progressFill: {
    width: '15%',
    height: '100%',
    backgroundColor: '#5DBB63',
  },

  uploadBox: {
    margin: 20,
    minHeight: 260,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#6EBE71',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 25,
  },

  cameraCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EEF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  cameraIcon: {
    fontSize: 38,
  },

  uploadTitle: {
    fontSize: 26,
    color: '#267C2E',
    fontWeight: '700',
    marginBottom: 8,
  },

  uploadSub: {
    color: '#7A7A7A',
    fontSize: 15,
  },

  uploadFormat: {
    color: '#A0A0A0',
    marginTop: 5,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 25,
    gap: 12,
  },

  actionButton: {
    flex: 1,
    backgroundColor: '#EEF6EE',
    borderWidth: 1.5,
    borderColor: '#5DBB63',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },

  actionText: {
    color: '#267C2E',
    fontSize: 16,
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#246E29',
    marginHorizontal: 20,
    marginBottom: 12,
  },

  dropdown: {
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  dropdownText: {
    color: '#7A7A7A',
    fontSize: 16,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    gap: 10,
    marginBottom: 25,
  },

  activeChip: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#EAF8EA',
    borderWidth: 1,
    borderColor: '#5DBB63',
  },

  activeChipText: {
    color: '#267C2E',
    fontWeight: '600',
  },

  chip: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D5D5D5',
    backgroundColor: '#FFF',
  },

  chipText: {
    color: '#808080',
  },

  input: {
    marginHorizontal: 20,
    minHeight: 140,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DADADA',
    padding: 18,
    textAlignVertical: 'top',
    fontSize: 15,
    marginBottom: 30,
  },

  submitButton: {
    marginHorizontal: 20,
    backgroundColor: '#1C7B2A',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },

  submitText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
  },

  previewImage: {
    width: '100%',
    height: 260,
    borderRadius: 18,
    resizeMode: 'cover',
  },

});