import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/auth';

// Import screens
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import CasesScreen from '../screens/CasesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UploadScreen from '../screens/UploadScreen';
import ChatsScreen from '../screens/ChatsScreen';
import ChatScreen from '../screens/ChatScreen';

import {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
  MainStackParamList
} from '../types/navigation';

// Create the navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Auth stack navigator
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

// Main tab navigator
function MainTabNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={({ route }: { route: { name: keyof MainTabParamList } }) => ({
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cases') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'Upload') {
            iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
          } else if (route.name === 'Chats') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else {
            iconName = 'help-outline'; // Fallback
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1A5D1A',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen name="Cases" component={CasesScreen} />
      <MainTab.Screen name="Upload" component={UploadScreen} />
      <MainTab.Screen name="Chats" component={ChatsScreen} />
      <MainTab.Screen name="Profile" component={ProfileScreen} />
    </MainTab.Navigator>
  );
}

// Main stack navigator that includes tabs and modal screens
function MainNavigator() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen 
        name="MainTabs" 
        component={MainTabNavigator} 
        options={{ headerShown: false }}
      />
      <MainStack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  );
}

// Root navigator that handles auth state
export default function Navigation() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1A5D1A" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 