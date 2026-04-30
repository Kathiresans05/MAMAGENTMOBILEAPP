import React from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LoginScreen from '../screens/auth/LoginScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import AgentDashboard from '../screens/agent/AgentDashboard';
import PincodeSelection from '../screens/agent/PincodeSelection';
import TieUpRequest from '../screens/agent/TieUpRequest';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import { Text, Surface, IconButton } from 'react-native-paper';

import ProfileScreen from '../screens/agent/ProfileScreen';
import TasksScreen from '../screens/agent/TasksScreen';
import NetworkScreen from '../screens/agent/NetworkScreen';

const BrandedHeader = () => (
    <Surface style={{ 
        height: 100, 
        backgroundColor: '#050A18', // Dark background from logo
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 15,
        paddingTop: 35, // Added padding for status bar/notch
    }} elevation={4}>
        <Image 
            source={require('../assets/logo.jpeg')} 
            style={{ width: 80, height: 30 }} 
            resizeMode="contain"
        />
        
        <View style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 18, fontWeight: '900', color: '#1E88E5' }}>FORGE </Text>
                <Text style={{ fontSize: 18, fontWeight: '900', color: '#FFC107' }}>INDIA</Text>
            </View>
            <Text style={{ fontSize: 9, color: 'white', fontWeight: 'bold', letterSpacing: 4, marginTop: -2 }}>CONNECT</Text>
        </View>

        <IconButton 
            icon="bell-outline" 
            mode="contained" 
            containerColor="rgba(255,255,255,0.1)" 
            iconColor="white" 
            size={18}
            onPress={() => {}} 
        />
    </Surface>
);

const AgentTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Dashboard') iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
                    else if (route.name === 'Tasks') iconName = focused ? 'clipboard-text' : 'clipboard-text-outline';
                    else if (route.name === 'Network') iconName = focused ? 'file-tree' : 'file-tree-outline';
                    else if (route.name === 'Profile') iconName = focused ? 'account' : 'account-outline';
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#0F4C81',
                tabBarInactiveTintColor: 'gray',
                header: () => <BrandedHeader />,
            })}
        >
            <Tab.Screen name="Dashboard" component={AgentDashboard} />
            <Tab.Screen name="Tasks" component={TasksScreen} />
            <Tab.Screen name="Network" component={NetworkScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0F4C81" />
        </View>
    );

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: true }}>
                {!user ? (
                    <Stack.Screen name="Login" component={LoginScreen} />
                ) : user.role === 'admin' ? (
                    <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Panel' }} />
                ) : (
                    <>
                        <Stack.Screen name="AgentHome" component={AgentTabs} options={{ headerShown: false }} />
                        <Stack.Screen name="PincodeSelection" component={PincodeSelection} options={{ title: 'Select Area' }} />
                        <Stack.Screen name="TieUpRequest" component={TieUpRequest} options={{ title: 'New Tie-up' }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
