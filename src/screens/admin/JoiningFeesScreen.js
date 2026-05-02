import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Title, Card, Snackbar } from 'react-native-paper';

const JoiningFeesScreen = ({ navigation }) => {
    const [stateFee, setStateFee] = useState('500000');
    const [districtFee, setDistrictFee] = useState('200000');
    const [divisionFee, setDivisionFee] = useState('100000');
    const [pincodeFee, setPincodeFee] = useState('50000');
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSnackbarVisible(true);
            setTimeout(() => navigation.goBack(), 1000);
        }, 800);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <Title style={styles.title}>Joining Fees Configuration</Title>
                
                <Card style={styles.card}>
                    <Card.Content>
                        <TextInput label="State Agent Fee (₹)" value={stateFee} onChangeText={setStateFee} mode="outlined" keyboardType="numeric" style={styles.input} activeOutlineColor="#0A66C2" />
                        <TextInput label="District Agent Fee (₹)" value={districtFee} onChangeText={setDistrictFee} mode="outlined" keyboardType="numeric" style={styles.input} activeOutlineColor="#0A66C2" />
                        <TextInput label="Division Agent Fee (₹)" value={divisionFee} onChangeText={setDivisionFee} mode="outlined" keyboardType="numeric" style={styles.input} activeOutlineColor="#0A66C2" />
                        <TextInput label="Pincode Agent Fee (₹)" value={pincodeFee} onChangeText={setPincodeFee} mode="outlined" keyboardType="numeric" style={styles.input} activeOutlineColor="#0A66C2" />
                    </Card.Content>
                </Card>

                <Button mode="contained" buttonColor="#0A66C2" onPress={handleSave} loading={loading} style={styles.saveBtn}>
                    Save Changes
                </Button>
            </ScrollView>

            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={1500} style={{ backgroundColor: '#4CAF50' }}>
                Fees Updated Successfully!
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#0A66C2', marginBottom: 20 },
    card: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 20, elevation: 2 },
    input: { marginBottom: 15, backgroundColor: '#F8FAFC' },
    saveBtn: { paddingVertical: 5 }
});

export default JoiningFeesScreen;
