import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Searchbar, ActivityIndicator } from 'react-native-paper';
import apiClient from '../../api/client';

const PincodeSelection = ({ navigation }) => {
    const [pincodes, setPincodes] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPincodes();
    }, []);

    const fetchPincodes = async () => {
        try {
            const res = await apiClient.get('/pincodes');
            setPincodes(res.data);
            setFiltered(res.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text) => {
        setSearch(text);
        const filteredData = pincodes.filter(p => 
            p.code.includes(text) || p.name.toLowerCase().includes(text.toLowerCase())
        );
        setFiltered(filteredData);
    };

    const handleJoin = async (pincodeId) => {
        try {
            await apiClient.post('/agent/join-pincode', { pincodeId });
            Alert.alert('Success', 'Area selected. Please proceed to payment for activation.');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', e.response?.data?.msg || 'Could not join pincode');
        }
    };

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search Pincode or Area"
                onChangeText={handleSearch}
                value={search}
                style={styles.search}
            />
            
            {loading ? (
                <ActivityIndicator style={{ marginTop: 50 }} color="#0F4C81" />
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                            <Card.Content>
                                <Title>{item.code}</Title>
                                <Paragraph>{item.name}, {item.district}</Paragraph>
                                <Paragraph style={styles.state}>{item.state}</Paragraph>
                            </Card.Content>
                            <Card.Actions>
                                <Button 
                                    disabled={!!item.activeAgentId} 
                                    onPress={() => handleJoin(item._id)}
                                    textColor={item.activeAgentId ? "#999" : "#F4B400"}
                                >
                                    {item.activeAgentId ? 'OCCUPIED' : 'JOIN NOW'}
                                </Button>
                            </Card.Actions>
                        </Card>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA', padding: 15 },
    search: { marginBottom: 15, borderRadius: 10 },
    card: { marginBottom: 10, elevation: 3 },
    state: { fontSize: 12, color: '#666' }
});

export default PincodeSelection;
