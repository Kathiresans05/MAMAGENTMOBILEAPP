import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Title, HelperText, Snackbar } from 'react-native-paper';
import apiClient from '../../api/client';

const AddAgentScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const handleAddAgent = async () => {
        if (!name || !email || !password) return;
        setLoading(true);
        try {
            // Usually we would call the actual register endpoint, simulating for now to show flow
            setTimeout(() => {
                setLoading(false);
                setSnackbarVisible(true);
                setTimeout(() => navigation.goBack(), 1000);
            }, 800);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <Title style={styles.title}>Create New Agent</Title>
                
                <TextInput label="Full Name" value={name} onChangeText={setName} mode="outlined" style={styles.input} activeOutlineColor="#0A66C2" />
                <TextInput label="Email Address" value={email} onChangeText={setEmail} mode="outlined" keyboardType="email-address" autoCapitalize="none" style={styles.input} activeOutlineColor="#0A66C2" />
                <TextInput label="Phone Number" value={phone} onChangeText={setPhone} mode="outlined" keyboardType="phone-pad" style={styles.input} activeOutlineColor="#0A66C2" />
                <TextInput label="Temporary Password" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry style={styles.input} activeOutlineColor="#0A66C2" />
                
                <HelperText type="info" visible={true} style={{ marginBottom: 20 }}>
                    The agent will be required to select their Pincode upon first login.
                </HelperText>

                <Button mode="contained" buttonColor="#0A66C2" onPress={handleAddAgent} loading={loading} disabled={loading || !name || !email || !password} style={{ paddingVertical: 5 }}>
                    Create Agent
                </Button>
            </ScrollView>

            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={1500} style={{ backgroundColor: '#4CAF50' }}>
                Agent Added Successfully!
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0A66C2', marginBottom: 20 },
    input: { marginBottom: 15, backgroundColor: '#F8FAFC' }
});

export default AddAgentScreen;
