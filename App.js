import React from 'react';
import { createAppContainer, createSwitchNavigator,} from 'react-navigation';
import LoginScreen from './screens/loginScreen';
import {AppDrawerNavigator} from './components/AppDrawerNavigator'

export default function App() {
  return (
    <AppContainer/>
  );
}


const switchNavigator = createSwitchNavigator({
  login:{screen: LoginScreen},
  Drawer:{screen: AppDrawerNavigator},
  
})

const AppContainer =  createAppContainer(switchNavigator);
