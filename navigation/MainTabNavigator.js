import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RecordingScreen from '../screens/RecordingScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import NotificationScreen from '../screens/NotificationScreen';

export default TabNavigator({
    Home: {
      screen: HomeScreen,
    },
    Discover: {
      screen: DiscoverScreen,
    },
    Recording: {
      screen: RecordingScreen,
    },
    Notifications: {
      screen: NotificationScreen,
    },
    Profile: {
      screen: ProfileScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Home':
            iconName = Platform.OS === 'ios'
              ? `ios-list${focused ? '' : '-outline'}`
              : 'md-information-circle';
            break;
          case 'Discover':
              iconName = Platform.OS === 'ios'
                ? `ios-search${focused ? '' : '-outline'}`
                : 'md-options';
              break;
          case 'Recording':
            iconName = Platform.OS === 'ios'
              ? `ios-microphone${focused ? '' : '-outline'}`
              : 'md-link';
            break;
          case 'Notifications':
            iconName = Platform.OS === 'ios'
              ? `ios-heart${focused ? '' : '-outline'}`
              : 'md-link';
          break;
          case 'Profile':
            iconName = Platform.OS === 'ios'
              ? `ios-person${focused ? '' : '-outline'}`
              : 'md-link';
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
