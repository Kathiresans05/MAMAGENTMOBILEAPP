import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Title, Button, Card, IconButton, Surface, ActivityIndicator, List, Divider } from 'react-native-paper';
import { Alert } from 'react-native';
import apiClient from '../../api/client';

const TasksScreen = ({ navigation }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTasks = async () => {
        try {
            const res = await apiClient.get('/agent/tasks');
            setTasks(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error('Failed to fetch tasks', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTasks();
    };

    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;

    if (loading && !refreshing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0F4C81" />
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.content}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* Quick Stats Header */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{tasks.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{pendingTasks}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{completedTasks}</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                </View>
            </View>

            {tasks.length === 0 ? (
                /* Empty State Illustration */
                <View style={styles.emptyContainer}>
                    <Surface style={styles.iconCircle} elevation={1}>
                        <IconButton icon="clipboard-text-outline" size={60} iconColor="#0F4C81" />
                    </Surface>
                    <Title style={styles.emptyTitle}>No tasks assigned yet</Title>
                    <Text style={styles.emptySub}>
                        Admin will assign tasks soon. Meanwhile, you can continue your work.
                    </Text>
                </View>
            ) : (
                <View style={{ width: '100%' }}>
                    {tasks.map((task, index) => (
                        <Card key={task._id || index} style={styles.taskCard} elevation={1}>
                            <Card.Title
                                title={task.title}
                                subtitle={`${task.businessName || task.sub} • ${task.status}`}
                                left={props => <Avatar.Icon {...props} icon={task.icon || "clipboard-check"} style={{ backgroundColor: task.status === 'Completed' ? '#4CAF50' : '#F4B400' }} />}
                                right={props => <IconButton {...props} icon="chevron-right" onPress={() => {}} />}
                            />
                            <Card.Content>
                                <Text style={{ fontSize: 12, color: '#666' }}>{task.description || 'No additional details provided.'}</Text>
                            </Card.Content>
                        </Card>
                    ))}
                </View>
            )}

            {/* Action Buttons Cards */}
            <View style={styles.actionsContainer}>
                <Title style={{ fontSize: 16, marginBottom: 10, alignSelf: 'flex-start' }}>Quick Actions</Title>
                <Card style={styles.actionCard} elevation={1} onPress={() => navigation.navigate('TieUpRequest')}>
                    <Card.Title 
                        title="Add Tie-up Request" 
                        left={props => <IconButton {...props} icon="store-plus" iconColor="#F4B400" />}
                        right={props => <IconButton {...props} icon="chevron-right" />}
                    />
                </Card>
                <Card style={styles.actionCard} elevation={1} onPress={() => navigation.navigate('ExploreServices')}>
                    <Card.Title 
                        title="Explore Services" 
                        left={props => <IconButton {...props} icon="briefcase-search" iconColor="#0F4C81" />}
                        right={props => <IconButton {...props} icon="chevron-right" />}
                    />
                </Card>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFF' },
    content: { padding: 20, alignItems: 'center' },
    statsRow: { 
        flexDirection: 'row', 
        backgroundColor: 'white', 
        borderRadius: 15, 
        padding: 15, 
        width: '100%', 
        justifyContent: 'space-around',
        elevation: 2,
        marginBottom: 30
    },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#0F4C81' },
    statLabel: { fontSize: 12, color: '#666' },
    statDivider: { width: 1, height: '100%', backgroundColor: '#EEE' },
    emptyContainer: { alignItems: 'center', marginVertical: 20 },
    iconCircle: { 
        backgroundColor: 'white', 
        borderRadius: 50, 
        marginBottom: 20,
    },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    emptySub: { textAlign: 'center', color: '#666', marginTop: 10, paddingHorizontal: 20, lineHeight: 20 },
    actionsContainer: { width: '100%', marginTop: 30 },
    actionCard: { backgroundColor: 'white', marginBottom: 12, borderRadius: 12 },
    taskCard: { width: '100%', backgroundColor: 'white', marginBottom: 12, borderRadius: 12 },
});

export default TasksScreen;
