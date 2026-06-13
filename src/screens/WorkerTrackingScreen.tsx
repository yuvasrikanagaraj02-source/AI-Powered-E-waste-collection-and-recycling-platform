import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { updatePickupRequestStatus } from '../services/apiClient';

const { width } = Dimensions.get('window');

export default function WorkerTrackingScreen({ route, navigation }: any) {
  const { pickup } = route.params || {};

  const status = pickup?.status || 'Pending';
  const itemName = pickup?.itemName || 'Your E-Waste';
  const points = pickup?.points || 0;

  // Derive step states based on status
  const isBookedDone = true;
  const isAssignedDone = status === 'Scheduled' || status === 'Completed' || status === 'Collected';
  const isAssignedActive = status === 'Pending';
  
  const isOnWayDone = status === 'Completed' || status === 'Collected';
  const isOnWayActive = status === 'Scheduled';

  const isCollectedDone = status === 'Completed' || status === 'Collected';

  const handleCancel = async () => {
    if (!pickup?.id) return;
    Alert.alert(
      "Cancel Pickup",
      "Are you sure you want to cancel this pickup request?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive",
          onPress: async () => {
             try {
               await updatePickupRequestStatus(pickup.id, 'Cancelled');
               navigation.navigate('MyPickups');
             } catch (e: any) {
               Alert.alert("Error", "Could not cancel pickup");
             }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{position: 'absolute', left: 20, top: 18, zIndex: 10}}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Pickup Status</Text>

          {status !== 'Completed' && status !== 'Collected' && status !== 'Cancelled' && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>

        {/* MAP SECTION */}
        <View style={styles.mapContainer}>
          <View style={styles.fakeMap}>
            {status !== 'Completed' && status !== 'Collected' && status !== 'Cancelled' && (
              <>
                <View style={styles.routeLine} />
                <View style={styles.workerPin} />
                <View style={styles.etaCard}>
                  <Text style={styles.etaTitle}>{status === 'Pending' ? 'Searching...' : 'Estimated Arrival'}</Text>
                  <Text style={styles.etaTime}>{status === 'Pending' ? '--' : '12 mins away'}</Text>
                </View>
              </>
            )}

            <View style={styles.homePin}>
              <View style={styles.homeInner} />
            </View>
            <Text style={styles.homeLabel}>{pickup?.address || 'Your home'}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* WORKER CARD */}
          <View style={styles.workerCard}>
            <Text style={styles.sectionTitle}>Assigned Worker for {itemName}</Text>

            <View style={styles.workerRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>{status === 'Pending' ? '⏳' : '👷'}</Text>
              </View>

              <View style={styles.workerInfo}>
                <Text style={styles.workerName}>
                  {status === 'Pending' ? 'Finding a worker...' : 'Ramesh Kumar'}
                </Text>

                <Text style={styles.rating}>
                  {status === 'Pending' ? 'Please wait a moment' : '⭐ 4.8 • 132 pickups completed'}
                </Text>

                <Text style={styles.vehicle}>
                  {status === 'Pending' ? '' : 'Vehicle: TN 33 AB 4567'}
                </Text>
              </View>
            </View>

            {/* ACTION BUTTONS */}
            {status !== 'Pending' && status !== 'Completed' && status !== 'Collected' && status !== 'Cancelled' && (
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.chatBtn}>
                  <Text style={styles.chatText}>💬 Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.callBtn}>
                  <Text style={styles.callText}>📞 Call</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.reportBtn}>
                  <Text style={styles.reportText}>⚠ Report</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* STEP TRACKER */}
          <View style={styles.trackerCard}>
            <View style={styles.progressLine} />

            <View style={styles.stepsRow}>

              <View style={styles.step}>
                <View style={isBookedDone ? styles.doneCircle : styles.pendingCircle}>
                  <Text style={styles.tick}>✓</Text>
                </View>
                <Text style={isBookedDone ? styles.stepDone : styles.pendingStepText}>Booked</Text>
              </View>

              <View style={styles.step}>
                <View style={isAssignedDone ? styles.doneCircle : (isAssignedActive ? styles.activeCircle : styles.pendingCircle)}>
                  {isAssignedDone ? <Text style={styles.tick}>✓</Text> : <Text style={styles.activeNumber}>2</Text>}
                </View>
                <Text style={isAssignedDone ? styles.stepDone : (isAssignedActive ? styles.activeStepText : styles.pendingStepText)}>Assigned</Text>
              </View>

              <View style={styles.step}>
                <View style={isOnWayDone ? styles.doneCircle : (isOnWayActive ? styles.activeCircle : styles.pendingCircle)}>
                  {isOnWayDone ? <Text style={styles.tick}>✓</Text> : <Text style={isOnWayActive ? styles.activeNumber : styles.pendingNumber}>3</Text>}
                </View>
                <Text style={isOnWayDone ? styles.stepDone : (isOnWayActive ? styles.activeStepText : styles.pendingStepText)}>On Way</Text>
              </View>

              <TouchableOpacity style={styles.step} onPress={() => navigation.navigate('ConfirmCollection', { pickup })}>
                <View style={isCollectedDone ? styles.doneCircle : styles.pendingCircle}>
                  {isCollectedDone ? <Text style={styles.tick}>✓</Text> : <Text style={styles.pendingNumber}>4</Text>}
                </View>
                <Text style={isCollectedDone ? styles.stepDone : styles.pendingStepText}>Collected</Text>
              </TouchableOpacity>

            </View>
          </View>

          {/* WORKER ARRIVED BUTTON (For Demo/Continuity) */}
          {(status === 'Scheduled' || status === 'Pending') && (
            <TouchableOpacity 
              style={[styles.cancelBtn, { borderColor: '#2E7D32', backgroundColor: '#2E7D32', marginBottom: 15 }]} 
              onPress={() => navigation.navigate('ConfirmCollection', { pickup })}
            >
              <Text style={[styles.cancelText, { color: '#FFF' }]}>
                Worker Arrived? Enter OTP
              </Text>
            </TouchableOpacity>
          )}

          {/* CANCEL BUTTON */}
          {status !== 'Completed' && status !== 'Collected' && status !== 'Cancelled' && (
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelText}>
                Cancel Pickup Request
              </Text>
            </TouchableOpacity>
          )}

          {isCollectedDone && (
            <TouchableOpacity 
              style={[styles.cancelBtn, { borderColor: '#4CAF50', backgroundColor: '#E8F5E9' }]} 
              onPress={() => navigation.navigate('Certificate', { item: itemName, points: points, id: pickup?.id })}
            >
              <Text style={[styles.cancelText, { color: '#2E7D32' }]}>
                View Certificate →
              </Text>
            </TouchableOpacity>
          )}

        </ScrollView>

        {/* BOTTOM NAV */}
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

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
  },
  wrapper: {
    width: '100%',
    maxWidth: 500,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#ff6f00',
    paddingTop: 15,
    paddingBottom: 18,
    alignItems: 'center',
    position: 'relative'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 15,
  },
  liveBadge: {
    flexDirection: 'row',
    backgroundColor: '#e65100',
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#ff1744',
    marginRight: 8,
  },
  liveText: {
    color: '#fff',
    fontWeight: '700',
  },
  mapContainer: {
    height: 270,
  },
  fakeMap: {
    flex: 1,
    backgroundColor: '#dfe8d9',
    position: 'relative',
  },
  routeLine: {
    position: 'absolute',
    width: 180,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ff6f00',
    transform: [{ rotate: '-28deg' }],
    top: 120,
    left: 65,
  },
  homePin: {
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: '#2e7d32',
    position: 'absolute',
    top: 60,
    left: width / 2 - 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeInner: {
    width: 12,
    height: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  homeLabel: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    color: '#2e7d32',
    fontWeight: '700',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  workerPin: {
    width: 22,
    height: 22,
    borderRadius: 15,
    backgroundColor: '#ff6f00',
    position: 'absolute',
    left: 60,
    bottom: 60,
  },
  etaCard: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    backgroundColor: '#fff',
    width: 160,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffb74d',
    padding: 10,
    alignItems: 'center',
  },
  etaTitle: {
    color: '#ff7043',
    fontSize: 12,
  },
  etaTime: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ff6f00',
  },
  workerCard: {
    backgroundColor: '#fff',
    padding: 18,
  },
  sectionTitle: {
    color: '#777',
    marginBottom: 12,
  },
  workerRow: {
    flexDirection: 'row',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#dcedc8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  workerInfo: {
    marginLeft: 14,
    flex: 1,
  },
  workerName: {
    fontSize: 22,
    fontWeight: '700',
  },
  rating: {
    color: '#43a047',
    marginTop: 4,
  },
  vehicle: {
    color: '#777',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  chatBtn: {
    borderWidth: 1,
    borderColor: '#4caf50',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  callBtn: {
    borderWidth: 1,
    borderColor: '#4caf50',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  reportBtn: {
    borderWidth: 1,
    borderColor: '#ff9800',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  chatText: { color: '#2e7d32' },
  callText: { color: '#2e7d32' },
  reportText: { color: '#ff9800' },
  trackerCard: {
    backgroundColor: '#fff',
    padding: 25,
    position: 'relative'
  },
  progressLine: {
    height: 4,
    backgroundColor: '#ff6f00',
    position: 'absolute',
    top: 42,
    left: 55,
    right: 55,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  step: {
    alignItems: 'center',
  },
  doneCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6f00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tick: { color: '#fff', fontWeight: '700' },
  activeNumber: { color: '#fff', fontWeight: '700' },
  pendingNumber: { color: '#888' },
  stepDone: {
    color: '#4caf50',
    marginTop: 6,
    fontSize: 12,
  },
  activeStepText: {
    color: '#ff6f00',
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
  },
  pendingStepText: {
    color: '#999',
    marginTop: 6,
    fontSize: 12,
  },
  cancelBtn: {
    margin: 20,
    borderWidth: 1,
    borderColor: '#ff8a80',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelText: {
    color: '#e53935',
    fontWeight: '600',
  },
  bottomNav: {
    height: 65,
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 28,
  },
});
