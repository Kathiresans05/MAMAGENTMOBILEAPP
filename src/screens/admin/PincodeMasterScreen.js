import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Title, Card, Text, Snackbar, Divider, ActivityIndicator, Menu } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import apiClient from '../../api/client';

const PincodeMasterScreen = ({ navigation }) => {
    const [pincodeInput, setPincodeInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [pincodeDetails, setPincodeDetails] = useState(null);
    const [isAssigned, setIsAssigned] = useState(false);
    
    // For dropdown when multiple post offices exist
    const [postOffices, setPostOffices] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);

    const handlePincodeChange = async (text) => {
        // Only allow numbers
        const cleaned = text.replace(/[^0-9]/g, '');
        setPincodeInput(cleaned);
        
        if (cleaned.length === 6) {
            fetchPincodeData(cleaned);
        } else {
            setPincodeDetails(null);
            setErrorMsg('');
            setPostOffices([]);
        }
    };

    const fetchPincodeData = async (pin) => {
        setLoading(true);
        setErrorMsg('');
        setPincodeDetails(null);
        setPostOffices([]);
        setIsAssigned(false);

        try {
            // 1. Check our DB first
            const dbCheck = await apiClient.get(`/admin/check-agent?pincode=${pin}`);
            
            if (dbCheck.data.exists) {
                // Pincode exists in our DB
                const details = dbCheck.data.details;
                setPincodeDetails(details);
                setIsAssigned(dbCheck.data.assigned);
                setLoading(false);
                return;
            }

            // 2. Not in DB, fetch from Postal API
            const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
            const data = await response.json();

            if (data && data[0].Status === 'Success') {
                const offices = data[0].PostOffice;
                if (offices.length > 1) {
                    setPostOffices(offices);
                    setMenuVisible(true);
                } else if (offices.length === 1) {
                    selectPostOffice(offices[0], pin);
                }
            } else {
                setErrorMsg('Invalid Pincode. Please check and try again.');
            }
        } catch (error) {
            console.error(error);
            setErrorMsg('Failed to fetch pincode details.');
        } finally {
            setLoading(false);
        }
    };

    const selectPostOffice = async (office, pin = pincodeInput) => {
        setMenuVisible(false);
        const newDetails = {
            pincode: pin,
            postOffice: office.Name,
            district: office.District,
            state: office.State,
            division: office.Division,
            region: office.Region,
            deliveryStatus: office.DeliveryStatus
        };
        
        setPincodeDetails(newDetails);
        setIsAssigned(false); // Brand new pincode is available by default

        // 3. Save to DB automatically
        try {
            await apiClient.post('/admin/save-pincode', newDetails);
        } catch (e) {
            console.log("Error saving pincode to DB:", e);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Title style={styles.title}>Pincode Master</Title>
            
            <Card style={styles.searchCard}>
                <Card.Content>
                    <TextInput 
                        label="Enter 6-Digit Pincode" 
                        value={pincodeInput} 
                        onChangeText={handlePincodeChange} 
                        mode="outlined" 
                        keyboardType="numeric"
                        maxLength={6}
                        style={styles.input} 
                        activeOutlineColor="#0A66C2"
                        right={loading ? <TextInput.Icon icon={() => <ActivityIndicator size="small" color="#0A66C2"/>} /> : null}
                    />
                    
                    {errorMsg ? (
                        <Text style={styles.errorText}>{errorMsg}</Text>
                    ) : null}

                    {/* Post Office Selection Menu */}
                    {postOffices.length > 1 && !pincodeDetails && (
                        <Menu
                            visible={menuVisible}
                            onDismiss={() => setMenuVisible(false)}
                            anchor={
                                <Button mode="outlined" onPress={() => setMenuVisible(true)} style={{ marginTop: 10 }}>
                                    Select Post Office ({postOffices.length} found)
                                </Button>
                            }
                        >
                            <ScrollView style={{ maxHeight: 200 }}>
                                {postOffices.map((po, index) => (
                                    <Menu.Item key={index} onPress={() => selectPostOffice(po)} title={po.Name} />
                                ))}
                            </ScrollView>
                        </Menu>
                    )}
                </Card.Content>
            </Card>

            {pincodeDetails && (
                <View>
                    <View style={styles.statusContainer}>
                        {isAssigned ? (
                            <View style={[styles.badge, styles.badgeAssigned]}>
                                <MaterialCommunityIcons name="close-circle" size={16} color="#D32F2F" />
                                <Text style={styles.badgeTextAssigned}>This pincode already has an agent</Text>
                            </View>
                        ) : (
                            <View style={[styles.badge, styles.badgeAvailable]}>
                                <MaterialCommunityIcons name="check-circle" size={16} color="#2E7D32" />
                                <Text style={styles.badgeTextAvailable}>Pincode Available</Text>
                            </View>
                        )}
                    </View>

                    <Card style={styles.detailsCard}>
                        <Card.Title title="Location Details" titleStyle={{ color: '#0A66C2' }} />
                        <Card.Content>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Post Office:</Text>
                                <Text style={styles.detailValue}>{pincodeDetails.postOffice || pincodeDetails.name}</Text>
                            </View>
                            <Divider style={styles.divider} />
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>District:</Text>
                                <Text style={styles.detailValue}>{pincodeDetails.district}</Text>
                            </View>
                            <Divider style={styles.divider} />
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>State:</Text>
                                <Text style={styles.detailValue}>{pincodeDetails.state}</Text>
                            </View>
                            <Divider style={styles.divider} />
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Division:</Text>
                                <Text style={styles.detailValue}>{pincodeDetails.division || 'N/A'}</Text>
                            </View>
                            <Divider style={styles.divider} />

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Region:</Text>
                                <Text style={styles.detailValue}>{pincodeDetails.region || 'N/A'}</Text>
                            </View>
                            <Divider style={styles.divider} />
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Delivery Status:</Text>
                                <Text style={styles.detailValue}>{pincodeDetails.deliveryStatus || 'N/A'}</Text>
                            </View>
                        </Card.Content>
                    </Card>

                    <Button 
                        mode="contained" 
                        buttonColor="#F5A623" 
                        icon="account-plus"
                        style={styles.addAgentBtn}
                        disabled={isAssigned}
                        onPress={() => navigation.navigate('AddAgent', { prefillPincode: pincodeInput })}
                    >
                        {isAssigned ? 'Agent Assigned' : 'Add Agent for this Pincode'}
                    </Button>
                </View>
            )}

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', padding: 15 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#0A66C2', marginBottom: 15 },
    searchCard: { backgroundColor: '#FFF', elevation: 2, borderRadius: 12, marginBottom: 20 },
    input: { backgroundColor: '#FFF' },
    errorText: { color: '#D32F2F', marginTop: 10, fontSize: 14, fontWeight: 'bold' },
    statusContainer: { alignItems: 'center', marginBottom: 15 },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
    badgeAssigned: { backgroundColor: '#FFEBEE', borderColor: '#D32F2F', borderWidth: 1 },
    badgeAvailable: { backgroundColor: '#E8F5E9', borderColor: '#2E7D32', borderWidth: 1 },
    badgeTextAssigned: { color: '#D32F2F', fontWeight: 'bold', marginLeft: 8 },
    badgeTextAvailable: { color: '#2E7D32', fontWeight: 'bold', marginLeft: 8 },
    detailsCard: { backgroundColor: '#FFF', elevation: 1, borderRadius: 12, marginBottom: 20 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
    detailLabel: { color: '#666', fontSize: 14, flex: 1 },
    detailValue: { color: '#333', fontSize: 14, fontWeight: 'bold', flex: 2, textAlign: 'right' },
    divider: { backgroundColor: '#E0E0E0' },
    addAgentBtn: { paddingVertical: 5, borderRadius: 8, marginBottom: 40 }
});

export default PincodeMasterScreen;
