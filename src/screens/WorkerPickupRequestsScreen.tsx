import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { getPickupRequests, updatePickupRequestStatus } from '../services/apiClient';

const { width } = Dimensions.get('window');
const isDesktop = width > 900;

export default function WorkerPickupRequestsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('All');
  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getPickupRequests();
      setRequestsList(data);
    } catch (error) {
      console.error('Failed to fetch worker requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const unsubscribe = navigation?.addListener('focus', () => {
      fetchRequests();
    });
    return unsubscribe;
  }, [navigation]);

  const handleCollect = async (id: string) => {
    try {
      // Optimistic UI update
      setRequestsList(prev => prev.map(r => r.id === id ? { ...r, status: 'Collected' } : r));
      await updatePickupRequestStatus(id, 'Collected');
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert on error
      fetchRequests();
    }
  };

  const filtered = activeTab === 'All'
    ? requestsList
    : requestsList.filter(item => {
        if (activeTab === 'Pending') {
           return item.status === 'Pending' || item.status === 'Scheduled';
        }
        return item.status.toLowerCase() === activeTab.toLowerCase();
      });

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={{marginBottom: 10}} onPress={() => navigation?.goBack()}>
          <Text style={{color: '#1B5E20', fontWeight: '700'}}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pickup Requests</Text>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterBtn, activeTab === 'All' && styles.activeFilter]}
            onPress={() => setActiveTab('All')}
          >
            <Text style={[styles.filterText, activeTab === 'All' && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterBtn, activeTab === 'Pending' && styles.activeFilter]}
            onPress={() => setActiveTab('Pending')}
          >
            <Text style={[styles.filterText, activeTab === 'Pending' && styles.activeFilterText]}>
              Pending
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterBtn, activeTab === 'Collected' && styles.activeFilter]}
            onPress={() => setActiveTab('Collected')}
          >
            <Text style={[styles.filterText, activeTab === 'Collected' && styles.activeFilterText]}>
              Collected
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {loading ? (
          <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
            No requests found.
          </Text>
        ) : (
          filtered.map((item) => {
            const isCollected = item.status === 'Collected' || item.status === 'Completed';
            const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently';

            return (
              <View key={item.id} style={[styles.card, isCollected && styles.cardCollected]}>
                <View style={styles.cardTop}>
                  <View style={styles.iconBox}>
                    <Text style={styles.icon}>♻️</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>User {item.userId?.slice(0, 5)}...</Text>
                    <Text style={styles.itemName}>{item.itemName || 'E-Waste Item'}</Text>
                    <Text style={styles.description}>"{item.description || 'No description provided'}"</Text>

                    <View style={styles.infoRow}>
                      <Text style={styles.points}>⭐ {item.points || 0} pts</Text>
                      <Text style={styles.location}>📍 {item.address || item.location || 'Eco Center'}</Text>
                    </View>
                  </View>

                  <View>
                    <View style={[styles.badge, isCollected ? styles.badgeCollected : styles.badgePending]}>
                      <Text style={[styles.badgeText, isCollected ? styles.badgeTextCollected : styles.badgeTextPending]}>
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.time}>{item.time_slot || dateStr}</Text>
                  </View>
                </View>

                {!isCollected ? (
                  <TouchableOpacity style={styles.collectBtn} onPress={() => handleCollect(item.id)}>
                    <Text style={styles.collectText}>Mark as Collected</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.collectedBy}>✅ Collected by you</Text>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FAF2' },
  header: { padding: 20, paddingTop: 40, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#D8E9D2' },
  title: { fontSize: 32, fontWeight: '800', color: '#173B1B', marginBottom: 15 },
  filterRow: { flexDirection: 'row' },
  filterBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#B8D7B3', marginRight: 10, backgroundColor: '#fff' },
  activeFilter: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
  filterText: { fontWeight: '700', color: '#5F7B62' },
  activeFilterText: { color: '#fff' },
  scroll: { padding: 18 },
  card: { backgroundColor: '#EEF8E8', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#CFE3C8' },
  cardCollected: { backgroundColor: '#F3F3F3' },
  cardTop: { flexDirection: 'row' },
  iconBox: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#D9EFD7', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  icon: { fontSize: 30 },
  userName: { fontSize: 20, fontWeight: '800', color: '#173B1B' },
  itemName: { fontSize: 18, fontWeight: '700', marginTop: 2 },
  description: { marginTop: 4, color: '#6B7C6C', fontStyle: 'italic' },
  infoRow: { flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' },
  points: { color: '#1B5E20', fontWeight: '700', marginRight: 12 },
  location: { color: '#6D6D6D' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgePending: { backgroundColor: '#FFF3CD' },
  badgeCollected: { backgroundColor: '#E4F5E4' },
  badgeText: { fontWeight: '800', fontSize: 12 },
  badgeTextPending: { color: '#C77700' },
  badgeTextCollected: { color: '#388E3C' },
  time: { marginTop: 12, fontSize: 12, color: '#7B7B7B', textAlign: 'right' },
  collectBtn: { marginTop: 14, backgroundColor: '#2E7D32', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, alignSelf: 'flex-start' },
  collectText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  collectedBy: { marginTop: 14, color: '#66A95E', fontWeight: '700' },
});
