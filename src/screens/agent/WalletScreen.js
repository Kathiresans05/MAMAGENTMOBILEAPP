import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Title, Text, Card, Button, List, Avatar, Surface, Divider, IconButton, Portal, Modal, TextInput, ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';

const WalletScreen = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(user?.balance || 0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [addMoneyModalVisible, setAddMoneyModalVisible] = useState(false);
    const [amount, setAmount] = useState('');
    const [isPaying, setIsPaying] = useState(false);
    const [stats, setStats] = useState({ earnings: 0, withdrawals: 0 });

    const fetchData = async () => {
        try {
            const [walletRes, statsRes] = await Promise.all([
                apiClient.get('/agent/transactions').catch(() => ({ data: [] })),
                apiClient.get('/agent/dashboard-stats').catch(() => ({ data: { balance: 0, earnings: 0, withdrawals: 0 } }))
            ]);
            
            setTransactions(Array.isArray(walletRes.data) ? walletRes.data : []);
            setBalance(statsRes.data.balance || 0);
            setStats({
                earnings: statsRes.data.earnings || 0,
                withdrawals: statsRes.data.withdrawals || 0
            });
        } catch (e) {
            console.error('Failed to fetch wallet data', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleAddMoney = () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            return Alert.alert('Invalid Amount', 'Please enter a valid amount to add.');
        }
        setIsPaying(true);
        // Simulate Payment Gateway call but then update balance from server or locally
        setTimeout(async () => {
            try {
                const addedAmount = parseFloat(amount);
                // In a real app, you'd verify the payment on the backend
                // await apiClient.post('/agent/add-money', { amount: addedAmount });
                setBalance(prev => prev + addedAmount);
                setIsPaying(false);
                setAddMoneyModalVisible(false);
                setAmount('');
                Alert.alert('Payment Successful', `₹${addedAmount} has been added to your wallet.`);
                fetchData(); // Refresh to get the new transaction
            } catch (err) {
                setIsPaying(false);
                Alert.alert('Error', 'Payment failed or could not be verified.');
            }
        }, 2000);
    };

    const handleWithdraw = () => {
        if (balance < 100) {
            return Alert.alert('Insufficient Balance', 'Minimum withdrawal amount is ₹100.');
        }
        Alert.alert(
            'Withdraw Funds',
            'Withdrawal requests take 24-48 hours to process. Select amount to withdraw.',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Withdraw ₹1,000', 
                    onPress: () => {
                        if (balance >= 1000) Alert.alert('Success', 'Withdrawal request submitted!');
                        else Alert.alert('Error', 'Insufficient balance');
                    } 
                },
                { 
                    text: 'Withdraw All', 
                    onPress: () => Alert.alert('Success', 'Withdrawal request for all funds submitted!') 
                }
            ]
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0F4C81" />
                <Text style={{ marginTop: 10 }}>Loading Wallet...</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* Wallet Header Card */}
            <Surface style={styles.walletHeader} elevation={4}>
                <View style={styles.headerTop}>
                    <Text style={styles.walletLabel}>Current Balance</Text>
                    <IconButton icon="information-outline" iconColor="white" size={20} />
                </View>
                <Title style={styles.balanceText}>₹{balance.toLocaleString('en-IN')}</Title>
                <View style={styles.actionButtons}>
                    <Button 
                        mode="contained" 
                        icon="plus" 
                        buttonColor="white" 
                        textColor="#0F4C81" 
                        style={styles.actionBtn}
                        onPress={() => setAddMoneyModalVisible(true)}
                    >
                        Add Money
                    </Button>
                    <Button 
                        mode="contained" 
                        icon="bank-transfer" 
                        buttonColor="rgba(255,255,255,0.2)" 
                        textColor="white" 
                        style={styles.actionBtn}
                        onPress={handleWithdraw}
                    >
                        Withdraw
                    </Button>
                </View>
            </Surface>

            {/* Quick Stats */}
            <View style={styles.statsRow}>
                <Card style={styles.statCard}>
                    <Card.Content>
                        <Text style={styles.statLabel}>Total Earnings</Text>
                        <Title style={styles.statValue}>₹{(Array.isArray(stats.earnings) ? stats.earnings.reduce((a, b) => a + b, 0) : (stats.earnings || 0)).toLocaleString('en-IN')}</Title>
                    </Card.Content>
                </Card>
                <Card style={styles.statCard}>
                    <Card.Content>
                        <Text style={styles.statLabel}>Withdrawals</Text>
                        <Title style={styles.statValue}>₹{stats.withdrawals.toLocaleString('en-IN')}</Title>
                    </Card.Content>
                </Card>
            </View>

            {/* Transactions Section */}
            <View style={styles.transactionHeader}>
                <Title style={styles.sectionTitle}>Recent Transactions</Title>
                <Button mode="text" compact onPress={() => {}}>View All</Button>
            </View>

            <Surface style={styles.transactionContainer} elevation={1}>
                {transactions.length === 0 ? (
                    <View style={{ padding: 30, alignItems: 'center' }}>
                        <MaterialCommunityIcons name="receipt" size={40} color="#CCC" />
                        <Text style={{ color: '#999', marginTop: 10 }}>No transactions found</Text>
                    </View>
                ) : (
                    transactions.map((tx, index) => (
                        <React.Fragment key={tx.id || tx._id || index}>
                            <View style={styles.transactionItem}>
                                <View style={[styles.iconBg, { backgroundColor: (tx.color || '#0F4C81') + '15' }]}>
                                    <MaterialCommunityIcons name={tx.icon || (tx.type === 'credit' ? 'arrow-down-left' : 'arrow-up-right')} size={24} color={tx.color || (tx.type === 'credit' ? '#4CAF50' : '#E91E63')} />
                                </View>
                                <View style={styles.txInfo}>
                                    <Text style={styles.txTitle}>{tx.title}</Text>
                                    <Text style={styles.txDate}>{tx.date || new Date(tx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                                </View>
                                <Text style={[styles.txAmount, { color: tx.type === 'credit' ? '#4CAF50' : '#E91E63' }]}>
                                    {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount?.toLocaleString('en-IN')}
                                </Text>
                            </View>
                            {index < transactions.length - 1 && <Divider style={styles.divider} />}
                        </React.Fragment>
                    ))
                )}
            </Surface>

            <View style={styles.payoutCard}>
                <IconButton icon="clock-check-outline" iconColor="#0F4C81" size={28} />
                <View style={styles.payoutInfo}>
                    <Text style={styles.payoutTitle}>Payout Cycle</Text>
                    <Text style={styles.payoutDate}>Auto-withdrawals are processed on the 1st and 15th of every month.</Text>
                </View>
            </View>

            <Portal>
                <Modal
                    visible={addMoneyModalVisible}
                    onDismiss={() => !isPaying && setAddMoneyModalVisible(false)}
                    contentContainerStyle={styles.modalStyle}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Title style={styles.modalTitle}>Add Money to Wallet</Title>
                            <IconButton icon="close" size={20} onPress={() => setAddMoneyModalVisible(false)} disabled={isPaying} />
                        </View>
                        <Text style={styles.modalSubtitle}>Enter the amount you want to add from your bank account.</Text>
                        
                        <TextInput
                            label="Amount (₹)"
                            value={amount}
                            onChangeText={setAmount}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.amountInput}
                            activeOutlineColor="#0F4C81"
                            placeholder="Min ₹100"
                            disabled={isPaying}
                        />

                        <View style={styles.presetAmounts}>
                            {[500, 1000, 2000, 5000].map(val => (
                                <Button 
                                    key={val} 
                                    mode="outlined" 
                                    style={styles.presetBtn}
                                    onPress={() => setAmount(val.toString())}
                                    disabled={isPaying}
                                >
                                    +₹{val}
                                </Button>
                            ))}
                        </View>

                        <Button 
                            mode="contained" 
                            onPress={handleAddMoney} 
                            style={styles.payBtn}
                            buttonColor="#0F4C81"
                            loading={isPaying}
                            disabled={isPaying}
                        >
                            {isPaying ? 'Processing...' : 'Proceed to Pay'}
                        </Button>

                        <View style={styles.secureBadge}>
                            <MaterialCommunityIcons name="shield-check" size={16} color="#4CAF50" />
                            <Text style={styles.secureText}>100% Secure SSL Encrypted Payment</Text>
                        </View>
                    </View>
                </Modal>
            </Portal>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFF', padding: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFF' },
    walletHeader: { 
        backgroundColor: '#0F4C81', 
        borderRadius: 25, 
        padding: 25, 
        marginBottom: 25,
        marginTop: 10
    },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    walletLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
    balanceText: { color: 'white', fontSize: 36, fontWeight: 'bold', marginTop: 5, marginBottom: 20 },
    actionButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    actionBtn: { flex: 0.48, borderRadius: 12, paddingVertical: 4 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    statCard: { width: '48%', backgroundColor: 'white', borderRadius: 15, elevation: 1 },
    statLabel: { fontSize: 11, color: '#666' },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 5 },
    transactionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    transactionContainer: { backgroundColor: 'white', borderRadius: 20, paddingHorizontal: 15 },
    transactionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
    iconBg: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    txInfo: { flex: 1 },
    txTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    txDate: { fontSize: 11, color: '#999', marginTop: 2 },
    txAmount: { fontSize: 16, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#F0F0F0' },
    payoutCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 25, 
        backgroundColor: '#E3F2FD', 
        borderRadius: 15, 
        paddingRight: 20,
        paddingVertical: 10
    },
    payoutInfo: { flex: 1 },
    payoutTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F4C81' },
    payoutDate: { fontSize: 11, color: '#0F4C81', opacity: 0.7, marginTop: 2 },
    modalStyle: { backgroundColor: 'white', margin: 20, borderRadius: 20, overflow: 'hidden' },
    modalContent: { padding: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    modalTitle: { color: '#333', fontWeight: 'bold' },
    modalSubtitle: { fontSize: 12, color: '#666', marginBottom: 20 },
    amountInput: { marginBottom: 15, backgroundColor: 'white', fontSize: 18 },
    presetAmounts: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 25 },
    presetBtn: { borderRadius: 8, borderColor: '#EEE' },
    payBtn: { borderRadius: 12, paddingVertical: 8 },
    secureBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    secureText: { fontSize: 10, color: '#666', marginLeft: 5 }
});

export default WalletScreen;
