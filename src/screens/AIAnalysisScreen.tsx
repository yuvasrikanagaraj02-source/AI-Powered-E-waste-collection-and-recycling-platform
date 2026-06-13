import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { colors, spacing, typography } from '../theme';

export default function AIAnalysisScreen({ route, navigation }: any) {
  const { imageUri, description, aiResult, alreadyAnalyzed, pickupId } = route.params || {};

  // Since we moved the AI logic to the backend via Express, this screen now just receives 
  // the fully completed AI result from UploadImageScreen and displays it instantly!

  const analyzing = !alreadyAnalyzed;
  const detectedItem = aiResult?.itemName || 'Unknown Item';
  const confidence = aiResult?.confidence || 0; 
  const analysisResult = aiResult || null;

  if (analyzing) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F2'}}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={{marginTop: 10, color: '#2E7D32', fontSize: 16}}>AI is analyzing your item...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.screen}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.hero}>
        <Text style={styles.statusBar}>9:41</Text>

        <View style={styles.dynamicIsland} />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.mainTitle}>AI Analysis Results</Text>
        <Text style={styles.stepText}>Step 2–3 of 8</Text>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>

      {/* IMAGE + IDENTIFICATION */}
      <View style={styles.topCards}>

        <View style={styles.photoCard}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoIcon}>💻</Text>
            </View>
          )}

          <Text style={styles.uploadedLabel}>Uploaded photo</Text>
          <Text style={styles.modelName}>{detectedItem || 'E-Waste Item'}</Text>
        </View>

        <View style={styles.identificationCard}>
          <Text style={styles.aiLabel}>AI Identified</Text>

          <Text style={styles.robot}>🤖</Text>

          <Text style={styles.itemName}>
            {detectedItem}
          </Text>

          <Text style={styles.brand}>
            {detectedItem}
          </Text>

          <Text style={styles.category}>
            Category: Computing
          </Text>

          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>
              {confidence}% Confidence
            </Text>
          </View>
        </View>

      </View>

      {/* VALUE CARD */}
      <View style={styles.valueCard}>
        <Text style={styles.sectionHeading}>
          Estimated Value
        </Text>

        <View style={styles.valueRow}>
          <View style={styles.resaleBox}>
            <Text style={styles.valueLabel}>
              Resale Value
            </Text>

            <Text style={styles.resaleValue}>
              ₹3,000–₹5,000
            </Text>
          </View>

          <View style={styles.recycleBox}>
            <Text style={styles.valueLabel}>
              Recycle Value
            </Text>

            <Text style={styles.recycleValue}>
              ₹250–₹500
            </Text>
          </View>
        </View>
      </View>

      {/* AI ADVICE */}
      <View style={styles.adviceCard}>
        <Text style={styles.adviceTitle}>
          🤖 AI Advice
        </Text>

        <Text style={styles.adviceContent}>
          {analysisResult?.recyclingAdvice ||
            'Your device can be repaired and reused. If not possible, recycling is a great option to recover valuable materials.'}
        </Text>
      </View>

      {/* ENVIRONMENT */}
      <View style={styles.impactCard}>
        <Text style={styles.impactTitle}>
          🌱 Environmental Impact
        </Text>

        <Text style={styles.impactContent}>
          {analysisResult?.environmentalImpact ||
            'Recycling saves 24 kg CO₂ and recovers copper, aluminium & plastic materials.'}
        </Text>

        <View style={styles.impactStats}>
          <View style={styles.impactChip}>
            <Text style={styles.chipText}>CO₂ Saved</Text>
          </View>

          <View style={styles.impactChip}>
            <Text style={styles.chipText}>
              Materials Recovered
            </Text>
          </View>
        </View>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.pickupButton}
          onPress={() => navigation.navigate('PickupScheduler', { pickupId })}
        >
          <Text style={styles.pickupButtonText}>
            Schedule Pickup
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dropButton}
        >
          <Text style={styles.dropButtonText}>
            Find Drop Point
          </Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navItem}>🏠{"\n"}Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('MyPickups')}>
          <Text style={styles.navItem}>📋{"\n"}Pickups</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Rewards')}>
          <Text style={styles.navItem}>🎁{"\n"}Rewards</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.navItem}>👤{"\n"}Profile</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F2',
  },

  screen: {
    paddingBottom: 40,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 500,
  },

  hero: {
    backgroundColor: '#0f5f18',
    paddingTop: 22,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },

  statusBar: {
    color: '#fff',
    fontWeight: '700',
  },

  dynamicIsland: {
    width: 100,
    height: 28,
    borderRadius: 20,
    backgroundColor: '#094610',
    alignSelf: 'center',
    marginTop: -10,
    marginBottom: 15,
  },

  backText: {
    color: '#fff',
    marginBottom: 20,
  },

  mainTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },

  stepText: {
    color: '#d8ead8',
    textAlign: 'center',
    marginTop: 5,
  },

  progressTrack: {
    height: 6,
    backgroundColor: '#b8d2b8',
    borderRadius: 20,
    marginTop: 12,
  },

  progressFill: {
    width: '42%',
    height: 6,
    backgroundColor: '#4caf50',
    borderRadius: 20,
  },

  topCards: {
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'space-between',
  },

  photoCard: {
    width: '46%',
    backgroundColor: '#f4f4f4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#b7d9b7',
    padding: 10,
  },

  identificationCard: {
    width: '50%',
    backgroundColor: '#e8f3e8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#65b86a',
    padding: 12,
    alignItems: 'center',
  },

  photo: {
    width: '100%',
    height: 100,
    borderRadius: 12,
  },

  photoPlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },

  photoIcon: {
    fontSize: 40,
  },

  uploadedLabel: {
    textAlign: 'center',
    marginTop: 8,
    color: '#777',
  },

  modelName: {
    textAlign: 'center',
    marginTop: 10,
    color: '#999',
  },

  aiLabel: {
    color: '#2e7d32',
    fontWeight: '600',
  },

  robot: {
    fontSize: 32,
    marginVertical: 6,
  },

  itemName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2e7d32',
    textAlign: 'center',
  },

  brand: {
    color: '#4caf50',
    textAlign: 'center',
    marginTop: 4,
  },

  category: {
    color: '#666',
    marginTop: 5,
  },

  confidenceBadge: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 10,
  },

  confidenceText: {
    color: '#fff',
    fontWeight: '700',
  },

  valueCard: {
    marginHorizontal: 14,
    backgroundColor: '#f3f3f3',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#b7d9b7',
    padding: 14,
  },

  sectionHeading: {
    fontWeight: '700',
    fontSize: 20,
    color: '#2e7d32',
  },

  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  resaleBox: {
    width: '46%',
    backgroundColor: '#dcefdc',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },

  recycleBox: {
    width: '46%',
    backgroundColor: '#efe6cf',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },

  valueLabel: {
    fontSize: 12,
  },

  resaleValue: {
    color: '#2e7d32',
    fontWeight: '700',
    fontSize: 18,
  },

  recycleValue: {
    color: '#ef6c00',
    fontWeight: '700',
    fontSize: 18,
  },

  adviceCard: {
    margin: 14,
    backgroundColor: '#fff2df',
    borderWidth: 1,
    borderColor: '#ffb74d',
    borderRadius: 16,
    padding: 16,
  },

  adviceTitle: {
    color: '#ef6c00',
    fontSize: 22,
    fontWeight: '700',
  },

  adviceContent: {
    marginTop: 10,
    color: '#d84315',
    lineHeight: 24,
  },

  impactCard: {
    marginHorizontal: 14,
    backgroundColor: '#dfeee0',
    borderWidth: 1,
    borderColor: '#66bb6a',
    borderRadius: 16,
    padding: 16,
  },

  impactTitle: {
    color: '#2e7d32',
    fontWeight: '700',
    fontSize: 22,
  },

  impactContent: {
    marginTop: 10,
    color: '#2e7d32',
  },

  impactStats: {
    flexDirection: 'row',
    marginTop: 10,
  },

  impactChip: {
    backgroundColor: '#b8dcb8',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 10,
  },

  chipText: {
    color: '#2e7d32',
    fontSize: 12,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 14,
  },

  pickupButton: {
    width: '46%',
    backgroundColor: '#2e7d32',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },

  dropButton: {
    width: '46%',
    borderWidth: 2,
    borderColor: '#4caf50',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },

  pickupButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  dropButtonText: {
    color: '#2e7d32',
    fontWeight: '700',
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    marginTop: 10,
  },

  navItem: {
    textAlign: 'center',
    color: '#555',
  },
});
