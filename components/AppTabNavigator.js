import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity,TextInput, Alert, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import HomeScreen from '../screens/homeScreen';
import ExchangeScreen from '../screens/exchange';
import {AppStackNavigator} from './AppStackNavigator'

export const TabNavigator = createBottomTabNavigator({
 home:{screen:AppStackNavigator,
 navigationOptions:{
     tabBarIcon:
     <Image
     source={require("../assets/home.jpg")}
     style={{width:30, height:32,marginBottom:1}}
     />,
     tabBarLabel:"Home"

 }},

 exchange:{screen:ExchangeScreen,
 navigationOptions:{
     tabBarIcon:
     <Image
     source={require("../assets/exchange.jpg")}
     style={{width:35, height:35}}
     />,
     tabBarLabel:"Exchange"
 }}
 
})