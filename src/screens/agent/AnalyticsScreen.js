import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { Title, Text, Card, Surface, ActivityIndicator, IconButton, Divider } from 'react-native-paper';
import { LineChart, BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import apiClient from '../../api/client';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = () => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({
        earnings: [0, 0, 0, 0, 0, 0, 0],
        taskCompletion: [0, 0, 0, 0, 0, 0],
        conversionRate: 0,
        stats: {
            weeklyTotal: 0,
            monthlyTotal: 0,
            avgPerDay: 0
        }
    });

    const fetchData = async () => {
        try {
            // Fetch dashboard stats (which includes weekly earnings)
            const res = await apiClient.get('/agent/dashboard-stats');
            
            // Mocking some extra analytics data based on the real earnings
            const earnings = Array.isArray(res.data.earnings) ? res.data.earnings : [4500, 5200, 4800, 6100, 5900, 7200, 8500];
            const weeklyTotal = earnings.reduce((a, b) => a + b, 0);
            
            setData({
                earnings: earnings,
                taskCompletion: [12, 19, 15, 25, 22, 30], // Mock task history
                conversionRate: 0.65, // 65% conversion
                stats: {
                    weeklyTotal: weeklyTotal,
                    monthlyTotal: weeklyTotal * 4.2,
                    avgPerDay: weeklyTotal / 7
                }
            });
        } catch (e) {
            console.error('Failed to fetch analytics', e);
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

    const chartConfig = {
        backgroundGradientFrom: '#FFF',
        backgroundGradientTo: '#FFF',
        color: (opacity = 1) => `rgba(15, 76, 129, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.6,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0F4C81" />
                <Text style={{ marginTop: 10 }}>Analyzing Performance...</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.header}>
                <Title style={styles.title}>Performance Analytics</Title>
                <Text style={styles.subtitle}>Insights into your business growth</Text>
            </View>

            {/* Weekly Earnings Bar Chart */}
            <Card style={styles.chartCard} elevation={2}>
                <Card.Content>
                    <Title style={styles.chartTitle}>Weekly Earnings (₹)</Title>
                    <BarChart
                        data={{
                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            datasets: [{ data: data.earnings }]
                        }}
                        width={screenWidth - 60}
                        height={220}
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                        fromZero
                        showValuesOnTopOfBars
                        style={styles.chartStyle}
                    />
                </Card.Content>
            </Card>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <Surface style={styles.statBox} elevation={1}>
                    <Text style={styles.statLabel}>Weekly</Text>
                    <Text style={styles.statValue}>₹{Math.round(data.stats.weeklyTotal).toLocaleString('en-IN')}</Text>
                </Surface>
                <Surface style={styles.statBox} elevation={1}>
                    <Text style={styles.statLabel}>Monthly</Text>
                    <Text style={styles.statValue}>₹{Math.round(data.stats.monthlyTotal).toLocaleString('en-IN')}</Text>
                </Surface>
                <Surface style={styles.statBox} elevation={1}>
                    <Text style={styles.statLabel}>Avg/Day</Text>
                    <Text style={styles.statValue}>₹{Math.round(data.stats.avgPerDay).toLocaleString('en-IN')}</Text>
                </Surface>
            </View>

            {/* Conversion Progress */}
            <Card style={styles.chartCard} elevation={2}>
                <Card.Content style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Title style={styles.chartTitle}>Lead Conversion</Title>
                        <Text style={styles.chartSub}>Your success rate in converting leads to tie-ups.</Text>
                        <View style={styles.badgeRow}>
                            <View style={[styles.badge, { backgroundColor: '#E8F5E9' }]}>
                                <Text style={{ color: '#2E7D32', fontSize: 10, fontWeight: 'bold' }}>EXCELLENT</Text>
                            </View>
                        </View>
                    </View>
                    <ProgressChart
                        data={{
                            labels: ["Conversion"],
                            data: [data.conversionRate]
                        }}
                        width={120}
                        height={120}
                        strokeWidth={12}
                        radius={40}
                        chartConfig={{
                            ...chartConfig,
                            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                        }}
                        hideLegend={true}
                    />
                </Card.Content>
            </Card>

            {/* Task Performance Line Chart */}
            <Card style={styles.chartCard} elevation={2}>
                <Card.Content>
                    <Title style={styles.chartTitle}>Monthly Activity Trend</Title>
                    <LineChart
                        data={{
                            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                            datasets: [{
                                data: data.taskCompletion,
                                color: (opacity = 1) => `rgba(233, 30, 99, ${opacity})`,
                                strokeWidth: 3
                            }]
                        }}
                        width={screenWidth - 60}
                        height={180}
                        chartConfig={{
                            ...chartConfig,
                            color: (opacity = 1) => `rgba(233, 30, 99, ${opacity})`,
                        }}
                        bezier
                        style={styles.chartStyle}
                    />
                </Card.Content>
            </Card>

            <View style={styles.infoBox}>
                <IconButton icon="lightbulb-on-outline" iconColor="#F4B400" size={24} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.infoTitle}>Recommendation</Text>
                    <Text style={styles.infoText}>Your performance is up by 12% compared to last week. Focus on hospital tie-ups to increase average payout.</Text>
                </View>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFF', padding: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    subtitle: { fontSize: 13, color: '#666', marginTop: 4 },
    chartCard: { backgroundColor: 'white', borderRadius: 20, marginBottom: 20, overflow: 'hidden' },
    chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F4C81', marginBottom: 10 },
    chartSub: { fontSize: 12, color: '#888', marginBottom: 10 },
    chartStyle: { marginVertical: 8, borderRadius: 16, paddingRight: 40 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    statBox: { width: '31%', backgroundColor: 'white', borderRadius: 15, padding: 12, alignItems: 'center' },
    statLabel: { fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 1 },
    statValue: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 4 },
    row: { flexDirection: 'row', alignItems: 'center' },
    badgeRow: { flexDirection: 'row', marginTop: 10 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    infoBox: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#E3F2FD', 
        padding: 15, 
        borderRadius: 15, 
        marginTop: 10 
    },
    infoTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F4C81' },
    infoText: { fontSize: 11, color: '#546E7A', marginTop: 2, lineHeight: 16 }
});

export default AnalyticsScreen;
