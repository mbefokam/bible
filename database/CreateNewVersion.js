import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ListView,
  SafeAreaView
} from 'react-native'

import SQLite from 'react-native-sqlite-2'

import laBible from '../Bible-version-ostervald-1996.json';
import {DATABASE_NAME,DATABASE_VERSION,DATABASE_DISPLAYNAME,DATANASE_SIZE} from './BibleDB';
import Spinner from 'react-native-spinkit'
let db
let bid = 1;
let cid = 1;
let verid = 1;

export default class ReactNativeSQLite2Test extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sprinner: false,
      progress: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    }
  }

  componentDidMount() {
    this.loadAndQueryDB()
  }

  componentWillUnmount () {
    this.closeDatabase()
  }

  errorCB = (err) => {
    console.log('error: ', err)
    this.state.progress.push('Error: ' + (err.message || err))
    this.setState(this.state)
    return false
  }

  successCB = () => {
    console.log('SQL executed ...')
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
    console.log('Database DELETED')
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
          this.state.progress.push('Database not yet ready ... populating data')
          this.setState(this.state)
          db.transaction(this.populateDB, this.errorCB, () => {
            this.state.progress.push('Database populated ... executing query ...')
            this.setState(this.state)
            db.transaction(this.queryEmployees, this.errorCB, () => {
              console.log('Transaction is now finished')
              this.state.progress.push('Processing completed')
              this.setState(this.state)
              this.closeDatabase()
            })
          })
        }
      )
    })
  }

  populateDB = (tx) => {
    this.state.progress.push('Executing DROP stmts')
    this.setState(this.state)

    tx.executeSql('DROP TABLE IF EXISTS BibleVersions;')
    tx.executeSql('DROP TABLE IF EXISTS BibleBooks;')
    tx.executeSql('DROP TABLE IF EXISTS BibleChapiters;')
    tx.executeSql('DROP TABLE IF EXISTS BibleVerses;')

    this.state.progress.push('Executing CREATE stmts')
    this.setState(this.state)

    tx.executeSql('CREATE TABLE IF NOT EXISTS Version( ' +
      'version_id INTEGER PRIMARY KEY NOT NULL); ', [], this.successCB, this.errorCB)

    tx.executeSql('CREATE TABLE IF NOT EXISTS BibleVersions( ' +
      'version_id INTEGER PRIMARY KEY NOT NULL, ' +
      'version_name VARCHAR(60) );, ', [], this.successCB, this.errorCB)

      tx.executeSql('CREATE TABLE IF NOT EXISTS BibleBooks( ' +
        'book_id INTEGER PRIMARY KEY NOT NULL, ' +
        'book_number INTEGER, ' +
        'v_id INTEGER, ' +
        'book_name VARCHAR(60), ' +
        'FOREIGN KEY ( v_id ) REFERENCES BibleVersions ( version_id ));', [], this.successCB, this.errorCB)

      tx.executeSql('CREATE TABLE IF NOT EXISTS BibleChapiters( ' +
        'chapiter_id INTEGER PRIMARY KEY NOT NULL, ' +
        'chapiter_number INTEGER, ' +
        'book_id INTEGER, ' +
        'FOREIGN KEY ( book_id ) REFERENCES BibleBooks ( book_id ));', [], this.successCB, this.errorCB)

      tx.executeSql('CREATE TABLE IF NOT EXISTS BibleVerses( ' +
        'id INTEGER PRIMARY KEY NOT NULL, ' +
        'book_id INTEGER, ' +
        'book_name VARCHAR(50), ' +
        'chapiter_number INTEGER, ' +
        'chapiter_id INTEGER, ' +
        'verse_id INTEGER,' +
        'verse_text VARCHAR(255), ' +
        'verse_color VARCHAR(10), ' +
        'verse_highlight VARCHAR(10), ' +
        'FOREIGN KEY ( book_id ) REFERENCES BibleBooks ( book_number ),'+
        'FOREIGN KEY ( book_name ) REFERENCES BibleBooks ( book_name ),'+
        'FOREIGN KEY ( chapiter_number ) REFERENCES BibleChapiters ( chapiter_number ));',[])

      this.state.progress.push('Executing INSERT stmts')
      this.setState(this.state)



      for (var i = 0; i < laBible.length; i++) {
        tx.executeSql('INSERT INTO BibleVersions (version_id, version_name) VALUES (?,?);', [laBible[i].id, laBible[i].version])
        for (var j = 0; j < laBible[i].Livres.length; j++) {
          console.log("laBible[i].Livres[j].id...: ",laBible[i].Livres[j].id)
          tx.executeSql('INSERT INTO BibleBooks (book_id, book_number, v_id, book_name) VALUES (?,?,?,?);', [bid,laBible[i].Livres[j].id,laBible[i].id,laBible[i].Livres[j].Text])
          for (var k = 0; k < laBible[i].Livres[j].Chapitres.length; k++) {
            tx.executeSql('INSERT INTO BibleChapiters (chapiter_id, chapiter_number, book_id) VALUES (?,?,?);', [cid,laBible[i].Livres[j].Chapitres[k].id,bid])
            for (var n = 0; n < laBible[i].Livres[j].Chapitres[k].versets.length; n++) {
              tx.executeSql('INSERT INTO BibleVerses (id, book_id, book_name, chapiter_number,chapiter_id,verse_id,verse_text,verse_color,verse_highlight) VALUES (?,?,?,?,?,?,?,?,?);', [verid, laBible[i].Livres[j].id, laBible[i].Livres[j].Text, laBible[i].Livres[j].Chapitres[k].id,cid,laBible[i].Livres[j].Chapitres[k].versets[n].id, laBible[i].Livres[j].Chapitres[k].versets[n].Text,"white","false"])
              verid++
            }
            cid++
          }
          bid++
        }
      }
      this.state.progress.push('Done Executing INSERT stmts')
      console.log('all config SQL done')
  }

  queryEmployees = (tx) => {
    console.log('Executing sql...')
    tx.executeSql('SELECT book_name FROM BibleBooks', [],
      this.queryEmployeesSuccess, this.errorCB)
  }

  queryEmployeesSuccess = (tx, results) => {
    this.state.progress.push('Query completed')
    console.log("DONE CREATING AND INSERTING DATA: ",results.rows)
    this.setState(this.state)
  }

  loadAndQueryDB () {
    this.state.progress.push('Opening database ...')
    this.setState(this.state)
    db = SQLite.openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DISPLAYNAME, DATANASE_SIZE, this.openCB, this.errorCB)
    db.transaction(function (txn) {
     txn.executeSql('SELECT * FROM BibleVersions ', [], (tx, results) => {
       if (results.rows._array[0].version_id)
          {
            console.log("results.rows._array ********* ",results.rows._array)
          }
       else{
         //console.log(" No database  ********* ")
         this.setState({
           sprinner:true
         })
         this.populateDatabase(db)
         this.setState({
           sprinner:false
         })
       }
     });
    });
  }

  closeDatabase () {
    var that = this
    if (db) {
      console.log('Closing database ...')
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
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    return (
      <View style={styles.mainContainer}>
        <Spinner Style={{}} color={'red'} size={100} type={'Circle'} isVisible={this.state.sprinner}/>
      </View>
    )
  }
};

var listStyles = StyleSheet.create({
  li: {
    borderBottomColor: '#c8c7cc',
    borderBottomWidth: 0.5,
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 15
  },
  liContainer: {
    backgroundColor: '#fff',
    flex: 1,
    paddingLeft: 15
  },
  liIndent: {
    flex: 1
  },
  liText: {
    color: '#333',
    fontSize: 17,
    fontWeight: '400',
    marginBottom: -3.5,
    marginTop: -3.5
  }
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  toolbar: {
    backgroundColor: '#51c04d',
    flexDirection: 'row',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  toolbarButton: {
    color: 'white',
    textAlign: 'center',
    flex: 1
  },
  mainContainer: {
    flex: 1
  }
})
