import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { getPickupRequestsByUser } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

export default function MyPickupsScreen({ navigation }: any) {
  const { userId } = useAuth();
  const [search, setSearch] = useState('');
  const [pickups, setPickups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const actualUserId = userId || 'demo-user';
      const data = await getPickupRequestsByUser(actualUserId);
      setPickups(data);
    } catch (error) {
      console.error('Failed to fetch user pickups', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups(); // Fetch immediately on mount
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPickups(); // Re-fetch when navigating back to this screen
    });
    return unsubscribe;
  }, [navigation, userId]);

  const filteredPickups = pickups.filter(p => 
    (p.itemName || '').toLowerCase().includes(search.toLowerCase())
  );

  const activePickupsCount = pickups.filter(p => p.status !== 'Completed' && p.status !== 'Collected').length;
  const donePickupsCount = pickups.filter(p => p.status === 'Completed' || p.status === 'Collected').length;

  const renderCard = (item: any) => {
    const isDone = item.status === 'Completed' || item.status === 'Collected';
    const isScheduled = item.status === 'Scheduled';
    const dateString = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently';

    if (isDone) {
      return (
        <View style={styles.doneCard} key={item.id}>
          <View style={styles.cardHeader}>
            <View style={styles.doneIcon}><Text>📺</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.itemName || 'E-Waste Item'}</Text>
              <Text style={styles.workerText}>Recycled • +{item.points || 0} pts</Text>
            </View>
            <View style={styles.doneBadge}>
              <Text style={styles.doneBadgeText}>✓ Done</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.location}>📍 {item.location || 'Eco Center'} • {dateString}</Text>
            <TouchableOpacity style={styles.certificateBtn} onPress={() => navigation.navigate('Certificate', { item: item.itemName, points: item.points, date: dateString, id: item.id })}>
              <Text style={styles.certificateText}>Certificate →</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (isScheduled) {
      return (
        <View style={styles.scheduledCard} key={item.id}>
          <View style={styles.cardHeader}>
            <View style={styles.scheduleIcon}><Text>🖨️</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.itemName || 'E-Waste Item'}</Text>
              <Text style={styles.workerText}>Assigned Worker • {item.status}</Text>
              <Text style={styles.scheduleDate}>{item.schedule_date || 'Awaiting Date'} • {item.time_slot || ''}</Text>
            </View>
            <View style={styles.scheduleBadge}>
              <Text style={styles.scheduleBadgeText}>Scheduled</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.location}>📍 {item.address || item.location || 'Your Address'}</Text>
            <TouchableOpacity style={styles.trackButton} onPress={() => navigation.navigate('WorkerTracking', { pickup: item })}>
              <Text style={styles.trackButtonText}>Track Live →</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Default Pending/Active
    return (
      <View style={styles.activeCard} key={item.id}>
        <View style={styles.cardHeader}>
          <View style={styles.itemIcon}><Text>💻</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>{item.itemName || 'E-Waste Item'}</Text>
            <Text style={styles.workerText}>Status: {item.status || 'Pending'}</Text>
          </View>
          <View style={styles.badgeActive}>
            <Text style={styles.badgeText}>• Active</Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.location}>📍 {item.location || 'Eco Center'} • {dateString}</Text>
          <TouchableOpacity style={styles.trackButton} onPress={() => navigation.navigate('WorkerTracking', { pickup: item })}>
            <Text style={styles.trackButtonText}>Track Live →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Pickups</Text>
        <Text style={styles.headerSubtitle}>All your e-waste history</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search pickups..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* FILTERS */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.activeFilter}>
            <Text style={styles.activeFilterText}>All ({pickups.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filter}>
            <Text style={styles.filterText}>Active ({activePickupsCount})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filter}>
            <Text style={styles.filterText}>Done ({donePickupsCount})</Text>
          </TouchableOpacity>
        </View>

        {/* CARDS LIST */}
        {loading ? (
          <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />
        ) : filteredPickups.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
            No pickups found. Schedule one now!
          </Text>
        ) : (
          filteredPickups.map(item => renderCard(item))
        )}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('UploadImage')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F4' },
  content: { paddingHorizontal: 18, paddingBottom: 120 },
  header: {
    backgroundColor: '#1B5E20',
    paddingTop: 60,
    paddingBottom: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    alignItems: 'center',
  },
  headerTitle: { fontSize: isDesktop ? 34 : 30, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 15, color: '#CFE8D0', marginTop: 6 },
  searchBox: {
    marginTop: -20,
    backgroundColor: '#FFF',
    borderRadius: 14,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  searchIcon: { fontSize: 24, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginBottom: 15 },
  activeFilter: { backgroundColor: '#2E7D32', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  activeFilterText: { color: '#FFF', fontWeight: '700' },
  filter: { backgroundColor: '#FFF', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#C8E6C9' },
  filterText: { color: '#888' },
  activeCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, borderLeftWidth: 6, borderLeftColor: '#FF6F00', marginBottom: 14 },
  doneCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, borderLeftWidth: 6, borderLeftColor: '#4CAF50', marginBottom: 14 },
  scheduledCard: { backgroundColor: '#FFFDF7', borderRadius: 16, padding: 15, borderLeftWidth: 6, borderLeftColor: '#FFC107', marginBottom: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  itemIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF3E0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  doneIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  scheduleIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF8E1', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  itemTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  workerText: { fontSize: 14, color: '#666', marginTop: 4 },
  trackStatus: { color: '#FF6F00', marginTop: 4, fontWeight: '600' },
  savedText: { color: '#2E7D32', marginTop: 4, fontWeight: '600' },
  scheduleDate: { color: '#FF9800', marginTop: 4, fontWeight: '600' },
  badgeActive: { backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { color: '#FF6F00', fontWeight: '700' },
  doneBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  doneBadgeText: { color: '#2E7D32', fontWeight: '700' },
  scheduleBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  scheduleBadgeText: { color: '#FF9800', fontWeight: '700' },
  cardFooter: { marginTop: 15, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#EEE', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  location: { flex: 1, fontSize: 12, color: '#888' },
  trackButton: { backgroundColor: '#FF6F00', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  trackButtonText: { color: '#FFF', fontWeight: '700' },
  certificateBtn: { backgroundColor: '#E8F5E9', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  certificateText: { color: '#2E7D32', fontWeight: '700' },
  cancelBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#EF5350' },
  cancelText: { color: '#EF5350', fontWeight: '700' },
  fab: { position: 'absolute', bottom: 25, alignSelf: 'center', width: 72, height: 72, borderRadius: 36, backgroundColor: '#2E7D32', justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8 },
  fabText: { fontSize: 34, color: '#FFF', fontWeight: '700' },
});
