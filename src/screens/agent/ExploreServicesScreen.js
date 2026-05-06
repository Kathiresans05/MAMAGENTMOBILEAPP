import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Title, Text, Card, Avatar, Searchbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ExploreServicesScreen = () => {
    const categories = [
        { id: 1, name: 'Insurance', icon: 'shield-check', color: '#4CAF50', sub: 'Life, Health, Motor' },
        { id: 2, name: 'Banking', icon: 'bank', color: '#0F4C81', sub: 'Loans, Savings, Credit' },
        { id: 3, name: 'Medical', icon: 'hospital-box', color: '#E91E63', sub: 'Health Checkups, Lab Tests' },
        { id: 4, name: 'Investments', icon: 'trending-up', color: '#FFC107', sub: 'Mutual Funds, SIP' },
        { id: 5, name: 'Govt. Schemes', icon: 'file-certificate', color: '#673AB7', sub: 'Pension, PM Schemes' },
        { id: 6, name: 'Education', icon: 'school', color: '#FF5722', sub: 'Student Loans, Courses' }
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Title style={styles.title}>Available Services</Title>
                <Text style={styles.subtitle}>Browse and offer services in your assigned pincode</Text>
            </View>

            <Searchbar
                placeholder="Search services..."
                style={styles.searchBar}
                iconColor="#0F4C81"
            />

            <View style={styles.grid}>
                {categories.map((cat) => (
                    <TouchableOpacity key={cat.id} style={styles.gridItem}>
                        <Card style={styles.card}>
                            <Card.Content style={styles.cardContent}>
                                <Avatar.Icon 
                                    size={50} 
                                    icon={cat.icon} 
                                    style={{ backgroundColor: cat.color + '15' }} 
                                    iconColor={cat.color}
                                />
                                <Title style={styles.catName}>{cat.name}</Title>
                                <Text style={styles.catSub}>{cat.sub}</Text>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))}
            </View>

            <Title style={[styles.title, { marginTop: 20 }]}>Popular in your Area</Title>
            <Card style={styles.promoCard}>
                <Card.Content style={styles.promoContent}>
                    <View style={styles.promoText}>
                        <Text style={styles.promoTag}>TOP CHOICE</Text>
                        <Title style={styles.promoTitle}>Family Health Plus</Title>
                        <Text style={styles.promoDesc}>Comprehensive medical cover for up to 6 members.</Text>
                    </View>
                    <MaterialCommunityIcons name="heart-flash" size={60} color="#E91E63" />
                </Card.Content>
            </Card>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFF', padding: 20 },
    header: { marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    subtitle: { fontSize: 13, color: '#666', marginTop: 4 },
    searchBar: { marginBottom: 25, backgroundColor: 'white', borderRadius: 12, elevation: 1 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    gridItem: { width: '48%', marginBottom: 15 },
    card: { backgroundColor: 'white', borderRadius: 15, elevation: 1 },
    cardContent: { alignItems: 'center', paddingVertical: 20 },
    catName: { fontSize: 16, fontWeight: 'bold', marginTop: 10, color: '#333' },
    catSub: { fontSize: 10, color: '#888', textAlign: 'center', marginTop: 2 },
    promoCard: { backgroundColor: '#0F4C81', borderRadius: 15, marginTop: 15 },
    promoContent: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    promoText: { flex: 1 },
    promoTag: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 'bold' },
    promoTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    promoDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }
});

export default ExploreServicesScreen;
