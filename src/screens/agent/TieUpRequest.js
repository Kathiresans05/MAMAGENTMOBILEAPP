import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Paragraph } from 'react-native-paper';
import apiClient from '../../api/client';

const TieUpRequest = ({ navigation }) => {
    const [form, setForm] = useState({
        serviceType: '',
        businessName: '',
        location: '',
    });

    const handleSubmit = async () => {
        try {
            await apiClient.post('/agent/tie-up', form);
            Alert.alert('Success', 'Request submitted for admin approval.');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Failed to submit request');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Title style={styles.title}>New Business Tie-up</Title>
            <Paragraph style={styles.subtitle}>Submit details for review</Paragraph>

            <TextInput
                label="Service Type (e.g., Hospital)"
                value={form.serviceType}
                onChangeText={t => setForm({...form, serviceType: t})}
                style={styles.input}
                mode="outlined"
            />
            <TextInput
                label="Business Name"
                value={form.businessName}
                onChangeText={t => setForm({...form, businessName: t})}
                style={styles.input}
                mode="outlined"
            />
            <TextInput
                label="Location / Address"
                value={form.location}
                onChangeText={t => setForm({...form, location: t})}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={3}
            />
            
            <Button 
                mode="contained" 
                onPress={handleSubmit} 
                style={styles.button}
                buttonColor="#0F4C81"
            >
                Submit Request
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#FFFFFF' },
    title: { color: '#0F4C81', fontWeight: 'bold' },
    subtitle: { marginBottom: 20, color: '#666' },
    input: { marginBottom: 15 },
    button: { marginTop: 10 }
});

export default TieUpRequest;
