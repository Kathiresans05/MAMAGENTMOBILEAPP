import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Image, Alert, TouchableOpacity } from 'react-native';
import { Searchbar, List, Avatar, Button, Text, Card, Chip, Divider, ActivityIndicator, Portal, Modal, Title, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import apiClient from '../../api/client';

const AgentListScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [kycModalVisible, setKycModalVisible] = useState(false);
    const [selectedKyc, setSelectedKyc] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', level: '' });

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

    const handleApproveAgent = async (id, status) => {
        try {
            await apiClient.put(`/admin/approve-agent/${id}`, { status });
            setAgents(agents.map(a => a._id === id ? { ...a, status, isActive: status === 'approved' } : a));
            Alert.alert('Success', `Agent ${status === 'approved' ? 'Approved' : 'Rejected'}`);
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Update failed');
        }
    };
    const handleUpdateAgent = async () => {
        try {
            await apiClient.put(`/admin/update-agent/${editingAgent._id}`, editForm);
            setAgents(agents.map(a => a._id === editingAgent._id ? { ...a, ...editForm } : a));
            setEditModalVisible(false);
            Alert.alert('Success', 'Agent details updated successfully');
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Update failed');
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
                                    <View style={{ paddingRight: 10, justifyContent: 'center' }}>
                                        <Chip 
                                            textStyle={{ 
                                                color: agent.status === 'approved' ? '#1B5E20' : agent.status === 'pending' ? '#F57C00' : '#B71C1C', 
                                                fontSize: 10, 
                                                fontWeight: 'bold' 
                                            }}
                                            style={{ 
                                                backgroundColor: agent.status === 'approved' ? '#E8F5E9' : agent.status === 'pending' ? '#FFF3E0' : '#FFEBEE', 
                                                height: 28, 
                                                justifyContent: 'center' 
                                            }}
                                        >
                                            {(agent.status || 'pending').toUpperCase()}
                                        </Chip>
                                    </View>
                                )}
                            />
                            <Card.Content>
                                <Text style={{ color: '#555', marginBottom: 10 }}>Email: {agent.email || 'N/A'}</Text>
                                {agent.status === 'pending' ? (
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                                        <Button 
                                            mode="outlined" 
                                            onPress={() => {
                                                setSelectedKyc(agent.kyc);
                                                setKycModalVisible(true);
                                            }}
                                            style={{ borderColor: '#0A66C2' }}
                                            textColor="#0A66C2"
                                        >
                                            View KYC
                                        </Button>
                                        <Button mode="outlined" textColor="#D32F2F" style={{ borderColor: '#D32F2F' }} onPress={() => handleApproveAgent(agent._id, 'rejected')}>Reject</Button>
                                        <Button mode="contained" buttonColor="#4CAF50" onPress={() => handleApproveAgent(agent._id, 'approved')}>Approve Agent</Button>
                                    </View>
                                ) : (
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                                        <Button 
                                            mode="outlined" 
                                            textColor="#0A66C2" 
                                            style={{ borderColor: '#0A66C2' }}
                                            onPress={() => {
                                                setEditingAgent(agent);
                                                setEditForm({ name: agent.name, email: agent.email, level: agent.level || 'Agent' });
                                                setEditModalVisible(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            mode="contained" 
                                            buttonColor={agent.isActive ? '#F44336' : '#4CAF50'}
                                            onPress={() => handleToggleStatus(agent._id, agent.isActive)}
                                        >
                                            {agent.isActive ? 'Deactivate' : 'Activate'}
                                        </Button>
                                    </View>
                                )}
                            </Card.Content>
                        </Card>
                    ))
                )}
            </ScrollView>

            <Portal>
                <Modal 
                    visible={kycModalVisible} 
                    onDismiss={() => setKycModalVisible(false)} 
                    contentContainerStyle={styles.modalContent}
                >
                    <ScrollView contentContainerStyle={{ padding: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0A66C2' }}>KYC Documents</Text>
                            <TouchableOpacity onPress={() => setKycModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {selectedKyc ? (
                            <View>
                                <Text style={styles.kycLabel}>Selfie</Text>
                                {selectedKyc.selfie ? (
                                    <Image source={{ uri: selectedKyc.selfie }} style={styles.kycImage} />
                                ) : (
                                    <View style={styles.noImage}><Text>No Selfie Uploaded</Text></View>
                                )}

                                <Text style={styles.kycLabel}>Aadhaar Number: {selectedKyc.aadhaarNumber || 'N/A'}</Text>
                                <Text style={styles.kycLabel}>Aadhaar Card Photo</Text>
                                {selectedKyc.aadhaarImage ? (
                                    <Image source={{ uri: selectedKyc.aadhaarImage }} style={styles.kycImage} />
                                ) : (
                                    <View style={styles.noImage}><Text>No Aadhaar Image Uploaded</Text></View>
                                )}

                                <Text style={styles.kycLabel}>Other Document ({selectedKyc.otherDocType || 'N/A'})</Text>
                                {selectedKyc.otherDocImage ? (
                                    <Image source={{ uri: selectedKyc.otherDocImage }} style={styles.kycImage} />
                                ) : (
                                    <View style={styles.noImage}><Text>No Document Image Uploaded</Text></View>
                                )}
                            </View>
                        ) : (
                            <Text style={{ textAlign: 'center' }}>No KYC data available.</Text>
                        )}

                        <Button 
                            mode="contained" 
                            onPress={() => setKycModalVisible(false)} 
                            style={{ marginTop: 20 }}
                            buttonColor="#0A66C2"
                        >
                            Close
                        </Button>
                    </ScrollView>
                </Modal>

                <Modal 
                    visible={editModalVisible} 
                    onDismiss={() => setEditModalVisible(false)} 
                    contentContainerStyle={styles.modalContent}
                >
                    <View style={{ padding: 20 }}>
                        <Title style={{ color: '#0A66C2', marginBottom: 20 }}>Edit Agent Details</Title>
                        <TextInput 
                            label="Full Name" 
                            value={editForm.name} 
                            onChangeText={v => setEditForm({ ...editForm, name: v })} 
                            mode="outlined" 
                            style={{ marginBottom: 15 }} 
                            activeOutlineColor="#0A66C2"
                        />
                        <TextInput 
                            label="Email Address" 
                            value={editForm.email} 
                            onChangeText={v => setEditForm({ ...editForm, email: v })} 
                            mode="outlined" 
                            keyboardType="email-address"
                            style={{ marginBottom: 15 }} 
                            activeOutlineColor="#0A66C2"
                        />
                        <TextInput 
                            label="Agent Level" 
                            value={editForm.level} 
                            onChangeText={v => setEditForm({ ...editForm, level: v })} 
                            mode="outlined" 
                            style={{ marginBottom: 20 }} 
                            activeOutlineColor="#0A66C2"
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                            <Button mode="outlined" onPress={() => setEditModalVisible(false)} style={{ flex: 1 }}>Cancel</Button>
                            <Button mode="contained" buttonColor="#0A66C2" onPress={handleUpdateAgent} style={{ flex: 1 }}>Update</Button>
                        </View>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', padding: 15 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#0A66C2' },
    searchBar: { marginBottom: 15, backgroundColor: '#FFF', elevation: 2 },
    agentCard: { marginBottom: 12, backgroundColor: '#FFF', elevation: 2, borderRadius: 12 },
    modalContent: { backgroundColor: 'white', margin: 20, borderRadius: 12, maxHeight: '80%' },
    kycLabel: { fontSize: 14, fontWeight: 'bold', marginTop: 15, marginBottom: 5, color: '#333' },
    kycImage: { width: '100%', height: 250, borderRadius: 8, backgroundColor: '#f0f0f0', resizeMode: 'cover' },
    noImage: { width: '100%', height: 100, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderRadius: 8 }
});

export default AgentListScreen;
