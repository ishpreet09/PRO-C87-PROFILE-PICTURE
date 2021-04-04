import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { TabNavigator } from './AppTabNavigator';
import SettingScreen from '../screens/settingsScreen';
import CustomSideBarMenu  from './CustomSideBarMenu';
import MyDonationScreen from '../screens/MyDonationsScreen';
import NotificationScreen from '../screens/NotificationScreen'
import MyReceivedBooksScreen from '../screens/MyReceivedBooksScreen';

export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : TabNavigator
    },
    Donations:{
      screen:MyDonationScreen
    },
    Setting:{
      screen : SettingScreen

    },
    
    MyReceivedBooks :{
      screen: MyReceivedBooksScreen
    },

    Notification:{
      screen:NotificationScreen
    }
  },
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })
