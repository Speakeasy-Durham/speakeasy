import React from 'react';
import { Platform, Button } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons/';
import {
  TabNavigator,
  TabBarBottom,
  StackNavigator,
  HeaderBackButton,
} from 'react-navigation';
import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RecordingScreen from '../screens/RecordingScreen';

const Tabs = TabNavigator({
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerTitle: 'Home',
        headerTintColor: '#FCFCFC',
        headerStyle: {
          backgroundColor: Colors.primaryRed,
        }
      }
    },
    Recording: {
      screen: RecordingScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarOnPress: (tab, jumpToIndex) => {
          navigation.navigate('RecordingScreenModal');
        },
      })
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        headerTitle: 'Profile',
        headerTintColor: '#FCFCFC',
        headerStyle: {
          backgroundColor: Colors.primaryRed,
        }
      }
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
              ? `home${focused ? '' : '-outline'}`
              : 'home';
            break;
          case 'Recording':
            iconName = Platform.OS === 'ios'
              ? `microphone${focused ? '' : '-outline'}`
              : 'microphone';
            break;
          case 'Profile':
            iconName = Platform.OS === 'ios'
              ? `account${focused ? '' : '-outline'}`
              : 'account';
        }
        return (
          <MaterialCommunityIcons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.fontColorDark : Colors.fontColorLight}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      showLabel: false,
      style: {
        backgroundColor: 'white',
      }
    },
    animationEnabled: false,
    swipeEnabled: false,
  }
);

export default StackNavigator({
  Tabs: {
    screen: Tabs,
  },
  RecordingScreenModal: {
    screen: RecordingScreen,
  },
},
{
  mode: 'modal',
  headerMode: 'none',
});
