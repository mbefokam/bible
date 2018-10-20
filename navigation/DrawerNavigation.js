import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView,Dimensions,Image, Text, Platform } from 'react-native';
import {createStackNavigator,createDrawerNavigator, DrawerItems} from 'react-navigation';
import {Header, Left, Right, Icon} from 'native-base';

import BibleVersion from '../screens/listeDesVersionsDeLaBible/BibleVersion'
import Playlists from '../screens/youtube/Playlists';


const CustemDrawerComponent = (props) =>(
  <SafeAreaView style={{flex: 1}}>
    <View style={{height:150, backgroundColor:'white', alignItems: 'center',justifyContent: 'center'}}>
      <Image source={require('../logos/laSaintete2018logo.png')} style={{height: 140, width: 250}}/>
    </View>
   <ScrollView>
     <DrawerItems {...props} />
   </ScrollView>
  </SafeAreaView>
)

export default AppDrawerNavigator = createDrawerNavigator({
  Bible: BibleVersion,
  Youtube: Playlists
},
{
  contentComponent: CustemDrawerComponent,
  contentOptions:{
    activeTintColor: 'blue',
  }
})
