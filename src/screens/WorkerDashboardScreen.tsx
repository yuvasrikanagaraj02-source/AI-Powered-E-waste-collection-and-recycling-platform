import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../theme';
import { getPickupRequests, updatePickupRequestStatus } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function WorkerDashboardScreen({ navigation }: any) {
  const { logout, userName } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      const data = await getPickupRequests();
      // Sort so pending ones are at the top
      data.sort((a: any, b: any) => (a.status === 'Pending' ? -1 : 1));
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const handleMarkAsCollected = (id: string) => {
    Alert.alert('Confirm Collection', 'Are you sure you want to mark this item as collected?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          try {
            await updatePickupRequestStatus(id, 'Collected');
            setRequests((prev) =>
              prev.map((req: any) =>
                req.id === id ? { ...req, status: 'Collected' } : req
              ).sort((a: any, b: any) => (a.status === 'Pending' ? -1 : 1))
            );
            Alert.alert("Success", "Request marked as collected.");
          } catch (error) {
            Alert.alert("Error", "Failed to update status.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0d47a1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.topHeader}>
        <Text style={styles.time}>9:41</Text>

        <View style={styles.dynamicIsland} />

        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>👷</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.workerName}>
              {userName || 'Worker'}
            </Text>

            <Text style={styles.workerId}>
              Worker ID: #WK-0042
            </Text>

            <Text style={styles.rating}>
              ⭐ 4.8 • 132 completed
            </Text>
          </View>

          <View style={styles.onlineToggle}>
            <Text style={styles.onlineText}>Online</Text>
            <View style={styles.toggleCircle} />
          </View>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>
            Today's Pickups
          </Text>
          <Text style={styles.blueStat}>4</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>
            Earnings Today
          </Text>
          <Text style={styles.greenStat}>₹480</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>
            Pending Requests
          </Text>
          <Text style={styles.orangeStat}>
            {requests.filter(r => r.status !== 'Collected').length}
          </Text>
        </View>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* ROUTE MAP */}
            <Text style={styles.routeTitle}>
              Today's Route
            </Text>

            <View style={styles.mapCard}>
              <View style={styles.mapGrid}>

                <View style={styles.routeVertical1}/>
                <View style={styles.routeVertical2}/>
                <View style={styles.routeVertical3}/>

                <View style={styles.routeHorizontal1}/>
                <View style={styles.routeHorizontal2}/>

                <View style={styles.routePath}/>

                <View style={[styles.stopPoint,{top:20,left:110}]}>
                  <Text style={styles.stopText}>✓</Text>
                </View>

                <View style={[styles.stopPointOrange,{top:20,right:110}]}>
                  <Text style={styles.stopText}>•</Text>
                </View>

                <View style={[styles.stopPoint,{bottom:10,left:20}]}>
                  <Text style={styles.stopText}>✓</Text>
                </View>

                <View style={[styles.stopPointGrey,{bottom:35,right:25}]}>
                  <Text style={styles.stopText}>4</Text>
                </View>

              </View>
            </View>

            <Text style={styles.pendingTitle}>
              Pending Pickups
            </Text>
          </>
        }

        renderItem={({ item, index }) => {
          const collected = item.status === 'Collected';

          return (
            <View
              style={[
                styles.pickupCard,
                index === 0 && styles.activePickupCard,
              ]}
            >
              <View style={styles.pickupHeader}>
                <Text style={styles.pickupName}>
                  {(item.userId || 'Harini')} — {item.itemName || 'Laptop'}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    collected
                      ? styles.collectedBadge
                      : styles.pendingBadge,
                  ]}
                >
                  <Text style={styles.badgeLabel}>
                    {collected ? 'Collected' : 'Pending'}
                  </Text>
                </View>
              </View>

              <Text style={styles.locationText}>
                📍 {item.location || 'Green Street'}
              </Text>

              <Text style={styles.timeText}>
                10:00 AM – 12:00 PM • 0.8 km away
              </Text>

              {!collected && (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.navigateBtn}>
                    <Text style={styles.smallBtnText}>
                      📍 Navigate
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.callBtn}>
                    <Text style={styles.smallBtnText}>
                      📞 Call User
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}

        ListFooterComponent={
          <TouchableOpacity
            style={styles.collectBtn}
            onPress={() => {
              const pending = requests.find(
                x => x.status !== 'Collected'
              );
              if (pending) {
                handleMarkAsCollected(pending.id);
              } else {
                 Alert.alert("All Done!", "There are no pending requests to collect right now.");
              }
            }}
          >
            <Text style={styles.collectBtnText}>
              Mark Current as Collected
            </Text>
          </TouchableOpacity>
        }
      />

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('WorkerOverflowDashboard')}>
          <Text style={styles.navItem}>🗺️{"\n"}Route</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('WorkerPickupRequests')}>
          <Text style={styles.navItem}>📋{"\n"}Jobs</Text>
        </TouchableOpacity>
        <Text style={styles.navItem}>💰{"\n"}Earnings</Text>
        <TouchableOpacity
          onPress={async () => {
            await logout();
            navigation.replace('Login');
          }}
        >
          <Text style={styles.navItem}>👤{"\n"}Logout</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#F5F6F3' },

topHeader:{
  backgroundColor:'#0d47a1',
  paddingTop:15,
  paddingBottom:25,
  paddingHorizontal:20,
},

time:{
  color:'#fff',
  fontWeight:'700',
},

dynamicIsland:{
  width:100,
  height:26,
  borderRadius:20,
  backgroundColor:'#123a85',
  alignSelf:'center',
  marginTop:-10,
},

profileRow:{
  flexDirection:'row',
  alignItems:'center',
  marginTop:25,
},

