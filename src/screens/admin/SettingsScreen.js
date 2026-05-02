import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Button, Divider, List, Switch, Modal, Portal, TextInput } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingsScreen = ({ navigation }) => {
    const { logout, user } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editName, setEditName] = useState(user?.name || "System Admin");
    const [editEmail, setEditEmail] = useState(user?.email || "admin@example.com");

    const handleUpdateProfile = () => {
        // Here you would typically make an API call to update the profile
        setEditModalVisible(false);
        // Show success message or handle context update here if needed
        alert("Profile updated successfully! (Prototype)");
    };

    return (
        <View style={styles.container}>
            <Title style={styles.pageTitle}>Settings</Title>
            
            <ScrollView>
                <Card style={styles.sectionCard}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>Profile</Title>
                        <List.Item
                            title={editName}
                            description={editEmail}
                            left={props => <MaterialCommunityIcons {...props} name="account-circle" size={40} color="#0A66C2" />}
                            right={props => <Button mode="text" textColor="#0A66C2" onPress={() => setEditModalVisible(true)}>Edit</Button>}
                        />
                    </Card.Content>
                </Card>

                <Card style={styles.sectionCard}>
                    <Card.Content style={{ padding: 0 }}>
                        <List.Item
                            title="Push Notifications"
                            description="Receive alerts for new agents and tie-ups"
                            left={props => <List.Icon {...props} icon="bell-ring" color="#FFA500" />}
                            right={() => <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} color="#0A66C2" />}
                        />
                        <Divider />
                        <List.Item
                            title="Joining Fees Configuration"
                            description="Set default fees for State, District, Division"
                            left={props => <List.Icon {...props} icon="cash-multiple" color="#4CAF50" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => navigation.navigate('JoiningFees')}
                        />
                        <Divider />
                        <List.Item
                            title="Pincode Master"
                            description="Manage all serviceable pincodes"
                            left={props => <List.Icon {...props} icon="map-marker-path" color="#E91E63" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => navigation.navigate('PincodeMaster')}
                        />
                        <Divider />
                        <List.Item
                            title="Security"
                            description="Change password, Two-factor authentication"
                            left={props => <List.Icon {...props} icon="shield-lock" color="#9C27B0" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                        />
                    </Card.Content>
                </Card>

                <Button 
                    mode="contained" 
                    buttonColor="#FFF" 
                    textColor="#D32F2F" 
                    icon="logout" 
                    style={styles.logoutBtn}
                    onPress={logout}
                >
                    Logout from Admin
                </Button>
            </ScrollView>

            <Portal>
                <Modal visible={editModalVisible} onDismiss={() => setEditModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                    <Title style={styles.modalTitle}>Edit Profile</Title>
                    <TextInput 
                        label="Name" 
                        value={editName} 
                        onChangeText={setEditName} 
                        mode="outlined" 
                        style={styles.input} 
                        activeOutlineColor="#0A66C2"
                    />
                    <TextInput 
                        label="Email" 
                        value={editEmail} 
                        onChangeText={setEditEmail} 
                        mode="outlined" 
                        keyboardType="email-address"
                        style={styles.input} 
                        activeOutlineColor="#0A66C2"
                    />
                    <View style={styles.modalActions}>
                        <Button mode="outlined" onPress={() => setEditModalVisible(false)} style={{ flex: 1, marginRight: 10 }}>Cancel</Button>
                        <Button mode="contained" buttonColor="#0A66C2" onPress={handleUpdateProfile} style={{ flex: 1 }}>Update</Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', padding: 15 },
    pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#0A66C2', marginBottom: 15 },
    sectionCard: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 15, elevation: 1 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    logoutBtn: { marginTop: 10, borderColor: '#D32F2F', borderWidth: 1, elevation: 0 },
    modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 12 },
    modalTitle: { marginBottom: 15, color: '#333', fontWeight: 'bold' },
    input: { marginBottom: 15, backgroundColor: '#FFF' },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }
});

export default SettingsScreen;
