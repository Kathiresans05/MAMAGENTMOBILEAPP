import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button, Text, List, Avatar } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const [agents, setAgents] = useState([]);
    const [tieUps, setTieUps] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const agentRes = await apiClient.get('/admin/agents');
            setAgents(agentRes.data);
            // In a real app, we'd fetch tie-ups here too
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Title style={styles.title}>Admin Panel</Title>
                <Button mode="text" textColor="#F4B400" onPress={logout}>Logout</Button>
            </View>

            <View style={styles.statsContainer}>
                <Card style={styles.statCard}>
                    <Card.Content>
                        <Title>{agents.length}</Title>
                        <Paragraph>Total Agents</Paragraph>
                    </Card.Content>
                </Card>
                <Card style={styles.statCard}>
                    <Card.Content>
                        <Title>3</Title>
                        <Paragraph>Pending Tie-ups</Paragraph>
                    </Card.Content>
                </Card>
            </View>

            <Title style={styles.sectionTitle}>Agent Management</Title>
            {agents.map((agent) => (
                <List.Item
                    key={agent._id}
                    title={agent.name}
                    description={`${agent.email} - ${agent.assignedPincode?.code || 'No Pincode'}`}
                    left={props => <Avatar.Text {...props} label={agent.name[0]} size={40} />}
                    right={props => (
                        <Button 
                            mode="outlined" 
                            style={styles.actionBtn}
                            onPress={() => {}}
                        >
                            {agent.isActive ? 'Active' : 'Activate'}
                        </Button>
                    )}
                    style={styles.listItem}
                />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA', padding: 15 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { color: '#0F4C81', fontWeight: 'bold' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    statCard: { width: '48%', elevation: 2 },
    sectionTitle: { fontSize: 18, marginBottom: 10, color: '#333' },
    listItem: { backgroundColor: '#FFF', marginBottom: 5, borderRadius: 8 },
    actionBtn: { alignSelf: 'center' }
});

export default AdminDashboard;
