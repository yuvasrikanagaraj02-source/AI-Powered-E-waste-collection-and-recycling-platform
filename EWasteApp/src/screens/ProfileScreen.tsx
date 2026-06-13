import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

export default function ProfileScreen({ navigation }: any) {
  const { userName, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.userName}>{userName || 'Eco Warrior'}</Text>
          <Text style={styles.userRole}>Level: Silver Recycler</Text>
        </View>

        {/* SETTINGS MENU */}
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuText}>Preferences</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔒</Text>
          <Text style={styles.menuText}>Privacy & Security</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>💬</Text>
          <Text style={styles.menuText}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { marginTop: 30 }]} onPress={handleLogout}>
          <Text style={styles.menuIcon}>🚪</Text>
          <Text style={[styles.menuText, { color: '#E53935', fontWeight: '700' }]}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
         <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navText}>Home</Text>
         </TouchableOpacity>

         <TouchableOpacity onPress={() => navigation.navigate('MyPickups')}>
            <Text style={styles.navIcon}>📋</Text>
            <Text style={styles.navText}>Pickups</Text>
         </TouchableOpacity>

         <TouchableOpacity onPress={() => navigation.navigate('Rewards')}>
            <Text style={styles.navIcon}>🎁</Text>
            <Text style={styles.navText}>Rewards</Text>
         </TouchableOpacity>

         <TouchableOpacity>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navActive}>Profile</Text>
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
  content: {
    paddingHorizontal: 18,
    paddingBottom: 40,
    alignSelf: 'center',
    width: '100%',
    maxWidth: isDesktop ? 600 : '100%',
  },
  header: {
    backgroundColor: '#1B5E20',
    paddingTop: 60,
    paddingBottom: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: isDesktop ? 34 : 30,
    fontWeight: '800',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#CFE8D0',
    marginTop: 6,
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginTop: -20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 5,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  menuItem: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 12,
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
