import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');
const isDesktop = width > 900;

export default function StoreScreen({ navigation }: any) {
  const [points, setPoints] = useState(850); // Mock points

  const vouchers = [
    { id: '1', title: '₹500 Amazon Gift Card', cost: 500, icon: '🛒', color: '#FF9900' },
    { id: '2', title: '₹200 Swiggy Voucher', cost: 200, icon: '🍔', color: '#FC8019' },
    { id: '3', title: '₹1000 Flipkart Card', cost: 1000, icon: '🛍️', color: '#2874F0' },
    { id: '4', title: 'Tree Plantation Donation', cost: 150, icon: '🌳', color: '#2E7D32' },
  ];

  const handleRedeem = (cost: number, title: string) => {
    if (points >= cost) {
      Alert.alert(
        'Confirm Redemption',
        `Do you want to redeem ${cost} points for ${title}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, Redeem',
            onPress: () => {
              setPoints(prev => prev - cost);
              Alert.alert('Success!', `You have successfully redeemed ${title}. Your voucher code will be emailed to you shortly.`);
            }
          }
        ]
      );
    } else {
      Alert.alert('Insufficient Points', 'You do not have enough points to redeem this reward.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={{position: 'absolute', left: 20, top: 40, zIndex: 10}} onPress={() => navigation.goBack()}>
           <Text style={{color: '#FFF', fontWeight: 'bold'}}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rewards Store</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Points Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Your Green Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balancePoints}>{points}</Text>
            <Text style={styles.ptsText}>pts</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Available Rewards</Text>

        {/* Vouchers List */}
        {vouchers.map(item => (
          <View key={item.id} style={styles.voucherCard}>
            <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.voucherInfo}>
              <Text style={styles.voucherTitle}>{item.title}</Text>
              <Text style={styles.voucherCost}>{item.cost} pts</Text>
            </View>
            <TouchableOpacity 
              style={[styles.redeemBtn, points < item.cost && styles.redeemBtnDisabled]} 
              onPress={() => handleRedeem(item.cost, item.title)}
            >
              <Text style={styles.redeemBtnText}>Redeem</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F2',
  },
  header: {
    backgroundColor: '#16691F',
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
  },
  content: {
    padding: 20,
    alignSelf: 'center',
    width: '100%',
    maxWidth: isDesktop ? 800 : 500,
    paddingBottom: 40,
  },
  balanceCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#D8E9D2',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  balancePoints: {
    fontSize: 48,
    fontWeight: '800',
    color: '#2E7D32',
    lineHeight: 52,
  },
  ptsText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    marginLeft: 6,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#173B1B',
    marginBottom: 15,
  },
  voucherCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 30,
  },
  voucherInfo: {
    flex: 1,
  },
  voucherTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  voucherCost: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E67E22',
  },
  redeemBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  redeemBtnDisabled: {
    backgroundColor: '#A5D6A7',
  },
  redeemBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
