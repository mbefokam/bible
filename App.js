import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView,Dimensions,Image, Text, Platform } from 'react-native';
import {createStackNavigator,createDrawerNavigator, DrawerItems} from 'react-navigation';
import {Header,Icon, Left, Right} from 'native-base'; 
import Versions from './screens/versions/Versions';
import Livres from './screens/livres/Livres';
import Chapitres from './screens/chapitres/Chapitres';
import Versets from './screens/versets/Versets';
import SearchVerses from './screens/searchVerses/SearchVerses';
import Playlists from './screens/youtube/Playlists';
import Chat from './screens/chat/Chat';
import Quiz from './screens/quiz/Quiz';
import Contact from './screens/contact/Contact';

import CreateNewVersion from './database/CreateNewVersion';
console.disableYellowBox = ["Unable to symbolicate"]
export default class App extends Component{

  constructor(){
    super();
  }

  render() {
      return (
           <AppDrawerNavigator />
      );
    }
}

const AppStackNavigator = createStackNavigator({
    BibleVersions : Versions,
    BibleBooks: Livres,
    Chapitres: Chapitres,
    Versets: Versets,

})

const CustemDrawerComponent = (props) =>(
  <SafeAreaView style={{flex: 1}}>
    <View style={{height:(Platform.OS) === 'ios' ? 150 : 190, backgroundColor:'white', alignItems: 'center',justifyContent: 'center'}}>
      <Image source={require('./logos/laSaintete2018logo.png')} style={{height: 140, width: 250}}/>
    </View>
   <ScrollView>
     <DrawerItems {...props} />
   </ScrollView>
  </SafeAreaView>
)


//let EtudeBiblique = " Etude Biblique";
const AppDrawerNavigator = createDrawerNavigator({
  Bible: {
      screen: AppStackNavigator,
      navigationOptions: {
        header: null,
        drawerLabel: 'La Bible Ostervald',
        drawerIcon:({tintColor})=>(
          <Icon name="ios-book"
          style={{width: 24, height: 24,fontSize: 24}}/>
        )
    },
  },
  EtudeBiblique: {
      screen: Playlists,
      navigationOptions: {
        header: null,
        drawerLabel: 'La Saintete FM/TV',
        drawerIcon:({tintColor})=>(
          <Icon name="ios-desktop"
          style={{width: 24, height: 24,fontSize: 24}}/>
        )
    },
    },
    Chat: {
        screen: Chat,
        navigationOptions: {
          header: null,
          drawerLabel: 'Chat',
          drawerIcon:({tintColor})=>(
            <Icon name="ios-chatbubbles"
            style={{width: 24, height: 24,fontSize: 24}}/>
          )
      },
      },
    Quiz: {
          screen: Quiz,
          navigationOptions: {
            header: null,
            drawerLabel: 'Quiz',
            drawerIcon:({tintColor})=>(
              <Icon name="ios-help-circle"
              style={{width: 24, height: 24,fontSize: 24}}/>
            )
        },
        },
    Contact: {
            screen: Contact,
            navigationOptions: {
              header: null,
              drawerLabel: 'Contact',
              drawerIcon:({tintColor})=>(
                <Icon name="md-mail"
                style={{width: 24, height: 24,fontSize: 24}}/>
              )
          },
          },

},
 {
     contentComponent: CustemDrawerComponent,
     contentOptions:{
       activeTintColor: 'orange'
    }
  }
)

const styles = StyleSheet.create({
   MainContainer :{
   flex:1,
   paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
   margin: 10
   }
   });
