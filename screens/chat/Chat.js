/* @flow */

import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Icon,Container, StyleProvider,Body,Header, Content, List, ListItem,Left,Title, Right,Button,Text} from 'native-base';

import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';

class Chat extends Component {

  componentDidMount(){
  }


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
           <Title style={styleTitle} >{"Jesus La Solution"}</Title>
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

export default Chat

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
