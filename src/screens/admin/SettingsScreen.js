import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Title, Button, Divider, List, Switch, Modal, Portal, TextInput } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingsScreen = ({ navigation }) => {
    const { logout, user } = useAuth();
    const [state, setState] = useState({
        notificationsEnabled: true,
        editModalVisible: false,
        editName: user?.name || "System Admin",
        editEmail: user?.email || "admin@example.com",
        securityModalVisible: false,
        passwords: { current: '', new: '', confirm: '' }
    });

    const updateState = (key, value) => setState(prev => ({ ...prev, [key]: value }));

    const handleUpdateProfile = () => {
        // Here you would typically make an API call to update the profile
        updateState('editModalVisible', false);
        // Show success message or handle context update here if needed
        Alert.alert("Success", "Profile updated successfully! (Prototype)");
    };

    const handleUpdatePassword = () => {
        const { current, new: newPass, confirm } = state.passwords;
        if (!current || !newPass || !confirm) {
            return Alert.alert("Error", "Please fill all password fields");
        }
        if (newPass !== confirm) {
            return Alert.alert("Error", "New passwords do not match");
        }
        // Mock API call
        setState(prev => ({
            ...prev,
            securityModalVisible: false,
            passwords: { current: '', new: '', confirm: '' }
        }));
        Alert.alert("Success", "Password updated successfully! (Prototype)");
    };

    return (
        <View style={styles.container}>
            <Title style={styles.pageTitle}>Settings</Title>
            
            <ScrollView>
                <Card style={styles.sectionCard}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>Profile</Title>
                        <List.Item
                            title={state.editName}
                            description={state.editEmail}
                            left={props => <MaterialCommunityIcons {...props} name="account-circle" size={40} color="#0A66C2" />}
                            right={props => <Button mode="text" textColor="#0A66C2" onPress={() => updateState('editModalVisible', true)}>Edit</Button>}
                        />
                    </Card.Content>
                </Card>

                <Card style={styles.sectionCard}>
                    <Card.Content style={{ padding: 0 }}>
                        <List.Item
                            title="Push Notifications"
                            description="Receive alerts for new agents and tie-ups"
                            left={props => <List.Icon {...props} icon="bell-ring" color="#FFA500" />}
                            right={() => <Switch value={state.notificationsEnabled} onValueChange={v => updateState('notificationsEnabled', v)} color="#0A66C2" />}
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
                            onPress={() => updateState('securityModalVisible', true)}
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
                <Modal visible={state.editModalVisible} onDismiss={() => updateState('editModalVisible', false)} contentContainerStyle={styles.modalContainer}>
                    <Title style={styles.modalTitle}>Edit Profile</Title>
                    <TextInput 
                        label="Name" 
                        value={state.editName} 
                        onChangeText={v => updateState('editName', v)} 
                        mode="outlined" 
                        style={styles.input} 
                        activeOutlineColor="#0A66C2"
                    />
                    <TextInput 
                        label="Email" 
                        value={state.editEmail} 
                        onChangeText={v => updateState('editEmail', v)} 
                        mode="outlined" 
                        keyboardType="email-address"
                        style={styles.input} 
                        activeOutlineColor="#0A66C2"
                    />
                    <View style={styles.modalActions}>
                        <Button mode="outlined" onPress={() => updateState('editModalVisible', false)} style={{ flex: 1, marginRight: 10 }}>Cancel</Button>
                        <Button mode="contained" buttonColor="#0A66C2" onPress={handleUpdateProfile} style={{ flex: 1 }}>Update</Button>
                    </View>
                </Modal>
                <Modal visible={state.securityModalVisible} onDismiss={() => updateState('securityModalVisible', false)} contentContainerStyle={styles.modalContainer}>
                    <Title style={styles.modalTitle}>Security & Password</Title>
                    <TextInput 
                        label="Current Password" 
                        value={state.passwords.current} 
                        onChangeText={v => setState({...state, passwords: {...state.passwords, current: v}})} 
                        mode="outlined" 
                        secureTextEntry
                        style={styles.input} 
                        activeOutlineColor="#0A66C2"
                    />
                    <TextInput 
                        label="New Password" 
                        value={state.passwords.new} 
                        onChangeText={v => setState({...state, passwords: {...state.passwords, new: v}})} 
                        mode="outlined" 
                        secureTextEntry
                        style={styles.input} 
                        activeOutlineColor="#0A66C2"
                    />
                    <TextInput 
                        label="Confirm New Password" 
                        value={state.passwords.confirm} 
                        onChangeText={v => setState({...state, passwords: {...state.passwords, confirm: v}})} 
                        mode="outlined" 
                        secureTextEntry
                        style={styles.input} 
                        activeOutlineColor="#0A66C2"
                    />
                    <View style={styles.modalActions}>
                        <Button mode="outlined" onPress={() => updateState('securityModalVisible', false)} style={{ flex: 1, marginRight: 10 }}>Cancel</Button>
                        <Button mode="contained" buttonColor="#0A66C2" onPress={handleUpdatePassword} style={{ flex: 1 }}>Update</Button>
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
