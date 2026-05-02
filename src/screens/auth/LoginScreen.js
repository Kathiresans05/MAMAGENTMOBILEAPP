import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) return Alert.alert('Error', 'Please fill all fields');
        try {
            await login(email.trim(), password);
        } catch (e) {
            const msg = e.response?.data?.msg || 'Network Error - Check your connection';
            Alert.alert('Login Failed', msg);
        }
    };

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Agent Management</Title>
            <Text style={styles.subtitle}>Enter your credentials to continue</Text>
            
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                mode="outlined"
                activeOutlineColor="#0A66C2"
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                mode="outlined"
                activeOutlineColor="#0A66C2"
            />
            
            <Button 
                mode="contained" 
                onPress={handleLogin} 
                style={styles.button}
                buttonColor="#0A66C2"
            >
                Login
            </Button>

            <Button 
                mode="text" 
                onPress={() => navigation.navigate('Register')} 
                textColor="#0A66C2"
                style={{ marginTop: 10 }}
            >
                Don't have an account? Register
            </Button>
            
            <Text style={styles.footer}>Forge India Connect Pvt. Ltd</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#FFFFFF' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#0A66C2', textAlign: 'center' },
    subtitle: { textAlign: 'center', marginBottom: 30, color: '#666' },
    input: { marginBottom: 15 },
    button: { marginTop: 10, paddingVertical: 5 },
    footer: { textAlign: 'center', marginTop: 20, color: '#999' }
});

export default LoginScreen;
