import React from 'react';
import { Alert,Text,View,Platform } from 'react-native';
import { Container, Header, Content,Body, List, ListItem,Left, Right,Button, Title,IconTitle,Icon } from 'native-base';
import {material} from 'react-native-typography';
import SQLite from 'react-native-sqlite-2';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


import {DATABASE_NAME,DATABASE_VERSION,DATABASE_DISPLAYNAME,DATANASE_SIZE} from '../../database/BibleDB';
import {currentBook} from '../../actions';

const home = 'Home'
class ListeDesLivres extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      versionName:this.props.navigation.state.params.versionId,
      biblebooks:[],
      book:{
        currentBookName:"",
        currentBookNumber:0,
      }
    }
  }
  componentDidMount() {

    db = SQLite.openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DISPLAYNAME, DATANASE_SIZE, this.openCB, this.errorCB)
    this.populateDatabase(db)
  }
  openCB = () => {
    this.setState(this.state)
  }
  errorCB = (err) => {
    console.log('error: ', err)
    return false
  }
  populateDatabase (db) {
    db.transaction((txn) => {
      txn.executeSql(
        'SELECT 1 FROM Version LIMIT 1',
        [],
        () => {
          db.transaction(this.queryBooks, this.errorCB, () => {
          })
        },
        (error) => {
          console.log('received version error:', error)
        }
      )
    })
  }
  queryBooks = (tx) => {
    console.log('Executing sql...')
    tx.executeSql('SELECT book_id,book_number,v_id,book_name FROM BibleBooks WHERE v_id=?', [this.props.navigation.state.params.versionId],
      this.queryBooksSuccess, this.errorCB)
  }
  queryBooksSuccess = (tx, results) => {
    this.setState({
      biblebooks: results.rows._array
      })
    // this.setState({
    //   biblebooks: [ ...this.state.biblebooks, ...results.rows._array ]
    //   })
  }
  static navigationOptions = {
    header: null
  }

  render() {
    const alignTextTop = Platform.OS ==='android' ? {paddingTop: 20}: {};
    return (
      <Container>
      <Header style= {alignTextTop}>
        <Left>
          <Button transparent>
            <Icon name='arrow-back'
            style={{color: "orange"}}
            onPress={()=> this.props.navigation.navigate('BibleVersions',{
            })}/>
          </Button>
        </Left>
        <Body >
          <Title style={{width: 200, color: Platform.OS==='android'? 'white':'black'}}>Les 66 Livres</Title>
        </Body>
        <Right />
      </Header>
      <Content>
      <List dataArray={this.state.biblebooks}
        renderRow={(bible) =>
          <ListItem key={bible.book_id}
               onPress={()=>
                {
                this.props.currentBook(bible)
                  this.props.navigation.navigate('Chapitres',{})
               //  this.props.navigation.navigate('Chapitres',{
               //   bookId: bible.book_id,
               //   bookName: bible.book_name,
               //   versionId: this.props.navigation.state.params.versionId
               // })
             }
             }
            >
            <Left>

            <Text style={material.subheading}>{bible.book_name}</Text>
            </Left>
            <Right>
                <Icon name="arrow-forward" />
            </Right>
          </ListItem>
        }>
      </List>
      </Content>
      </Container>
    );
  }

}
function mapStateToProps(state){
  return state
}

function mapDispatchToProps(dispatch){

  return bindActionCreators({currentBook},dispatch)
}

export default connect(null, mapDispatchToProps)(ListeDesLivres);
