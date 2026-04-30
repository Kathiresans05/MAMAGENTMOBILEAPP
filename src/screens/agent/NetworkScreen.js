import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Title, Button, Card, IconButton, ProgressBar, Surface, List, Divider } from 'react-native-paper';

const NetworkScreen = () => {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Network Progress Section */}
            <Card style={styles.progressCard} elevation={2}>
                <Card.Content>
                    <View style={styles.progressHeader}>
                        <Title style={styles.progressTitle}>Network Completion</Title>
                        <Text style={styles.progressValue}>0%</Text>
                    </View>
                    <ProgressBar progress={0} color="#0F4C81" style={styles.progressBar} />
                    <Text style={styles.progressSub}>Add your first tie-up to start your network</Text>
                </Card.Content>
            </Card>

            {/* Empty State Illustration */}
            <View style={styles.emptyContainer}>
                <Surface style={styles.iconCircle} elevation={1}>
                    <IconButton icon="hub" size={60} iconColor="#0F4C81" />
                </Surface>
                <Title style={styles.emptyTitle}>No network connections yet</Title>
                <Text style={styles.emptySub}>
                    Start building your area network by adding service tie-ups.
                </Text>
            </View>

            {/* Area Insights Section */}
            <Title style={styles.sectionTitle}>Area Insights (Your Territory)</Title>
            <Card style={styles.insightsCard} elevation={1}>
                <List.Item
                    title="Hospitals"
                    description="12 available (0 connected)"
                    left={props => <List.Icon {...props} icon="hospital-building" color="#E91E63" />}
                />
                <Divider />
                <List.Item
                    title="Hostels"
                    description="8 available (0 connected)"
                    left={props => <List.Icon {...props} icon="home-group" color="#F4B400" />}
                />
                <Divider />
                <List.Item
                    title="Bus Services"
                    description="5 available (0 connected)"
                    left={props => <List.Icon {...props} icon="bus" color="#0F4C81" />}
                />
            </Card>

            {/* Suggestion Card */}
            <Surface style={styles.suggestionCard} elevation={0}>
                <IconButton icon="lightbulb-outline" iconColor="#F4B400" size={24} />
                <Text style={styles.suggestionText}>
                    Tip: Start with nearby hospitals to build your network faster and earn higher commissions.
                </Text>
            </Surface>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                <Button 
                    mode="contained" 
                    icon="plus" 
                    style={styles.actionBtn}
                    buttonColor="#0F4C81"
                    onPress={() => {}}
                >
                    Add Tie-up
                </Button>
                <View style={styles.rowActions}>
                    <Button 
                        mode="outlined" 
                        icon="magnify" 
                        style={styles.halfBtn}
                        textColor="#0F4C81"
                        onPress={() => {}}
                    >
                        Explore
                    </Button>
                    <Button 
                        mode="outlined" 
                        icon="map-marker-radius" 
                        style={styles.halfBtn}
                        textColor="#0F4C81"
                        onPress={() => {}}
                    >
                        My Area
                    </Button>
                </View>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFF', padding: 20 },
    progressCard: { backgroundColor: 'white', borderRadius: 15, marginBottom: 25 },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    progressTitle: { fontSize: 16, fontWeight: 'bold' },
    progressValue: { fontSize: 18, fontWeight: 'bold', color: '#0F4C81' },
    progressBar: { height: 8, borderRadius: 4 },
    progressSub: { fontSize: 11, color: '#999', marginTop: 10 },
    emptyContainer: { alignItems: 'center', marginVertical: 20 },
    iconCircle: { backgroundColor: 'white', borderRadius: 50, marginBottom: 20 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    emptySub: { textAlign: 'center', color: '#666', marginTop: 8, paddingHorizontal: 30, fontSize: 13 },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 },
    insightsCard: { backgroundColor: 'white', borderRadius: 15, overflow: 'hidden' },
    suggestionCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#FFF8E1', 
        padding: 10, 
        borderRadius: 12, 
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#FFE082'
    },
    suggestionText: { flex: 1, fontSize: 12, color: '#795548', lineHeight: 18 },
    actionsContainer: { marginTop: 30 },
    actionBtn: { borderRadius: 10, paddingVertical: 5, marginBottom: 12 },
    rowActions: { flexDirection: 'row', justifyContent: 'space-between' },
    halfBtn: { width: '48%', borderRadius: 10 },
});

export default NetworkScreen;
