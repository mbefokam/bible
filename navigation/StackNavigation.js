import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView,Dimensions,Image, Text, Platform } from 'react-native';
import {createStackNavigator,createDrawerNavigator, DrawerItems} from 'react-navigation';
import {Header, Left, Right, Icon} from 'native-base';

import BibleVersion from '../screens/listeDesVersionsDeLaBible/BibleVersion'
import LivresDeLaBible from '../screens/listeDesLivres/ListeDesLivres';
import ListeDesChapitres from '../screens/listeDesChapitres/ListeDesChapitres';
import ListOfChapiterVerses from '../screens/listOfChapiterVerses/ListOfChapiterVerses';
import SearchVerses from '../screens/searchVerses/SearchVerses';


export default AppStackNavigator = createStackNavigator({
    BibleVersions : BibleVersion,
    BibleBooks: LivresDeLaBible,
    Chapitres: ListeDesChapitres,
    Versets: ListOfChapiterVerses,

})
