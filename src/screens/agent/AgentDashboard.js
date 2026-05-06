import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Alert, Share, Linking } from 'react-native';
import { Surface, Title, Text, Button, IconButton, useTheme, Menu, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import DashboardCard from '../../components/DashboardCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AgentDashboard = ({ navigation }) => {
    const { user, logout } = useAuth();
    const theme = useTheme();
    const [stats, setStats] = useState({ 
        balance: 0, 
        tasks: { pending: 0, total: 0 }, 
        tieUps: 0, 
        downline: 0 
    });
    const [refreshing, setRefreshing] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    const [tasks, setTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const [statsRes, tasksRes] = await Promise.all([
                apiClient.get('/agent/dashboard-stats'),
                apiClient.get('/agent/tasks').catch(() => ({ data: [] }))
            ]);
            setStats(statsRes.data);
            setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        } catch (e) {
            console.error('Failed to fetch stats', e);
        } finally {
            setTasksLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchStats().then(() => setRefreshing(false));
    }, []);

    const handleInvite = async () => {
        try {
            await Share.share({
                message: `Hey! Join Forge India as an agent and start earning. Register here: https://forgeindia.com/register?ref=${user?.id?.substring(0, 8)}`,
                title: 'Invite to Forge India'
            });
        } catch (error) {
            Alert.alert('Error', 'Could not open share menu');
        }
    };

    const handleSupport = () => {
        Alert.alert(
            'Contact Support',
            'How would you like to reach us?',
            [
                { text: 'WhatsApp', onPress: () => Linking.openURL('whatsapp://send?phone=919876543210&text=Hi Support, I need help with Forge India App') },
                { text: 'Email', onPress: () => Linking.openURL('mailto:support@forgeindia.com?subject=Agent Support Request') },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* Welcome Greeting */}
            <View style={styles.welcomeSection}>
                <Text style={styles.greeting}>Good Morning,</Text>
                <Title style={styles.userName}>{user?.name}</Title>
            </View>

            {/* Wallet Section */}
            <Surface style={styles.walletCard} elevation={4}>
                <View style={styles.walletHeader}>
                    <Text style={styles.walletLabel}>Wallet Balance</Text>
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <IconButton 
                                icon="dots-vertical" 
                                iconColor="white" 
                                onPress={() => setMenuVisible(true)} 
                            />
                        }
                    >
                        <Menu.Item onPress={() => { setMenuVisible(false); navigation.navigate('Wallet'); }} title="Add Money" leadingIcon="plus-circle" />
                        <Menu.Item onPress={() => { setMenuVisible(false); navigation.navigate('Wallet'); }} title="Transfer" leadingIcon="bank-transfer" />
                        <Menu.Item onPress={() => { setMenuVisible(false); navigation.navigate('Wallet'); }} title="Statement" leadingIcon="file-document" />
                    </Menu>
                </View>
                <Text style={styles.balance}>₹{stats.balance.toLocaleString('en-IN')}</Text>
                <View style={styles.walletActions}>
                    <Button 
                        mode="contained" 
                        buttonColor="rgba(255,255,255,0.2)" 
                        style={styles.walletBtn}
                        onPress={() => navigation.navigate('Wallet')}
                    >
                        Withdraw
                    </Button>
                    <Button 
                        mode="contained" 
                        buttonColor="rgba(255,255,255,0.2)" 
                        style={styles.walletBtn}
                        onPress={() => navigation.navigate('Wallet')}
                    >
                        History
                    </Button>
                </View>
            </Surface>

            {/* MLM & Stats Grid */}
            <View style={styles.grid}>
                <DashboardCard 
                    title="Direct Agents" 
                    value={stats.downline} 
                    icon="account-group" 
                    color="#4CAF50" 
                    subtitle="Level 1 Network"
                />
                <DashboardCard 
                    title="Active Tasks" 
                    value={stats.tasks.pending} 
                    icon="clipboard-text-clock" 
                    color="#F4B400" 
                    subtitle="Requires Action"
                />
                <DashboardCard 
                    title="Business Tie-ups" 
                    value={stats.tieUps} 
                    icon="store" 
                    color="#0F4C81" 
                    subtitle="Area Coverage"
                />
                <DashboardCard 
                    title="Total Commission" 
                    value={`₹${(Array.isArray(stats.earnings) ? stats.earnings.reduce((a, b) => a + b, 0) : (stats.earnings || 0)).toLocaleString('en-IN')}`} 
                    icon="trending-up" 
                    color="#E91E63" 
                    subtitle="All Time"
                />
            </View>

            {/* Quick Actions */}
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={styles.actionGrid}>
                <Surface style={styles.actionCard} elevation={1}>
                    <IconButton icon="map-marker-plus" iconColor="#0F4C81" size={32} onPress={() => navigation.navigate('PincodeSelection')} />
                    <Text style={styles.actionLabel}>Add Area</Text>
                </Surface>
                <Surface style={styles.actionCard} elevation={1}>
                    <IconButton icon="plus-box" iconColor="#0F4C81" size={32} onPress={() => navigation.navigate('TieUpRequest')} />
                    <Text style={styles.actionLabel}>New Tie-up</Text>
                </Surface>
                <Surface style={styles.actionCard} elevation={1}>
                    <IconButton icon="account-plus" iconColor="#0F4C81" size={32} onPress={handleInvite} />
                    <Text style={styles.actionLabel}>Invite</Text>
                </Surface>
                <Surface style={styles.actionCard} elevation={1}>
                    <IconButton icon="help-circle" iconColor="#0F4C81" size={32} onPress={handleSupport} />
                    <Text style={styles.actionLabel}>Support</Text>
                </Surface>
            </View>
            {/* Recent Tasks */}
            <View style={styles.sectionHeader}>
                <Title style={styles.sectionTitle}>Recent Tasks</Title>
                <Button mode="text" compact onPress={() => navigation.navigate('Tasks')}>View All</Button>
            </View>
            <Surface style={styles.tasksContainer} elevation={1}>
                {tasksLoading ? (
                    <ActivityIndicator style={{ padding: 20 }} color="#0F4C81" />
                ) : tasks.length === 0 ? (
                    <Text style={{ textAlign: 'center', padding: 20, color: '#999' }}>No tasks assigned yet.</Text>
                ) : (
                    tasks.slice(0, 3).map((task, index) => (
                        <View key={task._id || index} style={[styles.taskItem, index === 0 ? {} : styles.taskBorder]}>
                            <View style={[styles.taskIcon, { backgroundColor: (task.color || '#0F4C81') + '15' }]}>
                                <IconButton icon={task.icon || 'clipboard-check'} iconColor={task.color || '#0F4C81'} size={20} />
                            </View>
                            <View style={styles.taskInfo}>
                                <Text style={styles.taskTitle}>{task.title}</Text>
                                <Text style={styles.taskSub}>{task.sub || task.businessName} • {task.time || new Date(task.createdAt).toLocaleDateString()}</Text>
                            </View>
                            <Surface style={[styles.statusBadge, { backgroundColor: (task.color || '#F4B400') + '10' }]} elevation={0}>
                                <Text style={[styles.statusText, { color: task.color || '#F4B400' }]}>{task.status}</Text>
                            </Surface>
                        </View>
                    ))
                )}
            </Surface>

            <Button mode="text" onPress={logout} textColor="#666" style={styles.logoutBtn}>
                Logout
            </Button>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFF', padding: 20 },
    brandedHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 20,
        marginTop: 10
    },
    headerLeft: { width: 40 },
    logoCircle: { 
        width: 36, 
        height: 36, 
        borderRadius: 18, 
        backgroundColor: 'white', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerMainTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    headerSubTitle: { fontSize: 10, color: '#999', marginTop: -2 },
    headerRight: { width: 40, alignItems: 'flex-end' },
    welcomeSection: { marginBottom: 25 },
    greeting: { color: '#666', fontSize: 14 },
    userName: { color: '#0F4C81', fontWeight: 'bold', fontSize: 24, marginTop: -5 },
    walletCard: { 
        backgroundColor: '#0F4C81', 
        borderRadius: 20, 
        padding: 20, 
        marginBottom: 25,
    },
    walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    walletLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
    balance: { color: 'white', fontSize: 32, fontWeight: 'bold', marginVertical: 10 },
    walletActions: { flexDirection: 'row', marginTop: 10 },
    walletBtn: { marginRight: 10, borderRadius: 8 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, marginTop: 10 },
    actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    actionCard: { width: '22%', backgroundColor: 'white', borderRadius: 15, alignItems: 'center', paddingVertical: 10 },
    actionLabel: { fontSize: 10, color: '#333', fontWeight: '500' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    tasksContainer: { backgroundColor: 'white', borderRadius: 15, paddingHorizontal: 10 },
    taskItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
    taskBorder: { borderTopWidth: 1, borderTopColor: '#EEE' },
    taskIcon: { borderRadius: 10, marginRight: 12 },
    taskInfo: { flex: 1 },
    taskTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    taskSub: { fontSize: 11, color: '#999', marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 10, fontWeight: 'bold' },
    logoutBtn: { marginTop: 20 },
});

export default AgentDashboard;
