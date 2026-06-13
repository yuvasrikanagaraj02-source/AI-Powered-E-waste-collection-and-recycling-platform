import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, typography } from '../theme';
import { getPickupRequestsByUser } from '../services/apiClient';

const { width } = Dimensions.get('window');
const isDesktop = width > 900;

export default function RewardsScreen({ navigation }: any) {
  const { userId } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPoints, setCurrentPoints] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const actualUserId = userId || 'demo-user';
      const requests = await getPickupRequestsByUser(actualUserId);

      // Calculate points from all valid requests instantly
      const points = requests.reduce((acc: number, curr: any) => acc + (curr.points || 0), 0);

      setHistory(requests);
      setCurrentPoints(points);
    } catch (error) {
      console.error("Failed to fetch rewards", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch immediately on mount
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData(); // Re-fetch when navigating back to this screen
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#16691F" />
      </View>
    );
  }

  // Pick latest item for the banner
  const latestItem = history.length > 0 ? history[0] : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Green Rewards</Text>
        <Text style={styles.headerStep}>Step 7 of 8</Text>
      </View>

      {/* Reward Banner */}
      {latestItem && (
        <View style={styles.rewardBanner}>
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.congrats}>Congratulations!</Text>
          <Text style={styles.pointsEarned}>+{latestItem.points || 0} Points</Text>
          <Text style={styles.rewardSubtitle}>
            Earned for recycling {latestItem.itemName || 'E-Waste Item'}
          </Text>
        </View>
      )}

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>{currentPoints} pts</Text>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.levelText}>Green Level</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min((currentPoints / 2000) * 100, 100)}%` }]} />
          </View>
          <Text style={styles.progressText}>{currentPoints} / 2000 to Gold</Text>
        </View>
      </View>

      {/* History */}
      <Text style={styles.sectionTitle}>Points History</Text>

      {history.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
          No collected items yet. Start recycling to earn points!
        </Text>
      ) : (
        history.map((item: any) => {
          const dateString = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently';
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.historyCard}
              onPress={() => navigation.navigate('Certificate', {
                item: item.itemName || 'E-Waste Item',
                date: dateString,
                points: item.points || 0,
                id: item.id
              })}
            >
              <Text style={styles.historyIcon}>📱</Text>
              <View style={styles.historyContent}>
                <Text style={styles.historyTitle}>{item.itemName || 'E-Waste Item'}</Text>
                <Text style={styles.historyDate}>{dateString} • Recycled</Text>
              </View>
              <Text style={styles.greenPoints}>+{item.points || 0}</Text>
            </TouchableOpacity>
          );
        })
      )}

      {/* Redeem */}
      <Text style={styles.sectionTitle}>Redeem Points</Text>

      <View style={styles.redeemRow}>
        <TouchableOpacity style={styles.rewardCard}>
          <Text style={styles.rewardIcon}>🎁</Text>
          <Text style={styles.rewardName}>Amazon</Text>
          <Text style={styles.rewardCost}>100 pts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rewardCard}>
          <Text style={styles.rewardIcon}>⛽</Text>
          <Text style={styles.rewardName}>Fuel Card</Text>
          <Text style={styles.rewardCost}>200 pts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rewardCardActive}>
          <Text style={styles.rewardIcon}>🌳</Text>
          <Text style={styles.rewardName}>Plant Tree</Text>
          <Text style={styles.rewardCost}>50 pts</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.redeemButton} onPress={() => navigation.navigate('Store')}>
        <Text style={styles.redeemText}>Redeem Reward →</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F6F3'
  },

  content: {
    paddingBottom: 40,
    alignSelf: 'center',
    width: '100%',
    maxWidth: isDesktop ? 900 : 450
  },

  header: {
    backgroundColor: '#15651D',
    paddingTop: 55,
    paddingBottom: 20,
    alignItems: 'center'
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFF'
  },

  headerStep: {
    color: '#FFF',
    marginTop: 5
  },

  rewardBanner: {
    margin: 20,
    backgroundColor: '#16691F',
    borderRadius: 22,
    padding: 25,
    alignItems: 'center'
  },

  trophy: {
    fontSize: 60
  },

  congrats: {
    color: '#FFF',
    fontSize: 22,
    marginTop: 10
  },

  pointsEarned: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFD93D'
  },

  rewardSubtitle: {
    color: '#CFE7CF',
    marginTop: 8,
    textAlign: 'center'
  },

  balanceCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DDE7DB',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  balanceLabel: {
    color: '#777'
  },

  balanceValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2D6D32'
  },

  progressSection: {
    width: '45%'
  },

  levelText: {
    color: '#2D6D32',
    fontWeight: '600'
  },

  progressTrack: {
    height: 10,
    backgroundColor: '#DDD',
    borderRadius: 20,
    marginVertical: 8
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 20
  },

  progressText: {
    fontSize: 12,
    color: '#666'
  },

  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 24,
    fontWeight: '700',
    color: '#2D6D32'
  },

  historyCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5ECE3'
  },

  historyIcon: {
    fontSize: 26
  },

  historyContent: {
    flex: 1,
    marginLeft: 12
  },

  historyTitle: {
    fontWeight: '700'
  },

  historyDate: {
    color: '#888',
    marginTop: 2
  },

  greenPoints: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4CAF50'
  },

  redPoints: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E53935'
  },

  redeemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20
  },

  rewardCard: {
    width: '31%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE7DB'
  },

  rewardCardActive: {
    width: '31%',
    backgroundColor: '#F0FAF0',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50'
  },

  rewardIcon: {
    fontSize: 28
  },

  rewardName: {
    marginTop: 8,
    fontWeight: '700'
  },

  rewardCost: {
    marginTop: 5,
    color: '#2D6D32'
  },

  redeemButton: {
    marginHorizontal: 20,
    marginTop: 25,
    backgroundColor: '#2E7D32',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center'
  },

  redeemText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700'
  }

});
