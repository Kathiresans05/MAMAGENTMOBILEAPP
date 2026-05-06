import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { Title, Text, List, Card, Divider, Surface, Button, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
    const [isPushEnabled, setIsPushEnabled] = useState(true);
    const [isEmailEnabled, setIsEmailEnabled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const push = await AsyncStorage.getItem('push_enabled');
            const email = await AsyncStorage.getItem('email_enabled');
            const dark = await AsyncStorage.getItem('dark_mode');
            const bio = await AsyncStorage.getItem('biometric_enabled');

            if (push !== null) setIsPushEnabled(JSON.parse(push));
            if (email !== null) setIsEmailEnabled(JSON.parse(email));
            if (dark !== null) setIsDarkMode(JSON.parse(dark));
            if (bio !== null) setIsBiometricEnabled(JSON.parse(bio));
        } catch (e) {
            console.error('Failed to load settings', e);
        } finally {
            setLoading(false);
        }
    };

    const toggleSetting = async (key, value, setter) => {
        try {
            setter(value);
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Failed to save ${key}`, e);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color="#0F4C81" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Title style={styles.title}>Settings</Title>
                <Text style={styles.subtitle}>Manage your account preferences</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                <Card style={styles.card} elevation={1}>
                    <List.Item
                        title="Push Notifications"
                        description="Receive alerts for tasks and payments"
                        right={() => <Switch value={isPushEnabled} onValueChange={(v) => toggleSetting('push_enabled', v, setIsPushEnabled)} color="#0F4C81" />}
                    />
                    <Divider />
                    <List.Item
                        title="Email Updates"
                        description="Periodic reports and news"
                        right={() => <Switch value={isEmailEnabled} onValueChange={(v) => toggleSetting('email_enabled', v, setIsEmailEnabled)} color="#0F4C81" />}
                    />
                </Card>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>App Preferences</Text>
                <Card style={styles.card} elevation={1}>
                    <List.Item
                        title="Dark Mode"
                        description="Easier on the eyes in the dark"
                        right={() => <Switch value={isDarkMode} onValueChange={(v) => toggleSetting('dark_mode', v, setIsDarkMode)} color="#0F4C81" />}
                    />
                    <Divider />
                    <List.Item
                        title="Language"
                        description="English (India)"
                        onPress={() => {}}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                    />
                </Card>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Security</Text>
                <Card style={styles.card} elevation={1}>
                    <List.Item
                        title="Biometric Login"
                        description="Use Fingerprint or FaceID"
                        right={() => <Switch value={isBiometricEnabled} onValueChange={(v) => toggleSetting('biometric_enabled', v, setIsBiometricEnabled)} color="#0F4C81" />}
                    />
                    <Divider />
                    <List.Item
                        title="Change Password"
                        onPress={() => {}}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                    />
                </Card>
            </View>

            <Button 
                mode="outlined" 
                textColor="#E91E63" 
                style={styles.deleteBtn}
                onPress={() => {}}
            >
                Delete Account
            </Button>

            <Text style={styles.version}>Version 1.0.4 (Build 42)</Text>
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFF', padding: 20 },
    header: { marginBottom: 25 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    subtitle: { fontSize: 13, color: '#666', marginTop: 4 },
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F4C81', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
    card: { backgroundColor: 'white', borderRadius: 15, overflow: 'hidden' },
    deleteBtn: { marginTop: 10, borderColor: '#FFEBEE', borderRadius: 12 },
    version: { textAlign: 'center', color: '#999', fontSize: 11, marginTop: 30 }
});

export default SettingsScreen;
