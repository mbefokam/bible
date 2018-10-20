import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Platform } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container, Header, Content,Body,List, ListItem,Left, Right,Button, Title,Fab,Badge,Footer,Toast} from 'native-base';
//import Icon from "react-native-vector-icons/Ionicons";

export default class SelectedVerseToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { activeBook, activeChapter } = this.props;
    return (
      <Footer>
      <View style={{
        width: 30,
        height: 30,
        borderRadius: 10,
        marginRight: 20,
        backgroundColor: "#FF5722",
        borderColor: "#7FDBFF",
        borderWidth: 1
      }}/>
      <View style={{
        width: 30,
        height: 30,
        borderRadius: 10,
        marginRight: 20,
        backgroundColor: "#8ED1FC",
        borderColor: "#7FDBFF",
        borderWidth: 1
      }}/>
      <View style={{
        width: 30,
        height: 30,
        borderRadius: 10,
        marginRight: 20,
        backgroundColor: "#FFFA3B",
        borderColor: "#7FDBFF",
        borderWidth: 1
      }}/>
      <View style={{
        width: 30,
        height: 30,
        borderRadius: 10,
        marginRight: 20,
        backgroundColor: "#37D67A",
        borderColor: "#7FDBFF",
        borderWidth: 1
      }}/>
      <View
      style={{
        width: 30,
        marginRight: 20,
        height: 40,
      }}>
      <Icon
        name="content-copy"
        size={30}
        onPress={() => this.props.onCopyVerse()} />
      </View>
      <View style={{
        width: 30,
        height: 40,
        marginRight: 20,
      }}>
      <Icon name="share" size={30} />
      </View>
      <View style={{
        width: 30,
        height: 40,
      }}>
      <Icon
        name="close"
        size={30}
        onPress={() => this.props.onClose()}/>
      </View>
      </Footer>
    );
  }
  // render() {
  //   const { activeBook, activeChapter } = this.props;
  //   return (
  //     <View style={styles.toolbar}>
  //       <TouchableOpacity
  //         activeOpacity={0.7}
  //         style={[styles.actionButton, { marginLeft: 10, flex: 1 }]}
  //         onPress={() => this.props._onBackToolbar()}
  //       >
  //         <Icon name="ios-arrow-back" size={25} color="#000" style={{ backgroundColor: "transparent" }} />
  //         <Text style={styles.toolbarTitle}>
  //           {activeBook.name_id} {activeChapter}
  //         </Text>
  //       </TouchableOpacity>
  //       <View style={styles.actions}>
  //         <TouchableOpacity activeOpacity={0.7} style={styles.actionButton} onPress={() => this.props._onCopyVerse()}>
  //           <Icon name="ios-copy" size={25} color="#000" style={{ backgroundColor: "transparent" }} />
  //         </TouchableOpacity>
  //         <TouchableOpacity activeOpacity={0.7} style={styles.actionButton} onPress={() => this.props._onShareVerse()}>
  //           <Icon name="ios-share-alt" size={25} color="#000" style={{ backgroundColor: "transparent" }} />
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // }
}

const styles = StyleSheet.create({
  square: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#C0392B",
    borderWidth: 1
  },
  toolbar: {
    paddingTop: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 60,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowColor: "#ddd",
    shadowOffset: { height: 10, width: 0 },
    zIndex: 10
  },
  actions: {
    flexDirection: "row",
    marginRight: 10
  },
  actionButton: {
    paddingHorizontal: 20,
    flexDirection: "row"
  },
  toolbarTitle: {
    color: "#000",
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "300",
    backgroundColor: "transparent"
  }
});
