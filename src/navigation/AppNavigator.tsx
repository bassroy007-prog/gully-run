import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { StoryScreen } from '../screens/StoryScreen';
import { HeroesScreen } from '../screens/HeroesScreen';
import { EventsScreen } from '../screens/EventsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { GameScreen } from '../screens/GameScreen';
import { ShopScreen } from '../screens/ShopScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { MissionsScreen } from '../screens/MissionsScreen';
import { COLORS, FONTS } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TABS = [
  { name: 'Home',    emoji: '🏠', component: HomeScreen   },
  { name: 'Story',   emoji: '📖', component: StoryScreen  },
  { name: 'Heroes',  emoji: '🦸', component: HeroesScreen },
  { name: 'Events',  emoji: '🎉', component: EventsScreen },
  { name: 'Profile', emoji: '👤', component: ProfileScreen },
];

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: COLORS.saffron,
      tabBarInactiveTintColor: 'rgba(255,255,255,0.35)',
      tabBarShowLabel: true,
      tabBarLabelStyle: styles.tabLabel,
    }}
  >
    {TABS.map(item => (
      <Tab.Screen
        key={item.name}
        name={item.name}
        component={item.component}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{item.emoji}</Text>
          ),
        }}
      />
    ))}
  </Tab.Navigator>
);

export const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Game" component={GameScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Shop" component={ShopScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Missions" component={MissionsScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#08081A',
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderTopWidth: 1,
    paddingTop: 6,
    paddingBottom: 8,
    height: 72,
  },
  tabLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    marginTop: 2,
  },
});
