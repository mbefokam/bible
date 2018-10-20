import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ListView,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView
} from 'react-native'
import { Container,Icon, StyleProvider,Header, Body,Content, List, ListItem,Left, Title,Right, Button,Text} from 'native-base';
import SQLite from 'react-native-sqlite-2';
import {human} from 'react-native-typography';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
//import Icon from 'react-native-vector-icons/MaterialIcons';
import {DATABASE_NAME,DATABASE_VERSION,DATABASE_DISPLAYNAME,DATANASE_SIZE} from '../../database/BibleDB';

import LoadBible from  '../../database/CreateNewVersion'

let db
let bid = 1;
let cid = 1;
let verid = 1;

export default class BibleVersion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bibleversion:[],
      progress: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    }
  }
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    db = SQLite.openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DISPLAYNAME, DATANASE_SIZE, this.openCB, this.errorCB)
    this.populateDatabase(db)
  }

  componentWillUnmount () {
    this.closeDatabase()
  }

  handleOnPressBook = bible=>{

  }

  errorCB = (err) => {
    console.log('error: ', err)
    this.state.progress.push('Error: ' + (err.message || err))
    this.setState(this.state)
    return false
  }

  successCB = () => {
  }

  openCB = () => {
    this.state.progress.push('Database OPEN')
    this.setState(this.state)
  }

  closeCB = () => {
    this.state.progress.push('Database CLOSED')
    this.setState(this.state)
  }

  deleteCB = () => {
    this.state.progress.push('Database DELETED')
    this.setState(this.state)
  }

  populateDatabase (db) {
    this.state.progress.push('Database integrity check')
    this.setState(this.state)
    db.transaction((txn) => {
      txn.executeSql(
        'SELECT 1 FROM Version LIMIT 1',
        [],
        () => {
          this.state.progress.push('Database is ready ... executing query ...')
          this.setState(this.state)
          db.transaction(this.queryEmployees, this.errorCB, () => {
            this.state.progress.push('Processing completed')
            this.setState(this.state)
          })
        },
        (error) => {
          console.log('received version error:', error)
        }
      )
    })
  }

  populateDB = (tx) => {
  }

  queryEmployees = (tx) => {
    tx.executeSql('SELECT version_id, version_name FROM BibleVersions', [],
      this.queryEmployeesSuccess, this.errorCB)
  }

  queryEmployeesSuccess = (tx, results) => {
    this.state.progress.push('Query completed')
    this.setState({
      bibleversion: [ ...this.state.bibleversion, ...results.rows._array ]
      })
  }

  loadAndQueryDB () {
    this.state.progress.push('Opening database ...')
    this.setState(this.state)
    db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, this.openCB, this.errorCB)
    this.populateDatabase(db)
  }

  closeDatabase () {
    var that = this
    if (db) {
      that.state.progress.push('Closing database')
      that.setState(that.state)
    } else {
      that.state.progress.push('Database was not OPENED')
      that.setState(that.state)
    }
  }

  runDemo () {
    this.state.progress = ['Starting SQLite Callback Demo']
    this.setState(this.state)
    this.loadAndQueryDB()
  }

  renderProgressEntry (entry) {
    return (
      <View style={listStyles.li}>
        <View>
          <Text style={listStyles.liText}>{entry}</Text>
        </View>
      </View>
    )
  }
  render () {
    let styleTitle = {}
    if (Platform.OS === 'android') {
        styleTitle = {color:"black"}
      }
    const img = './bible3.jpg'
    return (
    <StyleProvider style={getTheme(platform)}>
      <Container>
       <ImageBackground style={styles.backgroundImg}
              resizeMode='cover'
              source={require(img)}>
              <Header transparent>
                 <Left>
                   <Icon name="menu" size={30} style={{color: "orange"}}  onPress = {()=>this.props.navigation.openDrawer()}/>
                 </Left>
                 <Body >
                   <Title style={styleTitle} >{"Lire La Bible"}</Title>
                 </Body>
                 <Right />
              </Header>

              <View style={styles.content}>

                <Button large block bordered dark
                onPress={()=> this.props.navigation.navigate('BibleBooks',{
                        versionId: 1,
                        versionName: "Ostervald 1996"
                      })}
                >
                  <Text style={{color:"black", fontWeight: "bold"}}>{"Lire la Bible Ostervald 1996 (OST)"}</Text>
                </Button>

              </View>
              <LoadBible />
       </ImageBackground>
     </Container>
    </StyleProvider>
    )
  }
};
var styles = StyleSheet.create({
  content:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
  backgroundImg:{
    flex: 1,
    width: null,
    alignSelf: 'stretch'
  },

  versionButton: {
    marginTop: 100,
    marginBottom: 10,
    marginRight: 5,
    marginLeft: 5
  },
  versionText:{
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    textAlign:'center'
  },
  bibleVersion: {
    width: '100%',
    textAlign:'center',
    alignItems: 'center'

  },
})
