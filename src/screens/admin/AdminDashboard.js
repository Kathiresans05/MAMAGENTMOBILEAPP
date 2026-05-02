import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Card, Title, Text, Button, ActivityIndicator, Divider } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AdminDashboard = ({ navigation }) => {
    const [agents, setAgents] = useState([]);
    const [tieUps, setTieUps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Agents
            try {
                const agentRes = await apiClient.get('/admin/agents');
                setAgents(Array.isArray(agentRes.data) ? agentRes.data : []);
            } catch (err) {
                console.log("Error fetching agents:", err);
            }

            // Fetch Tie-ups
            try {
                const tieUpRes = await apiClient.get('/admin/tie-ups');
                setTieUps(Array.isArray(tieUpRes.data) ? tieUpRes.data : []);
            } catch (err) {
                console.log("Error fetching tie-ups:", err);
            }
        } catch (e) {
            console.log("General fetch error:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0A66C2" />
            </View>
        );
    }

    const handleTieUpAction = async (id, status) => {
        try {
            await apiClient.put(`/admin/tie-up/${id}`, { status });
            // Update local state
            setTieUps(tieUps.map(t => t._id === id ? { ...t, status } : t));
        } catch (e) {
            console.log("Error updating tie-up:", e);
        }
    };

    const activeAgents = agents.filter(a => a.isActive).length;
    const pendingTieUpList = tieUps.filter(t => t.status === 'pending');
    const pendingTieUps = pendingTieUpList.length;

    // Fake revenue logic for dashboard display
    const totalRevenue = agents.length * 100000; // Assuming 1L joining fee for simplicity

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Title style={styles.title}>System Admin</Title>
                </View>
            </View>

            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 }}>
                <Button mode="contained" buttonColor="#0A66C2" icon="account-plus" style={styles.quickBtn} onPress={() => navigation.navigate('AddAgent')}>Add Agent</Button>
                <Button mode="contained" buttonColor="#FFA500" icon="map-marker-path" style={styles.quickBtn} onPress={() => navigation.navigate('PincodeMaster')}>Manage Pincodes</Button>
                <Button mode="contained" buttonColor="#4CAF50" icon="clipboard-text" style={styles.quickBtn} onPress={() => {}}>Assign Task</Button>
            </View>

            <Title style={styles.sectionTitle}>Overview</Title>
            <View style={styles.statsGrid}>
                <Card style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
                    <Card.Content>
                        <MaterialCommunityIcons name="account-group" size={28} color="#0A66C2" />
                        <Title style={{ color: '#0A66C2', fontSize: 24, marginTop: 5 }}>{agents.length}</Title>
                        <Text style={{ color: '#0A66C2', fontSize: 12 }}>Total Agents</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
                    <Card.Content>
                        <MaterialCommunityIcons name="check-circle" size={28} color="#2E7D32" />
                        <Title style={{ color: '#2E7D32', fontSize: 24, marginTop: 5 }}>{activeAgents}</Title>
                        <Text style={{ color: '#2E7D32', fontSize: 12 }}>Active Agents</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
                    <Card.Content>
                        <MaterialCommunityIcons name="store-clock" size={28} color="#F57C00" />
                        <Title style={{ color: '#F57C00', fontSize: 24, marginTop: 5 }}>{pendingTieUps}</Title>
                        <Text style={{ color: '#F57C00', fontSize: 12 }}>Pending Requests</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
                    <Card.Content>
                        <MaterialCommunityIcons name="currency-inr" size={28} color="#7B1FA2" />
                        <Title style={{ color: '#7B1FA2', fontSize: 20, marginTop: 5 }}>₹{(totalRevenue / 100000).toFixed(1)}L</Title>
                        <Text style={{ color: '#7B1FA2', fontSize: 12 }}>Total Revenue</Text>
                    </Card.Content>
                </Card>
            </View>

            <Card style={styles.chartCard}>
                <Card.Content>
                    <Title style={{ fontSize: 16, marginBottom: 15 }}>Agent Registration Growth</Title>
                    <View style={styles.barChartContainer}>
                        {/* CSS-based Bar Chart */}
                        {[3, 5, 4, 8, 12, agents.length].map((val, i) => (
                            <View key={i} style={styles.barColumn}>
                                <View style={[styles.bar, { height: Math.max(20, val * 8) }]} />
                                <Text style={styles.barLabel}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</Text>
                            </View>
                        ))}
                    </View>
                </Card.Content>
            </Card>

            <Card 
                style={{ backgroundColor: '#EAF2FF', borderRadius: 12, marginBottom: 20, elevation: 0 }}
                onPress={() => navigation.navigate('Agents')}
            >
                <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                        <Title style={{ color: '#0A66C2', fontWeight: 'bold', fontSize: 18 }}>Manage Agents</Title>
                        <Text style={{ color: '#5A8BBB', fontSize: 12 }}>View, edit, or suspend agent profiles</Text>
                    </View>
                    <View style={{ backgroundColor: '#285C8D', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#FFF" />
                    </View>
                </Card.Content>
            </Card>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Title style={{ fontSize: 18, fontWeight: 'bold', color: '#001F3F' }}>Pending Tie-ups</Title>
                {pendingTieUpList.length > 0 && (
                    <View style={{ backgroundColor: '#FFF8E1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                        <Text style={{ color: '#F57F17', fontSize: 12, fontWeight: 'bold' }}>{pendingTieUpList.length} New</Text>
                    </View>
                )}
            </View>

            {pendingTieUpList.slice(0, 3).map(tie => (
                <Card key={tie._id} style={{ backgroundColor: '#FFF', borderRadius: 12, marginBottom: 15, elevation: 1 }}>
                    <Card.Content>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <View style={{ backgroundColor: '#F0F4F8', padding: 10, borderRadius: 10, marginRight: 15 }}>
                                <MaterialCommunityIcons name={tie.serviceType === 'Hospital' ? 'hospital-box-outline' : 'storefront-outline'} size={26} color="#285C8D" />
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#001F3F' }}>{tie.businessName}</Text>
                                <Text style={{ fontSize: 12, color: '#555' }}>{tie.location}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                            <Button mode="outlined" style={{ flex: 1, borderColor: '#D32F2F', borderRadius: 8 }} textColor="#D32F2F" onPress={() => handleTieUpAction(tie._id, 'rejected')}>Reject</Button>
                            <Button mode="contained" style={{ flex: 1, backgroundColor: '#F5A623', borderRadius: 8, elevation: 0 }} textColor="#000" onPress={() => handleTieUpAction(tie._id, 'approved')}>Approve</Button>
                        </View>
                    </Card.Content>
                </Card>
            ))}
            
            {pendingTieUpList.length === 0 && (
                <Text style={{ color: '#888', marginBottom: 20 }}>No pending tie-up requests.</Text>
            )}

            <Title style={{ fontSize: 18, fontWeight: 'bold', color: '#001F3F', marginBottom: 10, marginTop: 10 }}>System Alerts</Title>
            <Card style={{ backgroundColor: '#FFF', borderRadius: 12, marginBottom: 30, elevation: 1, overflow: 'hidden' }}>
                <View style={{ padding: 15, flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ backgroundColor: '#FFEBEE', padding: 8, borderRadius: 8, marginRight: 15 }}>
                        <MaterialCommunityIcons name="cash-multiple" size={20} color="#D32F2F" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#333', fontSize: 14 }}>
                            <Text style={{ fontWeight: 'bold' }}>Agent Fastrack</Text> requested immediate payment approval for <Text style={{ fontWeight: 'bold' }}>₹12,400</Text>.
                        </Text>
                        <Text style={{ color: '#888', fontSize: 12, marginTop: 4 }}>2 hours ago</Text>
                    </View>
                </View>
                <Divider />
                <View style={{ padding: 15, flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ backgroundColor: '#E3F2FD', padding: 8, borderRadius: 8, marginRight: 15 }}>
                        <MaterialCommunityIcons name="alert-outline" size={20} color="#0A66C2" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#333', fontSize: 14 }}>
                            Pincode <Text style={{ fontWeight: 'bold' }}>560001</Text> has high delivery failure rate (12%).
                        </Text>
                        <Text style={{ color: '#888', fontSize: 12, marginTop: 4 }}>5 hours ago</Text>
                    </View>
                </View>
                <Divider />
                <Button mode="text" textColor="#0A66C2" style={{ paddingVertical: 5 }} onPress={() => {}}>View All Alerts</Button>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', padding: 15 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingTop: 10 },
    greeting: { color: '#666', fontSize: 14 },
    title: { color: '#0A66C2', fontWeight: 'bold', fontSize: 24, marginTop: -5 },
    sectionTitle: { fontSize: 18, marginBottom: 12, color: '#333', fontWeight: 'bold' },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 20 },
    statCard: { width: '48%', elevation: 0, borderRadius: 12, marginBottom: 10 },
    chartCard: { backgroundColor: '#FFF', borderRadius: 12, elevation: 2, marginBottom: 25 },
    barChartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 120, paddingBottom: 20 },
    barColumn: { alignItems: 'center', width: 40 },
    bar: { width: 16, backgroundColor: '#0A66C2', borderRadius: 4, minHeight: 10 },
    barLabel: { fontSize: 10, color: '#888', marginTop: 8 },
    quickBtn: { flexGrow: 1, borderRadius: 8 }
});

export default AdminDashboard;
