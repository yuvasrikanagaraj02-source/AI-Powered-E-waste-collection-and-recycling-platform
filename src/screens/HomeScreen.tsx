import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPickupRequestsByUser } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }: any) {
  const { userName, userId, logout } = useAuth();
  const [points, setPoints] = useState<number | null>(null);

  const fetchUserData = async () => {
    try {
      const requests = await getPickupRequestsByUser(userId || 'demo-user');
      const totalPoints = requests.reduce((acc: number, curr: any) => acc + (curr.points || 0), 0);
      setPoints(totalPoints);
    } catch (error) {
      console.error("Failed to fetch points", error);
      setPoints(0);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserData();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello, {userName}!</Text>
            <Text style={styles.subGreeting}>Let's save the planet.</Text>
          </View>
          <View style={styles.notification}>
            <Text style={{fontSize:22}}>🔔</Text>

            <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
        </View>

        <View style={styles.pointsCard}>
          <Text style={styles.pointsLabel}>
             Total Green Points
          </Text>

          <View style={styles.pointsRow}>
              {points === null ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.pointsValue}>
                  {points || 1450} pts
                </Text>
              )}

              <Text style={styles.trophy}>
                 🏆
              </Text>
          </View>

          <View style={styles.progressTrack}>
              <View style={styles.progressFill}/>
          </View>

          <View style={styles.pointsFooter}>
              <Text style={styles.pointsFooterText}>
                Silver Level • 550 pts to Gold
              </Text>

              <Text style={styles.pointsFooterText}>
                3 items recycled
              </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('UploadImage')}>
             <Text style={styles.actionIcon}>📸</Text>
             <Text style={styles.actionText}>Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('MyPickups')}>
             <Text style={styles.actionIcon}>🚚</Text>
             <Text style={styles.actionText}>Track</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Rewards')}>
             <Text style={styles.actionIcon}>🎁</Text>
             <Text style={styles.actionText}>Rewards</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor:'#EDF6FF', borderColor:'#B8DAFF' }]} 
            onPress={async () => {
              await logout();
              navigation.replace('Login');
            }}>
             <Text style={styles.actionIcon}>🚪</Text>
             <Text style={styles.actionText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Impact</Text>
        <View style={styles.quickActionsRow}>
          <View style={styles.impactCard}>
            <Text style={styles.impactIcon}>🌳</Text>
            <Text style={styles.impactValue}>12</Text>
            <Text style={styles.impactLabel}>Trees</Text>
          </View>
          <View style={styles.impactCard}>
            <Text style={styles.impactIcon}>🔋</Text>
            <Text style={styles.impactValue}>4</Text>
            <Text style={styles.impactLabel}>Items</Text>
          </View>
          <View style={styles.impactCard}>
            <Text style={styles.impactIcon}>🌍</Text>
            <Text style={styles.impactValue}>2kg</Text>
            <Text style={styles.impactLabel}>CO2 Saved</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <View style={styles.pickupCard}>
          <View style={{flex:1}}>
            <Text style={styles.pickupTitle}>Pending E-Waste</Text>
            <Text style={styles.pickupSub}>Scheduled for Today</Text>
          </View>
          <TouchableOpacity style={styles.trackBtn}>
             <Text style={styles.trackBtnText}>Track</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentActivityCard}>
          <View style={styles.statusPill}>
             <Text style={styles.statusText}>
                Completed
             </Text>
          </View>
          <Text style={styles.activityTitle}>Laptop Battery</Text>
          <Text style={styles.activityPoints}>+50 pts</Text>
        </View>

        <View style={{height: 40}} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('UploadImage')}>
         <Text style={{color:'#fff', fontSize:30, fontWeight:'bold', marginTop:-2}}>+</Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
         <TouchableOpacity>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navActive}>Home</Text>
         </TouchableOpacity>

         <TouchableOpacity onPress={() => navigation.navigate('MyPickups')}>
            <Text style={styles.navIcon}>📋</Text>
            <Text style={styles.navText}>Pickups</Text>
         </TouchableOpacity>

         <TouchableOpacity onPress={() => navigation.navigate('Rewards')}>
            <Text style={styles.navIcon}>🎁</Text>
            <Text style={styles.navText}>Rewards</Text>
         </TouchableOpacity>

         <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navText}>Profile</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F4',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 18,
    paddingBottom: 18,
    backgroundColor: '#15651C',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  subGreeting: {
    color: '#A5D6A7',
    fontSize: 14,
    marginTop: 4,
  },
  notification: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF5252',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  pointsCard: {
    backgroundColor: '#2D8B2D',
    borderRadius: 16,
    padding: 16,
    marginTop: 15,
  },
  pointsLabel: {
    color: '#A5D6A7',
    fontWeight: '600',
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
  },
  trophy: {
    fontSize: 28,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#1D6623',
    borderRadius: 10,
    marginTop: 8,
  },
  progressFill: {
    width: '72%',
    height: 8,
    backgroundColor: '#FFD740',
    borderRadius: 10,
  },
  pointsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  pointsFooterText: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.9,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    marginTop: 15,
    marginBottom: 15,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  quickAction: {
    width: '22%',
    height: 78,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CFE5CF',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  impactCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7E9D7',
  },
  impactIcon: {
    fontSize: 28,
  },
  impactValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2E7D32',
    marginTop: 5,
  },
  impactLabel: {
    fontSize: 12,
    color: '#666',
  },
  pickupCard: {
    marginTop: 15,
    backgroundColor: '#FFF9F0',
    borderWidth: 1.5,
    borderColor: '#FFB54C',
    borderRadius: 15,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333',
  },
  pickupSub: {
    fontSize: 13,
    color: '#FF9800',
    marginTop: 4,
  },
  trackBtn: {
    backgroundColor: '#FF7A00',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  trackBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  recentActivityCard: {
    marginTop: 15,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  activityPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 4,
  },
  statusPill: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 11,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 30,
    borderWidth: 8,
    borderColor: '#2E7D32',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginHorizontal: 0,
    marginBottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
  },
  navIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
  navActive: {
    color: '#2E7D32',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '700',
  },
  navText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
});
