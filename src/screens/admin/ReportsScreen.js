import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Text, Button, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ReportsScreen = () => {
    const reportOptions = [
        { id: 1, title: 'Agent Performance', desc: 'Detailed report of tasks and tie-ups completed by agents.', icon: 'account-star' },
        { id: 2, title: 'Revenue & Payments', desc: 'Summary of joining fees and pending dues.', icon: 'currency-inr' },
        { id: 3, title: 'Service Tie-up Summary', desc: 'Analysis of approved vs pending tie-ups by region.', icon: 'store' }
    ];

    return (
        <View style={styles.container}>
            <Title style={styles.pageTitle}>Reports & Analytics</Title>
            
            <ScrollView>
                <Card style={styles.summaryCard}>
                    <Card.Content>
                        <Title style={{ color: '#FFF' }}>Monthly Overview</Title>
                        <Divider style={{ marginVertical: 10, backgroundColor: 'rgba(255,255,255,0.3)' }} />
                        <View style={styles.row}>
                            <View>
                                <Text style={styles.statLabel}>Total Earnings</Text>
                                <Text style={styles.statValue}>₹ 1,50,000</Text>
                            </View>
                            <View>
                                <Text style={styles.statLabel}>New Agents</Text>
                                <Text style={styles.statValue}>+24</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                <Title style={styles.sectionTitle}>Generate Reports</Title>
                
                {reportOptions.map(option => (
                    <Card key={option.id} style={styles.reportCard}>
                        <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.iconBox}>
                                <MaterialCommunityIcons name={option.icon} size={28} color="#FFA500" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 15 }}>
                                <Text style={styles.reportTitle}>{option.title}</Text>
                                <Text style={styles.reportDesc}>{option.desc}</Text>
                            </View>
                        </Card.Content>
                        <Card.Actions style={{ paddingTop: 0 }}>
                            <Button icon="download" textColor="#0A66C2" onPress={() => {}}>Download PDF</Button>
                        </Card.Actions>
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', padding: 15 },
    pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#0A66C2', marginBottom: 15 },
    summaryCard: { backgroundColor: '#0A66C2', borderRadius: 12, marginBottom: 20, elevation: 4 },
    statLabel: { color: '#E0E0E0', fontSize: 12 },
    statValue: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    reportCard: { backgroundColor: '#FFF', marginBottom: 12, borderRadius: 10, elevation: 2 },
    iconBox: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF3E0', justifyContent: 'center', alignItems: 'center' },
    reportTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    reportDesc: { fontSize: 12, color: '#666', marginTop: 2 }
});

export default ReportsScreen;
