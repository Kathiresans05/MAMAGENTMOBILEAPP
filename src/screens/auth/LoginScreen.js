import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Title, Text, IconButton, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isBioEnabled, setIsBioEnabled] = useState(false);
    const [checkingBio, setCheckingBio] = useState(true);
    const { login } = useAuth();

    useEffect(() => {
        checkBiometricSettings();
    }, []);

    const checkBiometricSettings = async () => {
        try {
            const enabled = await AsyncStorage.getItem('biometric_enabled');
            if (enabled === 'true') {
                setIsBioEnabled(true);
                // Automatically trigger bio login if enabled
                handleBiometricLogin();
            }
        } catch (e) {
            console.error('Error checking bio settings', e);
        } finally {
            setCheckingBio(false);
        }
    };

    const handleBiometricLogin = async () => {
        const rnBiometrics = new ReactNativeBiometrics();
        
        try {
            const { available } = await rnBiometrics.isSensorAvailable();
            
            if (available) {
                const { success } = await rnBiometrics.simplePrompt({
                    promptMessage: 'Confirm fingerprint/FaceID to login'
                });

                if (success) {
                    // In a real app, you'd use a stored token. 
                    // For this demo, we'll login with a default account if bio succeeds
                    const savedEmail = await AsyncStorage.getItem('user_email');
                    if (savedEmail) {
                        // Simulate login with stored credentials or token
                        await login(savedEmail, 'password123'); // Demo fallback
                    } else {
                        Alert.alert('Setup Required', 'Please login with password once to enable biometric login.');
                    }
                }
            } else {
                console.log('Biometrics not available');
            }
        } catch (error) {
            console.error('Biometric error', error);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) return Alert.alert('Error', 'Please fill all fields');
        try {
            await login(email.trim(), password);
            // Save email for future biometric login
            await AsyncStorage.setItem('user_email', email.trim());
        } catch (e) {
            const msg = e.response?.data?.msg || 'Network Error - Check your connection';
            Alert.alert('Login Failed', msg);
        }
    };

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Agent Management</Title>
            <Text style={styles.subtitle}>Enter your credentials to continue</Text>
            
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                mode="outlined"
                activeOutlineColor="#0A66C2"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                mode="outlined"
                activeOutlineColor="#0A66C2"
            />
            
            <View style={styles.buttonRow}>
                <Button 
                    mode="contained" 
                    onPress={handleLogin} 
                    style={[styles.button, isBioEnabled && { flex: 1 }]}
                    buttonColor="#0A66C2"
                >
                    Login
                </Button>
                
                {isBioEnabled && (
                    <IconButton 
                        icon="fingerprint" 
                        mode="contained"
                        containerColor="#E3F2FD"
                        iconColor="#0A66C2"
                        size={30}
                        onPress={handleBiometricLogin}
                        style={styles.bioButton}
                    />
                )}
            </View>

            <Button 
                mode="text" 
                onPress={() => navigation.navigate('Register')} 
                textColor="#0A66C2"
                style={{ marginTop: 10 }}
            >
                Don't have an account? Register
            </Button>
            
            <Text style={styles.footer}>Forge India Connect Pvt. Ltd</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#FFFFFF' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#0A66C2', textAlign: 'center' },
    subtitle: { textAlign: 'center', marginBottom: 30, color: '#666' },
    input: { marginBottom: 15 },
    buttonRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    button: { paddingVertical: 5 },
    bioButton: { marginLeft: 10, borderRadius: 12 },
    footer: { textAlign: 'center', marginTop: 20, color: '#999' }
});

export default LoginScreen;
