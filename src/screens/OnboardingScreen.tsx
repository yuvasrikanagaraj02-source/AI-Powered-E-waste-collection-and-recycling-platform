import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.phoneFrame}>

                <TouchableOpacity
                    style={styles.skipContainer}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.skipText}>Skip →</Text>
                </TouchableOpacity>

                {/* Illustration Area */}

                <View style={styles.heroCard}>

                    <View style={styles.centerCircle} />

                    <View style={styles.phoneBody}>
                        <View style={styles.screen}>
                            <View style={styles.lineLarge} />
                            <View style={styles.lineSmall} />
                            <Text style={styles.recycleIcon}>♻️</Text>
                            <View style={styles.lineMedium} />
                        </View>
                    </View>

                    <View style={[styles.deviceBubble, styles.mobileBubble]}>
                        <Text style={styles.deviceIcon}>📱</Text>
                    </View>

                    <View style={[styles.deviceBubble, styles.laptopBubble]}>
                        <Text style={styles.deviceIcon}>💻</Text>
                    </View>

                    <View style={[styles.deviceBubble, styles.batteryBubble]}>
                        <Text style={styles.deviceIcon}>🔋</Text>
                    </View>

                    <View style={[styles.deviceBubble, styles.giftBubble]}>
                        <Text style={styles.deviceIcon}>🎁</Text>
                    </View>

                    <Text style={styles.stepText}>
                        Step 1 of 3
                    </Text>
                </View>

                {/* Content */}

                <Text style={styles.title}>
                    Recycle Smarter{"\n"}with AI
                </Text>

                <Text style={styles.description}>
                    Upload a photo of your old device.
                    {"\n"}
                    Our AI identifies it, estimates its value,
                    {"\n"}
                    and arranges doorstep pickup instantly.
                </Text>

                {/* Pagination */}

                <View style={styles.pagination}>
                    <View style={[styles.dot, styles.activeDot]} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </View>

                {/* Feature Pills */}

                <View style={styles.featureRow}>

                    <View style={styles.featurePill}>
                        <Text style={styles.featureIcon}>📷</Text>
                        <Text style={styles.featureText}>AI Vision</Text>
                    </View>

                    <View style={styles.featurePill}>
                        <Text style={styles.featureIcon}>🚚</Text>
                        <Text style={styles.featureText}>Doorstep</Text>
                    </View>

                    <View style={styles.featurePill}>
                        <Text style={styles.featureIcon}>🌱</Text>
                        <Text style={styles.featureText}>Carbon</Text>
                    </View>

                </View>

                {/* CTA */}

                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.nextText}>
                        Get Started →
                    </Text>
                </TouchableOpacity>

                {/* Login */}

                <View style={styles.signInRow}>
                    <Text style={styles.signText}>
                        Already have an account?
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        style={{ paddingLeft: 6 }}
                    >
                        <Text style={styles.signLink}>
                            Sign In
                        </Text>
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
        justifyContent: 'center',
        alignItems: 'center',
    },

    phoneFrame: {
        width: '100%',
        maxWidth: 430,
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 35,
        borderWidth: 1,
        borderColor: '#222',
        paddingHorizontal: 22,
        paddingTop: 20,
    },

    skipContainer: {
        alignSelf: 'flex-end',
    },

    skipText: {
        color: '#777',
        fontSize: 16,
    },

    heroCard: {
        marginTop: 10,
        height: 300,
        borderRadius: 22,
        backgroundColor: '#edf7ee',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },

    centerCircle: {
        width: 180,
        height: 180,
        borderRadius: 100,
        backgroundColor: '#dcebdc',
        position: 'absolute',
    },

    phoneBody: {
        width: 90,
        height: 140,
        borderRadius: 18,
        backgroundColor: '#1b6620',
        justifyContent: 'center',
        alignItems: 'center',
    },

    screen: {
        width: 70,
        height: 110,
        borderRadius: 10,
        backgroundColor: '#dcefdc',
        alignItems: 'center',
        justifyContent: 'center',
    },

    lineLarge: {
        width: 50,
        height: 12,
        borderRadius: 5,
        backgroundColor: '#9dd09d',
        marginBottom: 8,
    },

    lineSmall: {
        width: 35,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#b7ddb7',
        marginBottom: 8,
    },

    recycleIcon: {
        fontSize: 30,
        marginBottom: 8,
    },

    lineMedium: {
        width: 50,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#b7ddb7',
    },

    deviceBubble: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },

    mobileBubble: {
        left: 30,
        top: 75,
    },

    laptopBubble: {
        right: 30,
        top: 95,
    },

    batteryBubble: {
        left: 45,
        bottom: 70,
    },

    giftBubble: {
        right: 45,
        bottom: 70,
    },

    deviceIcon: {
        fontSize: 22,
    },

    stepText: {
        position: 'absolute',
        bottom: 18,
        color: '#2e7d32',
        fontSize: 14,
    },

    title: {
        marginTop: 22,
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '700',
        color: '#1b6620',
    },

    description: {
        marginTop: 20,
        textAlign: 'center',
        color: '#777',
        lineHeight: 24,
        fontSize: 15,
    },

    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: '#b7ddb7',
        marginHorizontal: 5,
    },

    activeDot: {
        backgroundColor: '#2e7d32',
    },

    featureRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 22,
    },

    featurePill: {
        backgroundColor: '#edf7ee',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },

    featureIcon: {
        marginRight: 5,
    },

    featureText: {
        color: '#2e7d32',
        fontSize: 13,
    },

    nextButton: {
        backgroundColor: '#2e7d32',
        marginTop: 22,
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: 'center',
    },

    nextText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
    },

    signInRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 18,
    },

    signText: {
        color: '#777',
    },

    signLink: {
        color: '#2e7d32',
        fontWeight: '700',
        marginLeft: 5,
    },

});
