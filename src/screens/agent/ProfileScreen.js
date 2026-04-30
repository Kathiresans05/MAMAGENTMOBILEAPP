import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Avatar, Title, Text, Card, List, IconButton, Badge, Divider, Surface } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const [isOnline, setIsOnline] = useState(true);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Top Profile Section */}
            <Surface style={styles.topSection} elevation={0}>
                <View style={styles.headerRow}>
                    <Avatar.Text 
                        size={80} 
                        label={user?.name?.substring(0, 2).toUpperCase() || 'AG'} 
                        style={{ backgroundColor: '#0F4C81' }}
                    />
                    <View style={styles.headerInfo}>
                        <View style={styles.nameRow}>
                            <Title style={styles.agentName}>{user?.name}</Title>
                            <Badge style={[styles.statusBadge, { backgroundColor: user?.isActive ? '#4CAF50' : '#F4B400' }]}>
                                {user?.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                        </View>
                        <Text style={styles.agentId}>ID: AG-{user?.id?.substring(0, 8).toUpperCase() || 'UNKNOWN'}</Text>
                        <Text style={styles.agentRole}>{user?.level?.toUpperCase() || 'PINCODE'} AGENT</Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <IconButton icon="map-marker" size={16} iconColor="#0F4C81" style={{ margin: 0 }} />
                    <Text style={styles.locationText}>
                        {user?.assignedArea || 'Pincode: 600001 • Chennai, TN'}
                    </Text>
                </View>

                <View style={styles.onlineToggleRow}>
                    <Text style={styles.toggleLabel}>Online Status</Text>
                    <Switch 
                        value={isOnline} 
                        onValueChange={setIsOnline} 
                        trackColor={{ false: '#767577', true: '#0F4C81' }}
                        thumbColor="#fff"
                    />
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>24</Text>
                        <Text style={styles.statLabel}>Tie-ups</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>156</Text>
                        <Text style={styles.statLabel}>Tasks</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>₹{user?.balance || '0'}</Text>
                        <Text style={styles.statLabel}>Earnings</Text>
                    </View>
                </View>
            </Surface>

            {/* Menu Sections */}
            <View style={styles.menuContainer}>
                <MenuSection title="Financial & Performance">
                    <MenuItem icon="wallet" title="Wallet & Earnings" />
                    <MenuItem icon="chart-areaspline" title="Performance Analytics" />
                </MenuSection>

                <MenuSection title="Business Operations">
                    <MenuItem icon="map" title="My Area Details" />
                    <MenuItem icon="history" title="My Activities" subtitle="Daily updates history" />
                    <MenuItem icon="store-plus" title="Tie-up Requests" />
                    <MenuItem icon="clipboard-list" title="Tasks" />
                </MenuSection>

                <MenuSection title="Account & Support">
                    <MenuItem icon="bell" title="Notifications" />
                    <MenuItem icon="file-document" title="Documents & Verification" />
                    <MenuItem icon="cog" title="Settings" />
                    <MenuItem icon="help-circle" title="Support / Help" />
                </MenuSection>

                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <IconButton icon="logout" iconColor="#E91E63" size={20} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const MenuSection = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Card style={styles.menuCard} elevation={1}>
            {children}
        </Card>
    </View>
);

const MenuItem = ({ icon, title, subtitle, onPress }) => (
    <List.Item
        title={title}
        description={subtitle}
        left={props => <List.Icon {...props} icon={icon} color="#0F4C81" />}
        right={props => <List.Icon {...props} icon="chevron-right" color="#CCC" />}
        onPress={onPress || (() => {})}
        titleStyle={styles.menuTitle}
        descriptionStyle={styles.menuSubtitle}
        style={styles.listItem}
    />
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFF' },
    topSection: { 
        backgroundColor: 'white', 
        padding: 20, 
        borderBottomLeftRadius: 30, 
        borderBottomRightRadius: 30,
        paddingTop: 20,
    },
    headerRow: { flexDirection: 'row', alignItems: 'center' },
    headerInfo: { marginLeft: 15, flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    agentName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    statusBadge: { alignSelf: 'center', borderRadius: 4, height: 20 },
    agentId: { fontSize: 12, color: '#666', marginTop: 2 },
    agentRole: { fontSize: 11, fontWeight: 'bold', color: '#0F4C81', marginTop: 4, letterSpacing: 1 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15, backgroundColor: '#F0F4F8', borderRadius: 10, paddingRight: 10 },
    locationText: { fontSize: 12, color: '#555', flex: 1 },
    onlineToggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
    toggleLabel: { fontSize: 14, fontWeight: '500', color: '#333' },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    statCard: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
    menuContainer: { padding: 20 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#888', marginBottom: 10, marginLeft: 5, textTransform: 'uppercase', letterSpacing: 1 },
    menuCard: { backgroundColor: 'white', borderRadius: 15, overflow: 'hidden' },
    listItem: { paddingVertical: 4 },
    menuTitle: { fontSize: 14, fontWeight: '500', color: '#333' },
    menuSubtitle: { fontSize: 11, color: '#999' },
    logoutButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#FFF', 
        borderRadius: 15,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#FFE4E8'
    },
    logoutText: { color: '#E91E63', fontWeight: 'bold', fontSize: 16, marginRight: 15 },
});

export default ProfileScreen;
