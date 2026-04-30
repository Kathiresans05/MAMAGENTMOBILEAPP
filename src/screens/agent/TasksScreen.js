import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Title, Button, Card, IconButton, Surface, useTheme } from 'react-native-paper';

const TasksScreen = ({ navigation }) => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Quick Stats Header */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statLabel}>Today</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statLabel}>Tie-ups</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
            </View>

            {/* Empty State Illustration */}
            <View style={styles.emptyContainer}>
                <Surface style={styles.iconCircle} elevation={1}>
                    <IconButton icon="clipboard-text-outline" size={60} iconColor="#0F4C81" />
                </Surface>
                <Title style={styles.emptyTitle}>No tasks assigned yet</Title>
                <Text style={styles.emptySub}>
                    Admin will assign tasks soon. Meanwhile, you can continue your work.
                </Text>
            </View>

            {/* Action Buttons Cards */}
            <View style={styles.actionsContainer}>
                <Card style={styles.actionCard} elevation={1} onPress={() => {}}>
                    <Card.Title 
                        title="Add Tie-up Request" 
                        left={props => <IconButton {...props} icon="store-plus" iconColor="#F4B400" />}
                        right={props => <IconButton {...props} icon="chevron-right" />}
                    />
                </Card>
                <Card style={styles.actionCard} elevation={1} onPress={() => {}}>
                    <Card.Title 
                        title="Explore Services" 
                        left={props => <IconButton {...props} icon="briefcase-search" iconColor="#0F4C81" />}
                        right={props => <IconButton {...props} icon="chevron-right" />}
                    />
                </Card>
                <Card style={styles.actionCard} elevation={1} onPress={() => {}}>
                    <Card.Title 
                        title="Submit Daily Activity" 
                        left={props => <IconButton {...props} icon="calendar-check" iconColor="#4CAF50" />}
                        right={props => <IconButton {...props} icon="chevron-right" />}
                    />
                </Card>
            </View>

            <Button 
                mode="contained" 
                icon="refresh" 
                style={styles.refreshBtn}
                buttonColor="#0F4C81"
                onPress={() => {}}
            >
                Check for new tasks
            </Button>

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
    refreshBtn: { marginTop: 30, borderRadius: 10, width: '100%', paddingVertical: 5 },
});

export default TasksScreen;
