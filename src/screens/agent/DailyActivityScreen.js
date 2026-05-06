import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Title, Text, TextInput, Button, Card, RadioButton, Checkbox, IconButton } from 'react-native-paper';
import apiClient from '../../api/client';

const DailyActivityScreen = ({ navigation }) => {
    const [visits, setVisits] = useState('');
    const [type, setType] = useState('field');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!visits || !summary) {
            return Alert.alert('Error', 'Please fill in all mandatory fields.');
        }
        setLoading(true);
        try {
            await apiClient.post('/agent/daily-activity', {
                visits,
                type,
                summary,
                date: new Date().toISOString()
            });
            setLoading(false);
            Alert.alert('Success', 'Daily activity submitted successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            setLoading(false);
            console.error('Submission failed', e);
            Alert.alert('Error', 'Failed to submit report. Please try again.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Title style={styles.title}>Daily Activity Report</Title>
                <Text style={styles.subtitle}>Submit your field work summary for today</Text>
            </View>

            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.label}>Work Type</Text>
                    <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
                        <View style={styles.radioRow}>
                            <View style={styles.radioItem}>
                                <RadioButton value="field" color="#0F4C81" />
                                <Text>Field Visit</Text>
                            </View>
                            <View style={styles.radioItem}>
                                <RadioButton value="tele" color="#0F4C81" />
                                <Text>Tele-calling</Text>
                            </View>
                        </View>
                    </RadioButton.Group>

                    <TextInput
                        label="Number of Customers Visited/Called"
                        value={visits}
                        onChangeText={setVisits}
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                        activeOutlineColor="#0F4C81"
                    />

                    <TextInput
                        label="Work Summary & Key Discussions"
                        value={summary}
                        onChangeText={setSummary}
                        mode="outlined"
                        multiline
                        numberOfLines={5}
                        style={styles.textArea}
                        activeOutlineColor="#0F4C81"
                    />

                    <Text style={styles.label}>Achievements Today</Text>
                    <View style={styles.checkRow}>
                        <Checkbox.Item label="New Lead Generated" status="unchecked" color="#0F4C81" />
                        <Checkbox.Item label="Tie-up Follow-up" status="unchecked" color="#0F4C81" />
                        <Checkbox.Item label="Document Collection" status="unchecked" color="#0F4C81" />
                    </View>

                    <Button 
                        mode="contained" 
                        onPress={handleSubmit} 
                        style={styles.submitBtn}
                        buttonColor="#0F4C81"
                        loading={loading}
                        disabled={loading}
                    >
                        Submit Report
                    </Button>
                </Card.Content>
            </Card>

            <View style={styles.infoCard}>
                <IconButton icon="information-outline" iconColor="#666" size={20} />
                <Text style={styles.infoText}>
                    Reports must be submitted before 9:00 PM every day for performance tracking.
                </Text>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFF', padding: 20 },
    header: { marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    subtitle: { fontSize: 13, color: '#666', marginTop: 4 },
    card: { backgroundColor: 'white', borderRadius: 15, elevation: 2 },
    label: { fontSize: 15, fontWeight: 'bold', color: '#333', marginTop: 10, marginBottom: 5 },
    radioRow: { flexDirection: 'row', marginBottom: 15 },
    radioItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
    input: { marginBottom: 15, backgroundColor: 'white' },
    textArea: { marginBottom: 20, backgroundColor: 'white', minHeight: 100 },
    checkRow: { marginBottom: 20 },
    submitBtn: { borderRadius: 10, paddingVertical: 5 },
    infoCard: { flexDirection: 'row', alignItems: 'center', marginTop: 25, backgroundColor: '#E1F5FE', borderRadius: 10, paddingRight: 20 },
    infoText: { flex: 1, fontSize: 12, color: '#01579B', lineHeight: 18 }
});

export default DailyActivityScreen;
