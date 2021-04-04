import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/homeScreen';
import RecieverDetailsScreen  from '../screens/RecieverDetailsScreen';

export const AppStackNavigator = createStackNavigator({
 HomeScreenList : {
    screen : HomeScreen,
    navigationOptions:{
      headerShown : false
    }
  },
  RecieverDetails : {
    screen : RecieverDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  },

},
  {
    initialRouteName: 'HomeScreenList'
  }
);