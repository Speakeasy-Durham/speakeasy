import React from 'react';
import { Platform, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
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

// const navigationOptionsBack = ({ navigation }) => ({
//     headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
// })

const Tabs = TabNavigator({
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerTitle: 'Speakeasy',
        headerTintColor: '#fffafa',
        headerStyle: {
          backgroundColor: '#ff6347',
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
        headerTitle: 'You',
        headerTintColor: '#fffafa',
        headerStyle: {
          backgroundColor: '#ff6347',
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
            iconName = 'md-home';
            break;
          case 'Recording':
            iconName = 'md-mic';
            break;
          case 'Profile':
            iconName = 'md-person';
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
    // navigationOptions: {
    //
    // }
  },
},
{
  mode: 'modal',
  headerMode: 'none',
});
