import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    Dimensions,
    ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

export default function OTPScreen({ navigation }: any) {
    const { login } = useAuth();
    const [otp, setOtp] = useState(['8', '4', '2', '9', '', '']);
    const [timer] = useState(28);

    const inputs = useRef<Array<TextInput | null>>([]);

    const handleOtpChange = (value: string, index: number) => {
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);

        if (value && index < 5) {
            const nextInput = inputs.current[index + 1];
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation?.goBack?.()}
                >
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>

                {/* Illustration */}

                <View style={styles.heroWrapper}>
                    <View style={styles.outerCircle}>
                        <View style={styles.innerCircle}>
                            <View style={styles.phoneIcon}>
                                <Text style={styles.phoneEmoji}>📱</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Title */}

                <Text style={styles.title}>
                    OTP Verification
                </Text>

                <Text style={styles.subtitle}>
                    We sent a 6-digit code to
                </Text>

                <View style={styles.numberRow}>
                    <Text style={styles.phoneNumber}>
                        +91 98765 43210
                    </Text>

                    <TouchableOpacity>
                        <Text style={styles.editText}>
                            Edit
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* OTP Boxes */}

                <View style={styles.otpRow}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => { inputs.current[index] = ref; }}
                            style={styles.otpBox}
                            value={digit}
                            onChangeText={(text) =>
                                handleOtpChange(text, index)
                            }
                            keyboardType="number-pad"
                            maxLength={1}
                        />
                    ))}
                </View>

                {/* Timer */}

                <View style={styles.timerRow}>
                    <Text style={styles.timerLabel}>
                        Resend code in
                    </Text>

                    <Text style={styles.timerValue}>
                        0:{timer}
                    </Text>
                </View>

                {/* Verify Button */}

                <TouchableOpacity
                    style={styles.verifyButton}
                    onPress={async () => {
                        const isComplete = otp.every(digit => digit !== '');
                        if (!isComplete) {
                            return;
                        }
                        // Authenticate the user
                        await login('otp-user-123', 'OTP User', 'mock-token', false);
                        navigation?.replace?.('Home');
                    }}
                >
                    <Text style={styles.verifyText}>
                        Verify & Continue
                    </Text>
                </TouchableOpacity>

                {/* Resend */}

                <View style={styles.resendRow}>
                    <Text style={styles.resendLabel}>
                        Didn't receive the code?
                    </Text>

                    <TouchableOpacity>
                        <Text style={styles.resendText}>
                            Resend
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Keypad Mockup */}

                <View style={styles.keypad}>
                    <View style={styles.keypadRow}>
                        <Text style={styles.key}>1</Text>
                        <Text style={styles.key}>2</Text>
                        <Text style={styles.key}>3</Text>
                    </View>

                    <View style={styles.keypadRow}>
                        <Text style={styles.key}>4</Text>
                        <Text style={styles.key}>5</Text>
                        <Text style={styles.key}>6</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F3',
        alignItems: 'center',
    },

    content: {
        width: '100%',
        maxWidth: 480,
        alignSelf: 'center',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },

    backButton: {
        marginTop: 15,
        width: 40,
    },

    backArrow: {
        fontSize: 26,
        color: '#333',
    },

    heroWrapper: {
        alignItems: 'center',
        marginTop: 40,
    },

    outerCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: '#E4EFE5',
        justifyContent: 'center',
        alignItems: 'center',
    },

    innerCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#C8E0C8',
        justifyContent: 'center',
        alignItems: 'center',
    },

    phoneIcon: {
        width: 60,
        height: 60,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#26B6F6',
    },

    phoneEmoji: {
        fontSize: 28,
    },

    title: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 34,
        fontWeight: '700',
        color: '#2E7D32',
    },

    subtitle: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginTop: 12,
    },

    numberRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 6,
        alignItems: 'center',
    },

    phoneNumber: {
        color: '#2E7D32',
        fontSize: 18,
        fontWeight: '600',
    },

    editText: {
        color: '#2E7D32',
        marginLeft: 12,
        fontSize: 15,
    },

    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 28,
    },

    otpBox: {
        width: isDesktop ? 60 : 50,
        height: isDesktop ? 60 : 50,
        borderWidth: 2,
        borderColor: '#4CAF50',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 28,
        color: '#2E7D32',
        backgroundColor: '#FFF',
    },

    timerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 18,
    },

    timerLabel: {
        color: '#777',
        fontSize: 15,
    },

    timerValue: {
        color: '#FF6D00',
        marginLeft: 10,
        fontWeight: '700',
    },

    verifyButton: {
        backgroundColor: '#2E7D32',
        height: 56,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 28,
    },

    verifyText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 22,
    },

    resendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 18,
    },

    resendLabel: {
        color: '#888',
    },

    resendText: {
        color: '#AAA',
        marginLeft: 6,
    },

    keypad: {
        marginTop: 30,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },

    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 8,
    },

    key: {
        fontSize: 34,
        color: '#333',
        width: 70,
        textAlign: 'center',
    },
});
