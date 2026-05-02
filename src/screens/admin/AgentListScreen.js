import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Searchbar, List, Avatar, Button, Text, Card, Chip, Divider, ActivityIndicator } from 'react-native-paper';
import apiClient from '../../api/client';

const AgentListScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAgents = async () => {
        try {
            const res = await apiClient.get('/admin/agents');
            setAgents(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchAgents();
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await apiClient.put(`/admin/activate-agent/${id}`, { isActive: !currentStatus });
            setAgents(agents.map(a => a._id === id ? { ...a, isActive: !currentStatus } : a));
        } catch (e) {
            console.log(e);
        }
    };

    const filteredAgents = agents.filter(a => 
        (a.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (a.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0A66C2" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Manage Agents</Text>
                <Button mode="contained" buttonColor="#0A66C2" onPress={() => navigation.navigate('AddAgent')}>
                    + Add Agent
                </Button>
            </View>
            
            <Searchbar
                placeholder="Search agents..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                iconColor="#0A66C2"
            />

            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {filteredAgents.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>No agents found.</Text>
                ) : (
                    filteredAgents.map((agent, index) => (
                        <Card key={agent._id || index} style={styles.agentCard}>
                            <Card.Title
                                title={agent.name || 'Unnamed Agent'}
                                subtitle={`Role: ${agent.level || 'Agent'}\nLocation: ${agent.assignedPincode?.code || 'Unassigned'}`}
                                subtitleNumberOfLines={2}
                                left={(props) => <Avatar.Text {...props} label={agent.name ? agent.name[0].toUpperCase() : '?'} style={{ backgroundColor: '#0A66C2' }} />}
                                right={(props) => (
                                    <View style={{ paddingRight: 10, alignItems: 'flex-end', gap: 5 }}>
                                        <Chip 
                                            textStyle={{ color: agent.isActive ? '#2E7D32' : '#C62828', fontSize: 10 }}
                                            style={{ backgroundColor: agent.isActive ? '#E8F5E9' : '#FFEBEE', height: 24 }}
                                        >
                                            {agent.isActive ? 'ACTIVE' : 'INACTIVE'}
                                        </Chip>
                                    </View>
                                )}
                            />
                            <Card.Content>
                                <Text style={{ color: '#555', marginBottom: 10 }}>Email: {agent.email || 'N/A'}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                                    <Button mode="outlined" textColor="#0A66C2" style={{ borderColor: '#0A66C2' }}>Edit</Button>
                                    <Button 
                                        mode="contained" 
                                        buttonColor={agent.isActive ? '#F44336' : '#4CAF50'}
                                        onPress={() => handleToggleStatus(agent._id, agent.isActive)}
                                    >
                                        {agent.isActive ? 'Deactivate' : 'Activate'}
                                    </Button>
                                </View>
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
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#0A66C2' },
    searchBar: { marginBottom: 15, backgroundColor: '#FFF', elevation: 2 },
    agentCard: { marginBottom: 12, backgroundColor: '#FFF', elevation: 2, borderRadius: 12 }
});

export default AgentListScreen;
