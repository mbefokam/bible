import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Alert,View, FlatList,StyleSheet,Clipboard,TouchableOpacity,Share} from 'react-native';
import SQLite from 'react-native-sqlite-2';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {human} from 'react-native-typography';
import { Container, Header, Content, List,ListItem,Item,Body, Right, Input,Thumbnail, Button, Text,Left,Spinner} from 'native-base';

import {DATABASE_NAME,DATABASE_VERSION,DATABASE_DISPLAYNAME,DATANASE_SIZE} from '../../database/BibleDB';
import {currentChapiter,currentBook} from '../../actions';

class SearchVerses extends Component {

  constructor (props) {
    super(props)
    this.state = {
      text:"",
      bible: []
    }
    //this.getBible = this.getBible.bind(this)
    this.searchText = this.searchText.bind(this)
    this.onChangeInput = this.onChangeInput.bind(this)
  }

  componentDidMount() {
    db = SQLite.openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DISPLAYNAME, DATANASE_SIZE, this.openCB, this.errorCB)

    // db.transaction(function(tx){
    //   tx.executeSql('Select * From BibleVerses Where verse_id=?', [1], this.getBible, this.errorCB)
    // })
  }
  populateDatabase (db) {
    db.transaction((txn) => {
      txn.executeSql(
        'SELECT 1 FROM Version LIMIT 1',
        [],
        () => {
          db.transaction(this.queryVerses, this.errorCB, () => {
          })
        },
        (error) => {
          console.log('received version error:', error)
        }
      )
    })
  }

  queryVerses = (tx) => {
    tx.executeSql('SELECT * FROM BibleVerses WHERE verse_text MATCH(?)', [this.state.text],
      this.getBible, this.errorCB)
  }
  getBible = (tx, results) => {
    console.log("results..... ", results.rows._array)
    //this.state.bible = results.rows._array.concat()
  }

  openCB = () => {
    this.setState(this.state)
  }
  errorCB = (err) => {
    console.log('error: ', err)
    return false
  }

  static navigationOptions = {
    header: null
  }

  onChangeInput=(textInput)=>{
    this.setState({
      text: textInput
    });
  }
  searchText = () =>{
    console.log("....Searching ... ",this.state.text)
    this.populateDatabase(db)
    //console.log("this.state.bible.... ",this.state.bible);
    //let searchText = this.state.text;
    //let passages = this.state.bible;

    //let results = this.state.bible.filter(v =>v.verse_text.indexOf(searchText) !== -1)
     //console.log("...... results ........ ",results);
  }
  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Button transparent>
          <Icon name='chevron-left'
              size={40}
              style={{color: "blue"}}
              onPress={()=> this.props.navigation.navigate('Versets',{
          })}/>
          </Button>
          <Item
          style={{width: 150}}
          >
            <Input
            placeholder="recherche"
            onChangeText={(text)=>this.onChangeInput(text)}
             />
            <Icon
            name="book"
            size={20}
            style={{marginRight: 5}}/>
          </Item>
          <Button bordered
          style={{height: 35, width: 40, marginLeft: 10}}>
            <Icon
            name='search'
            style={{color: "blue"}}
            onPress={()=>this.searchText()}
            />
          </Button>
        </Header>
        <Content>
          <List>
            <ListItem >
              <Body >
                <Text style={human.body} >{"Au commencement, Dieu créa les cieux et la terre. 2. Or la terre était informe et vide, et les ténèbres étaient à la surface de l'abîme, et l'Esprit de Dieu se mouvait sur les eaux. 3. Et Dieu dit: Que la lumière soit; et la lumière fut. 4. Et Dieu vit que la lumière était bonne; et Dieu sépara la lumière d'avec les ténèbres. "}</Text>
                <Text note>{"Genèse 1:1"}</Text>
              </Body>
            </ListItem>
            <ListItem >
              <Body >
                <Text style={human.body} >{"Au commencement, Dieu créa les cieux et la terre. 2. Or la terre était informe et vide, et les ténèbres étaient à la surface de l'abîme, et l'Esprit de Dieu se mouvait sur les eaux. 3. Et Dieu dit: Que la lumière soit; et la lumière fut. 4. Et Dieu vit que la lumière était bonne; et Dieu sépara la lumière d'avec les ténèbres. "}</Text>
                <Text note>{"Genèse 1:2 "}</Text>
              </Body>
            </ListItem>
          </List>

        </Content>

      </Container>
    );
  }
}
// <Spinner
//   color='blue'
//   style={{
//     height: 10,
//   }}/>
export default SearchVerses
