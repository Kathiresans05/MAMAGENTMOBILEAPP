import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Card, Text, Button, Chip, ActivityIndicator, Divider, Title } from 'react-native-paper';
import apiClient from '../../api/client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TieUpRequestsScreen = () => {
    const [tieUps, setTieUps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTieUps = async () => {
        try {
            const res = await apiClient.get('/admin/tie-ups');
            setTieUps(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTieUps();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTieUps();
    };

    const handleAction = async (id, status) => {
        try {
            await apiClient.put(`/admin/tie-up/${id}`, { status });
            setTieUps(tieUps.map(t => t._id === id ? { ...t, status } : t));
        } catch (e) {
            console.log(e);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0A66C2" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Title style={styles.pageTitle}>Service Tie-Up Requests</Title>
            
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {tieUps.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>No requests found.</Text>
                ) : (
                    tieUps.map((tie, index) => (
                        <Card key={tie._id || index} style={styles.requestCard}>
                            <Card.Content>
                                <View style={styles.cardHeader}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <MaterialCommunityIcons name="store" size={24} color="#FFA500" style={{ marginRight: 8 }} />
                                        <Text style={styles.businessName}>{tie.businessName}</Text>
                                    </View>
                                    <Chip 
                                        textStyle={{ fontSize: 10, color: tie.status === 'approved' ? '#2E7D32' : tie.status === 'rejected' ? '#C62828' : '#F57C00' }}
                                        style={{ backgroundColor: tie.status === 'approved' ? '#E8F5E9' : tie.status === 'rejected' ? '#FFEBEE' : '#FFF3E0', height: 24 }}
                                    >
                                        {tie.status ? tie.status.toUpperCase() : 'PENDING'}
                                    </Chip>
                                </View>
                                <Divider style={{ marginVertical: 10 }} />
                                <Text style={styles.detailText}><Text style={{fontWeight: 'bold'}}>Service Type:</Text> {tie.serviceType}</Text>
                                <Text style={styles.detailText}><Text style={{fontWeight: 'bold'}}>Location:</Text> {tie.location}</Text>
                                <Text style={styles.detailText}><Text style={{fontWeight: 'bold'}}>Submitted By:</Text> {tie.agentId?.name || 'Unknown Agent'}</Text>
                                <Text style={styles.detailText}><Text style={{fontWeight: 'bold'}}>Date:</Text> {new Date(tie.submittedAt).toLocaleDateString()}</Text>
                                
                                {tie.status === 'pending' && (
                                    <View style={styles.actionContainer}>
                                        <Button mode="outlined" textColor="#F44336" style={{ borderColor: '#F44336', flex: 1, marginRight: 5 }} onPress={() => handleAction(tie._id, 'rejected')}>Reject</Button>
                                        <Button mode="contained" buttonColor="#4CAF50" style={{ flex: 1, marginLeft: 5 }} onPress={() => handleAction(tie._id, 'approved')}>Approve</Button>
                                    </View>
                                )}
                            </Card.Content>
                        </Card>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', padding: 15 },
    pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#0A66C2', marginBottom: 15 },
    requestCard: { marginBottom: 15, backgroundColor: '#FFF', borderRadius: 12, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    businessName: { fontSize: 18, fontWeight: 'bold', color: '#333', flexShrink: 1 },
    detailText: { fontSize: 14, color: '#555', marginBottom: 4 },
    actionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }
});

export default TieUpRequestsScreen;
