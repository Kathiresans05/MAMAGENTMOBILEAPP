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

import AgentListScreen from '../screens/admin/AgentListScreen';
import TieUpRequestsScreen from '../screens/admin/TieUpRequestsScreen';
import ReportsScreen from '../screens/admin/ReportsScreen';
import SettingsScreen from '../screens/admin/SettingsScreen';
import AddAgentScreen from '../screens/admin/AddAgentScreen';
import JoiningFeesScreen from '../screens/admin/JoiningFeesScreen';
import PincodeMasterScreen from '../screens/admin/PincodeMasterScreen';


const BrandedHeader = () => (
    <Surface style={{ 
        height: 70, 
        backgroundColor: '#050A18',
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 15,
        paddingTop: 15,
    }} elevation={4}>
        <Image 
            source={require('../assets/logo.jpeg')} 
            style={{ width: 50, height: 22 }} 
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

const AdminTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Overview') iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
                    else if (route.name === 'Agents') iconName = focused ? 'account-group' : 'account-group-outline';
                    else if (route.name === 'Tie-ups') iconName = focused ? 'store' : 'store-outline';
                    else if (route.name === 'Reports') iconName = focused ? 'chart-bar' : 'chart-bar';
                    else if (route.name === 'Settings') iconName = focused ? 'cog' : 'cog-outline';
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#0A66C2',
                tabBarInactiveTintColor: 'gray',
                header: () => <BrandedHeader />,
                tabBarStyle: { backgroundColor: '#FFFFFF', borderTopWidth: 0, elevation: 10, shadowOpacity: 0.1 }
            })}
        >
            <Tab.Screen name="Overview" component={AdminDashboard} />
            <Tab.Screen name="Agents" component={AgentListScreen} />
            <Tab.Screen name="Tie-ups" component={TieUpRequestsScreen} />
            <Tab.Screen name="Reports" component={ReportsScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
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
                    <>
                        <Stack.Screen name="AdminHome" component={AdminTabs} options={{ headerShown: false }} />
                        <Stack.Screen name="AddAgent" component={AddAgentScreen} options={{ title: 'Add New Agent' }} />
                        <Stack.Screen name="JoiningFees" component={JoiningFeesScreen} options={{ title: 'Joining Fees' }} />
                        <Stack.Screen name="PincodeMaster" component={PincodeMasterScreen} options={{ title: 'Pincode Master' }} />
                    </>
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
