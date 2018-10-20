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

class Playlists extends Component {

  componentDidMount(){
  }

  render() {
    let styleHeader = {}
    if (Platform.OS === 'android') {
        styleHeader = {color:"white"}
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
         <Title style={styleTitle} >{"La Saintete TV/FM"}</Title>
       </Body>
       <Right />
    </Header >
      <Content>
        <Text>Cette Page est en construction</Text>
      </Content>
    </Container>
    </StyleProvider>
    );
  }
}

export default Playlists

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
