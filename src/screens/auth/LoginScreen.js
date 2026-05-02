import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            await login(email.trim(), password);
        } catch (e) {
            const msg = e.response?.data?.msg || 'Network Error - Check your connection';
            Alert.alert('Error', msg);
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
                activeOutlineColor="#0F4C81"
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                mode="outlined"
                activeOutlineColor="#0F4C81"
            />
            
            <Button 
                mode="contained" 
                onPress={handleLogin} 
                style={styles.button}
                buttonColor="#0F4C81"
            >
                Login
            </Button>
            
            <Text style={styles.footer}>Contact Admin if you don't have an account</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#FFFFFF' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#0F4C81', textAlign: 'center' },
    subtitle: { textAlign: 'center', marginBottom: 30, color: '#666' },
    input: { marginBottom: 15 },
    button: { marginTop: 10, paddingVertical: 5 },
    footer: { textAlign: 'center', marginTop: 20, color: '#999' }
});

export default LoginScreen;
