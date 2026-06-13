import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { updatePickupRequestStatus } from '../services/apiClient';

const { width } = Dimensions.get('window');

const isDesktop = width > 900;

export default function ConfirmCollectionScreen({ route, navigation }: any) {
  const { pickup } = route.params || {};

  const [otp, setOtp] = useState(['7', '3', '9', '1']);
  const [rating, setRating] = useState(4);
  const [loading, setLoading] = useState(false);

  const itemName = pickup?.itemName || 'E-Waste Item';
  const address = pickup?.address || pickup?.location || 'Your Address';
  const timeSlot = pickup?.time_slot || 'Pending Time';
  const dateStr = pickup?.schedule_date || (pickup?.createdAt ? new Date(pickup.createdAt).toLocaleDateString() : 'Recently');

  const handleConfirm = async () => {
    if (!pickup?.id) {
       navigation.navigate('MyPickups');
       return;
    }

    try {
      setLoading(true);
      await updatePickupRequestStatus(pickup.id, 'Completed');
      navigation.navigate('Certificate', { item: pickup?.itemName, points: pickup?.points, id: pickup?.id });
    } catch (e: any) {
      console.error(e);
      alert('Failed to confirm collection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={{position: 'absolute', left: 20, top: 20, zIndex: 10}} onPress={() => navigation.goBack()}>
           <Text style={{color: '#FFF', fontWeight: 'bold'}}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Confirm Collection
        </Text>
        <Text style={styles.headerSub}>
          Final Step
        </Text>
      </View>

      {/* Success Card */}
      <View style={styles.successCard}>
        <View style={styles.successCircle}>
          <Text style={styles.checkmark}>
            ✓
          </Text>
        </View>
        <Text style={styles.successTitle}>
          Item Collected Successfully!
        </Text>
        <Text style={styles.successText}>
          Please confirm the worker has picked up your item
        </Text>
      </View>

      {/* OTP */}
      <View style={styles.otpCard}>
        <Text style={styles.otpTitle}>
          Enter Pickup OTP
        </Text>
        <Text style={styles.otpSubtitle}>
          Worker showed you a 4-digit code
        </Text>
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              value={digit}
              style={styles.otpBox}
              maxLength={1}
              onChangeText={(val) => {
                 const newOtp = [...otp];
                 newOtp[index] = val;
                 setOtp(newOtp);
              }}
            />
          ))}
        </View>
      </View>

      {/* Pickup Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          Pickup Summary
        </Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Item</Text>
          <Text style={styles.summaryValue}>
            {itemName}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Worker</Text>
          <Text style={styles.summaryValue}>
            Assigned Worker
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Pickup Time</Text>
          <Text style={styles.summaryValue}>
            {timeSlot}, {dateStr}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Location</Text>
          <Text style={styles.summaryValue}>
            {address}
          </Text>
        </View>
      </View>

      {/* Rating */}
      <View style={styles.ratingCard}>
        <Text style={styles.ratingTitle}>
          Rate your worker
        </Text>
        <View style={styles.starRow}>
          {[1,2,3,4,5].map(star => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
            >
              <Text style={[styles.star, star <= rating ? styles.starActive : styles.starInactive]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.tapText}>
          Tap to rate
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.confirmButton, loading && { opacity: 0.7 }]}
          onPress={handleConfirm}
          disabled={loading}
        >
          <Text style={styles.confirmText}>
            {loading ? 'Confirming...' : '✓ Yes, Confirm'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportButton}>
          <Text style={styles.reportText}>
            ⚠ Report Issue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Nav Replica */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MyPickups')}>
          <Text style={styles.navIcon}>📋</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Rewards')}>
          <Text style={styles.navIcon}>🎁</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#F4F5F2' },
content: { alignSelf: 'center', width: '100%', maxWidth: isDesktop ? 900 : 450, paddingBottom: 40 },
header: { backgroundColor: '#16691F', paddingTop: 55, paddingBottom: 20, alignItems: 'center' },
headerTitle: { fontSize: 30, fontWeight: '700', color: '#FFF' },
headerSub: { color: '#FFF', marginTop: 4 },
successCard: { backgroundColor: '#EAF4EA', margin: 20, borderRadius: 22, paddingVertical: 20, alignItems: 'center' },
successCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#CFE7CF', justifyContent: 'center', alignItems: 'center' },
checkmark: { fontSize: 60, color: '#4CAF50', fontWeight: '700' },
successTitle: { fontSize: 28, fontWeight: '700', color: '#2D6D32', marginTop: 15, textAlign: 'center' },
successText: { marginTop: 8, color: '#4A8C4A', textAlign: 'center' },
otpCard: { marginHorizontal: 20, borderWidth: 2, borderColor: '#4CAF50', borderRadius: 18, padding: 20, backgroundColor: '#FFF' },
otpTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center', color: '#2D6D32' },
otpSubtitle: { textAlign: 'center', marginTop: 5, color: '#777' },
otpRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
otpBox: { width: 48, height: 48, marginHorizontal: 5, borderWidth: 2, borderColor: '#4CAF50', borderRadius: 10, textAlign: 'center', fontSize: 22, fontWeight: '700' },
summaryCard: { margin: 20, backgroundColor: '#FFF', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#D8E5D5' },
summaryTitle: { fontSize: 22, fontWeight: '700', color: '#2D6D32', marginBottom: 15 },
summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
summaryLabel: { color: '#777' },
summaryValue: { fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
ratingCard: { marginHorizontal: 20, backgroundColor: '#FFF5E6', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#FFD28A', alignItems: 'center' },
ratingTitle: { fontSize: 20, fontWeight: '700', color: '#E67E22' },
starRow: { flexDirection: 'row', marginTop: 12 },
star: { fontSize: 34, marginHorizontal: 4 },
starActive: { color: '#F4C542' },
starInactive: { color: '#DADADA' },
tapText: { marginTop: 6, color: '#E67E22' },
actionRow: { flexDirection: 'row', marginHorizontal: 20, marginTop: 20, justifyContent: 'space-between' },
confirmButton: { flex: 1, backgroundColor: '#2E7D32', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginRight: 8 },
confirmText: { color: '#FFF', fontWeight: '700', fontSize: 18 },
reportButton: { flex: 1, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#E57373', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginLeft: 8 },
reportText: { color: '#D32F2F', fontWeight: '700', fontSize: 18 },
bottomNav: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, paddingVertical: 15, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE' },
navIcon: { fontSize: 24 }
});