avatar:{
  width:55,
  height:55,
  borderRadius:28,
  backgroundColor:'#1565c0',
  justifyContent:'center',
  alignItems:'center',
},

avatarIcon:{
  fontSize:28,
},

profileInfo:{
  flex:1,
  marginLeft:15,
},

workerName:{
  color:'#fff',
  fontSize:24,
  fontWeight:'700',
},

workerId:{
  color:'#dbe8ff',
},

rating:{
  color:'#ffd54f',
},

onlineToggle:{
  flexDirection:'row',
  backgroundColor:'#4caf50',
  borderRadius:20,
  paddingHorizontal:8,
  paddingVertical:4,
  alignItems:'center',
},

onlineText:{
  color:'#fff',
  marginRight:5,
},

toggleCircle:{
  width:18,
  height:18,
  borderRadius:9,
  backgroundColor:'#fff',
},

statsRow:{
  flexDirection:'row',
  justifyContent:'space-between',
  padding:15,
},

statCard:{
  width:'31%',
  backgroundColor:'#fff',
  borderRadius:12,
  borderWidth:1,
  borderColor:'#e5e5e5',
  padding:12,
  alignItems:'center',
},

statLabel:{
  color:'#777',
  fontSize:11,
},

blueStat:{
  color:'#1565c0',
  fontSize:30,
  fontWeight:'700',
},

greenStat:{
  color:'#2e7d32',
  fontSize:30,
  fontWeight:'700',
},

orangeStat:{
  color:'#ef6c00',
  fontSize:30,
  fontWeight:'700',
},

routeTitle:{
  color:'#1565c0',
  fontSize:24,
  fontWeight:'700',
  marginHorizontal:20,
  marginBottom:10,
},

mapCard:{
  marginHorizontal:20,
  borderRadius:18,
  overflow:'hidden',
  backgroundColor:'#dfe7ef',
  height:150,
},

mapGrid:{
  flex:1,
},

routeVertical1:{
  position:'absolute',
  left:80,
  top:0,
  bottom:0,
  width:12,
  backgroundColor:'#c6d4e4',
},

routeVertical2:{
  position:'absolute',
  left:180,
  top:0,
  bottom:0,
  width:12,
  backgroundColor:'#c6d4e4',
},

routeVertical3:{
  position:'absolute',
  right:35,
  top:0,
  bottom:0,
  width:12,
  backgroundColor:'#c6d4e4',
},

routeHorizontal1:{
  position:'absolute',
  top:50,
  left:0,
  right:0,
  height:12,
  backgroundColor:'#c6d4e4',
},

routeHorizontal2:{
  position:'absolute',
  top:95,
  left:0,
  right:0,
  height:12,
  backgroundColor:'#c6d4e4',
},

routePath:{
  position:'absolute',
  left:25,
  right:35,
  top:55,
  borderWidth:2,
  borderStyle:'dashed',
  borderColor:'#1565c0',
},

stopPoint:{
  position:'absolute',
  width:22,
  height:22,
  borderRadius:11,
  backgroundColor:'#4caf50',
  justifyContent:'center',
  alignItems:'center',
},

stopPointOrange:{
  position:'absolute',
  width:22,
  height:22,
  borderRadius:11,
  backgroundColor:'#ef6c00',
  justifyContent:'center',
  alignItems:'center',
},

stopPointGrey:{
  position:'absolute',
  width:22,
  height:22,
  borderRadius:11,
  backgroundColor:'#90a4ae',
  justifyContent:'center',
  alignItems:'center',
},

stopText:{
  color:'#fff',
  fontSize:10,
},

pendingTitle:{
  marginHorizontal:20,
  marginTop:15,
  marginBottom:10,
  color:'#1565c0',
  fontWeight:'700',
  fontSize:24,
},

pickupCard:{
  backgroundColor:'#fff',
  borderRadius:15,
  padding:15,
  marginHorizontal:20,
  marginBottom:12,
  borderLeftWidth:5,
  borderLeftColor:'#4caf50',
},

activePickupCard:{
  borderColor:'#1565c0',
  borderWidth:2,
  borderLeftColor:'#ef6c00',
},

pickupHeader:{
  flexDirection:'row',
  justifyContent:'space-between',
},

pickupName:{
  fontWeight:'700',
},

statusBadge:{
  borderRadius:20,
  paddingHorizontal:10,
  paddingVertical:4,
},

pendingBadge:{
  backgroundColor:'#e8f5e9',
},

collectedBadge:{
  backgroundColor:'#4caf50',
},

badgeLabel:{
  fontSize:11,
},

locationText:{
  color:'#666',
  marginTop:5,
},

timeText:{
  color:'#999',
  marginTop:5,
},

actionRow:{
  flexDirection:'row',
  marginTop:10,
},

navigateBtn:{
  backgroundColor:'#dbe8ff',
  borderRadius:20,
  paddingHorizontal:15,
  paddingVertical:6,
  marginRight:10,
},

callBtn:{
  backgroundColor:'#dcedc8',
  borderRadius:20,
  paddingHorizontal:15,
  paddingVertical:6,
},

smallBtnText:{
  fontSize:12,
},

collectBtn:{
  margin:20,
  backgroundColor:'#1565c0',
  borderRadius:15,
  paddingVertical:18,
  alignItems:'center',
},

collectBtnText:{
  color:'#fff',
  fontWeight:'700',
  fontSize:18,
},

bottomNav:{
  flexDirection:'row',
  justifyContent:'space-around',
  paddingVertical:12,
  backgroundColor:'#fff',
  borderTopWidth:1,
  borderColor:'#eee',
},

navItem:{
  textAlign:'center',
  fontSize:13,
},

});
