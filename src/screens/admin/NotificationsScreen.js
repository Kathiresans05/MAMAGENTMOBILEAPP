import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Text, List, Avatar, Divider, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationsScreen = () => {
    const notifications = [
        {
            id: 1,
            title: 'New Agent Registered',
            message: 'Rajesh Kumar has registered and is waiting for KYC approval.',
            time: '2 hours ago',
            icon: 'account-plus',
            color: '#0A66C2'
        },
        {
            id: 2,
            title: 'Tie-up Request',
            message: 'City Hospital has requested a new tie-up in Pincode 560001.',
            time: '5 hours ago',
            icon: 'hospital-building',
            color: '#F57C00'
        },
        {
            id: 3,
            title: 'System Alert',
            message: 'Backup completed successfully at 03:00 AM.',
            time: 'Yesterday',
            icon: 'check-circle',
            color: '#4CAF50'
        }
    ];

    return (
        <ScrollView style={styles.container}>
            <Title style={styles.headerTitle}>All Notifications</Title>
            
            {notifications.map((notif) => (
                <Card key={notif.id} style={styles.card}>
                    <Card.Content>
                        <View style={styles.row}>
                            <Avatar.Icon 
                                size={40} 
                                icon={notif.icon} 
                                style={{ backgroundColor: notif.color }} 
                            />
                            <View style={styles.textContent}>
                                <View style={styles.titleRow}>
                                    <Text style={styles.title}>{notif.title}</Text>
                                    <Text style={styles.time}>{notif.time}</Text>
                                </View>
                                <Text style={styles.message}>{notif.message}</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            ))}

            <Button mode="outlined" style={styles.clearBtn} textColor="#666">
                Clear All Notifications
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', padding: 15 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#0A66C2', marginBottom: 20 },
    card: { marginBottom: 12, backgroundColor: '#FFF', elevation: 1, borderRadius: 10 },
    row: { flexDirection: 'row', alignItems: 'center' },
    textContent: { flex: 1, marginLeft: 15 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    time: { fontSize: 11, color: '#888' },
    message: { fontSize: 14, color: '#666', marginTop: 4 },
    clearBtn: { marginTop: 20, marginBottom: 30, borderColor: '#DDD' }
});

export default NotificationsScreen;
