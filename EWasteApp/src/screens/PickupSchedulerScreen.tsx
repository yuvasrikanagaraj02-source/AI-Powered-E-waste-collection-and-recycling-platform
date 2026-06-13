import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    TextInput,
} from 'react-native';

import { schedulePickup } from '../services/apiClient';

const { width } = Dimensions.get('window');

const isDesktop = width > 900;
const isTablet = width > 600;

export default function PickupSchedulerScreen({ route, navigation }: any) {
    const { pickupId } = route.params || {};
    const [selectedDate, setSelectedDate] = useState('24 May 2025');
    const [selectedSlot, setSelectedSlot] = useState('10AM-12PM');
    const [address, setAddress] = useState('12, Green Street, Singanallur, Coimbatore');
    const [loading, setLoading] = useState(false);

    const slots = [
        '10AM-12PM',
        '12PM-2PM',
        '2PM-4PM',
    ];

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >

            {/* Header */}

            <View style={styles.header}>
                <Text style={styles.back} onPress={() => navigation.goBack()}>← Back</Text>

                <Text style={styles.title}>
                    Schedule Pickup
                </Text>

                <Text style={styles.step}>
                    Step 4 of 8
                </Text>

                <View style={styles.progressTrack}>
                    <View style={styles.progressFill} />
                </View>
            </View>

            {/* Pickup Location */}

            <Text style={styles.sectionTitle}>
                Pickup Location
            </Text>

            <View style={styles.mapCard}>

                <View style={styles.streetHorizontal} />
                <View style={styles.streetHorizontal2} />
                <View style={styles.streetVertical} />
                <View style={styles.streetVertical2} />

                <View style={styles.building1} />
                <View style={styles.building2} />
                <View style={styles.building3} />
                <View style={styles.building4} />

                <View style={styles.workerPin}>
                    <Text style={styles.workerText}>W</Text>
                </View>

                <View style={styles.workerPin2}>
                    <Text style={styles.workerText}>W</Text>
                </View>

                <View style={styles.userLocation}>
                    <View style={styles.userInner} />
                </View>

                <View style={styles.zoomControls}>
                    <TouchableOpacity style={styles.zoomBtn}>
                        <Text>+</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.zoomBtn}>
                        <Text>-</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.locationTag}>
                    <Text style={styles.locationTagText}>
                        📍 12, Green Street, Singanallur
                    </Text>
                </View>

            </View>

            {/* Address */}

            <Text style={styles.sectionTitle}>
                Pickup Address
            </Text>

            <View style={styles.addressContainer}>
                <TextInput
                    value={address}
                    onChangeText={setAddress}
                    style={styles.addressInput}
                />

                <TouchableOpacity style={styles.editBtn}>
                    <Text>✎</Text>
                </TouchableOpacity>
            </View>

            {/* Date */}

            <Text style={styles.sectionTitle}>
                Select Date
            </Text>

            <View style={styles.calendarCard}>

                <View style={styles.monthRow}>
                    <Text style={styles.monthArrow}>← May 2025</Text>

                    <Text style={styles.monthCurrent}>
                        May 2025
                    </Text>

                    <Text style={styles.monthArrow}>June →</Text>
                </View>

                <View style={styles.weekRow}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                        <Text key={index} style={styles.dayText}>
                            {day}
                        </Text>
                    ))}
                </View>

                <View style={styles.dateRow}>
                    <Text style={styles.date}>22</Text>
                    <Text style={styles.date}>23</Text>

                    <View style={styles.selectedDate}>
                        <Text style={styles.selectedDateText}>
                            24
                        </Text>
                    </View>

                    <Text style={styles.date}>25</Text>
                    <Text style={styles.date}>26</Text>
                    <Text style={styles.dateDisabled}>27</Text>
                    <Text style={styles.dateDisabled}>28</Text>
                </View>

                <Text style={styles.selectedLabel}>
                    Selected: 24 May 2025
                </Text>

            </View>

            {/* Time Slots */}

            <Text style={styles.sectionTitle}>
                Preferred Time Slot
            </Text>

            <View style={styles.slotRow}>
                {slots.map(slot => (
                    <TouchableOpacity
                        key={slot}
                        style={[
                            styles.slot,
                            selectedSlot === slot &&
                            styles.slotActive
                        ]}
                        onPress={() => setSelectedSlot(slot)}
                    >
                        <Text
                            style={[
                                styles.slotText,
                                selectedSlot === slot &&
                                styles.slotTextActive
                            ]}
                        >
                            {slot}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Worker Badge */}

            <View style={styles.workerBadge}>
                <Text style={styles.workerTitle}>
                    2 workers available near you
                </Text>

                <Text style={styles.workerNames}>
                    Ramesh Kumar ⭐ 4.8 | Suresh S. ⭐ 4.6
                </Text>
            </View>

            {/* Button */}

            <TouchableOpacity
                style={[styles.confirmButton, loading && { opacity: 0.7 }]}
                disabled={loading}
                onPress={async () => {
                    if (!pickupId) {
                        alert("No active pickup ID found. Please try again.");
                        return;
                    }
                    try {
                        setLoading(true);
                        await schedulePickup(pickupId, selectedDate, selectedSlot, address);
                        navigation.navigate('MyPickups');
                    } catch (error: any) {
                        alert(error.message || "Failed to schedule pickup");
                    } finally {
                        setLoading(false);
                    }
                }}
            >
                <Text style={styles.confirmText}>
                    {loading ? 'Scheduling...' : 'Confirm Pickup Request →'}
                </Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F5F6F3'
    },

    content: {
        paddingBottom: 40,
        alignSelf: 'center',
        width: '100%',
        maxWidth: isDesktop ? 900 : 500
    },

    header: {
        backgroundColor: '#15651D',
        paddingTop: 55,
        paddingBottom: 20,
        paddingHorizontal: 20
    },

    back: {
        color: '#FFF',
        fontSize: 14
    },

    title: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 10
    },

    step: {
        color: '#FFF',
        textAlign: 'center',
        marginTop: 5
    },

    progressTrack: {
        height: 5,
        backgroundColor: '#DCE8D9',
        borderRadius: 20,
        marginTop: 15
    },

    progressFill: {
        width: '50%',
        height: '100%',
        backgroundColor: '#65C26B'
    },

    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#246D2D',
        marginHorizontal: 20,
        marginTop: 18,
        marginBottom: 10
    },

    mapCard: {
        height: 250,
        marginHorizontal: 20,
        backgroundColor: '#E8F0E6',
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative'
    },

    streetHorizontal: {
        position: 'absolute',
        height: 12,
        width: '100%',
        backgroundColor: '#DDE7DB',
        top: 80
    },

    streetHorizontal2: {
        position: 'absolute',
        height: 12,
        width: '100%',
        backgroundColor: '#DDE7DB',
        top: 140
    },

    streetVertical: {
        position: 'absolute',
        width: 12,
        height: '100%',
        backgroundColor: '#DDE7DB',
        left: 180
    },

    streetVertical2: {
        position: 'absolute',
        width: 12,
        height: '100%',
        backgroundColor: '#DDE7DB',
        left: 260
    },

    building1: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 70,
        height: 50,
        backgroundColor: '#BFD1BB',
        borderRadius: 6
    },

    building2: {
        position: 'absolute',
        top: 20,
        left: 140,
        width: 40,
        height: 50,
        backgroundColor: '#BFD1BB'
    },

    building3: {
        position: 'absolute',
        top: 20,
        right: 40,
        width: 50,
        height: 50,
        backgroundColor: '#BFD1BB'
    },

    building4: {
        position: 'absolute',
        bottom: 30,
        right: 40,
        width: 70,
        height: 50,
        backgroundColor: '#BFD1BB'
    },

    userLocation: {
        position: 'absolute',
        top: 90,
        left: '50%',
        marginLeft: -20,
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FFF5'
    },

    userInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#2E7D32'
    },

    workerPin: {
        position: 'absolute',
        top: 40,
        right: 70,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FF7043',
        justifyContent: 'center',
        alignItems: 'center'
    },

    workerPin2: {
        position: 'absolute',
        bottom: 50,
        left: 100,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FF7043',
        justifyContent: 'center',
        alignItems: 'center'
    },

    workerText: {
        color: '#FFF',
        fontWeight: '700'
    },

    zoomControls: {
        position: 'absolute',
        top: 10,
        right: 10
    },

    zoomBtn: {
        width: 28,
        height: 28,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderRadius: 6
    },

    locationTag: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10
    },

    locationTagText: {
        fontSize: 12
    },

    addressContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        borderWidth: 2,
        borderColor: '#4CAF50',
        borderRadius: 15,
        overflow: 'hidden'
    },

    addressInput: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFF'
    },

    editBtn: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEF7EE'
    },

    calendarCard: {
        marginHorizontal: 20,
        backgroundColor: '#EFF7EF',
        borderRadius: 18,
        padding: 15
    },

    monthRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    monthCurrent: {
        fontWeight: '700',
        color: '#2E7D32'
    },

    monthArrow: {
        color: '#2E7D32'
    },

    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    },

    dayText: {
        color: '#999'
    },

    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    },

    date: {
        fontSize: 16
    },

    dateDisabled: {
        color: '#CCC'
    },

    selectedDate: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2E7D32',
        justifyContent: 'center',
        alignItems: 'center'
    },

    selectedDateText: {
        color: '#FFF',
        fontWeight: '700'
    },

    selectedLabel: {
        marginTop: 15,
        textAlign: 'center',
        color: '#2E7D32'
    },

    slotRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20
    },

    slot: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#D8E5D5',
        alignItems: 'center'
    },

    slotActive: {
        backgroundColor: '#2E7D32'
    },

    slotText: {
        color: '#666'
    },

    slotTextActive: {
        color: '#FFF'
    },

    workerBadge: {
        margin: 20,
        backgroundColor: '#EEF7E8',
        padding: 16,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#B7D7A8'
    },

    workerTitle: {
        fontWeight: '700',
        color: '#2E7D32'
    },

    workerNames: {
        marginTop: 5,
        color: '#666'
    },

    confirmButton: {
        backgroundColor: '#2E7D32',
        marginHorizontal: 20,
        marginTop: 10,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center'
    },

    confirmText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 18
    }

});
