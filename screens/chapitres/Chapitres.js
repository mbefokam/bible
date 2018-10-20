import React from 'react';
import { Alert,Text,View,Platform} from 'react-native';
import { Container, Header, Content,Body, List, ListItem,Left, Right,Button, Title,IconTitle,Icon } from 'native-base';
import {material} from 'react-native-typography';
import SQLite from 'react-native-sqlite-2';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {DATABASE_NAME,DATABASE_VERSION,DATABASE_DISPLAYNAME,DATANASE_SIZE} from '../../database/BibleDB';
import {currentChapiter,currentBook} from '../../actions';

class ListeDesChapitres extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      bookchapiters:[],
      bookId:0,
      numberOfChapiters:0,
      book:{
        currentBookId: 0,
        currentBookName: "",
        currentBookNumber: 0
      }
    }
  }
  componentWillReceiveProps() {
      this.populateDatabase(db)
    }
  componentDidMount() {

    db = SQLite.openDatabase(DATABASE_NAME, DATANASE_SIZE, DATABASE_DISPLAYNAME, DATANASE_SIZE, this.openCB, this.errorCB)
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
          db.transaction(this.queryChapiters, this.errorCB, () => {
          })
        },
        (error) => {
          console.log('received version error:', error)
        }
      )
    })
  }
  queryChapiters = (tx) => {
    tx.executeSql('SELECT chapiter_id, chapiter_number,book_id FROM BibleChapiters WHERE book_id=?', [this.props.currentBookData.currentBookId],
      this.queryChapitersSuccess, this.errorCB)
  }

  queryChapitersSuccess = (tx, results) => {
    this.setState({
      numberOfChapiters: results.rows._array.length,
      bookchapiters: []
      })
    this.setState({
        bookchapiters: results.rows._array
    })
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
            onPress={()=> this.props.navigation.navigate('BibleBooks',{
            })}/>
          </Button>
        </Left>
        <Body >
          <Title style={{width: 200,color: Platform.OS==='android'? 'white':'black'}}>{this.props.currentBookData.currentBookName}</Title>
        </Body>
        <Right />
      </Header>
      <Content>
      <List dataArray={this.state.bookchapiters}
        renderRow={(book) =>
          <ListItem key={book.chapiter_id}
            onPress={()=>
             {
                 book["numberOfChapiters"]= this.state.numberOfChapiters
                 this.props.currentChapiter(book)
                 this.props.navigation.navigate('Versets',{})
               }
             }
            >
            <Left>
            <Text style={material.subheading}>{"Chapitre : "}{book.chapiter_number}</Text>
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
  return {
     currentBookData: state.currentBookReducer
  }
}


function mapDispatchToProps(dispatch){

  return bindActionCreators({currentChapiter},dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ListeDesChapitres);
