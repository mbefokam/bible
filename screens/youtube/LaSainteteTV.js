/* @flow */

import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Icon,Container, StyleProvider,Body,Header, Content, List, ListItem,Left,Title, Right,Button,Text} from 'native-base';
//import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from './Video';
import data from './search.json';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';

class LaSainteteTV extends Component {

  componentDidMount(){
  }

  // static navigationOptions ={
  //   drawerIcon:({tintColor})=>(
  //     <Icon name="ios-desktop" style={{fontSize: 24, color: tintColor}}/>
  //   )
  // }
  render() {
    let styleHeader = {}
    if (Platform.OS === 'android') {
        styleHeader = {color:"#007aff"}
    }
    let styleTitle = {color:"white",width: 200}
    if (Platform.OS === 'android') {
        styleTitle = {color:"white",width: 200}
    }

    return (
    <StyleProvider style={getTheme(platform)}>
      <Container>
       <Header style={{color:"#007aff"}}>
          <Left>
            <Icon name="menu" size={30} style={{color: "orange"}} onPress = {()=>this.props.navigation.openDrawer()}/>
          </Left>
          <Body >
            <Title style={styleTitle} >{"Etude Bibliques"}</Title>
          </Body>
          <Right />
       </Header >
        <Content>
        <ScrollView>
          <Video video= {data.items[0]} />
          <Video video= {data.items[1]} />
          <Video video= {data.items[2]} />
          <Video video= {data.items[3]} />
          <Video video= {data.items[4]} />
      </ScrollView>
        </Content>
      </Container>
    </StyleProvider>
    );
  }
}

export default LaSainteteTV

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
