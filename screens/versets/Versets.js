import React from 'react';
import { Alert,View, FlatList,StyleSheet,Clipboard,TouchableOpacity,Share,Platform} from 'react-native';
//import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container, Header, Content,Body,Text,List, Icon,ListItem,Left, Right,Button, Title,IconTitle,Footer,Fab} from 'native-base';
import {human} from 'react-native-typography';
import { ButtonGroup } from 'react-native-elements';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import SQLite from 'react-native-sqlite-2';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//import SelectedVerseToolBar from './SelectedVerseToolBar';
import lastchapterindex from './lastchapterindex.json';

import {DATABASE_NAME,DATABASE_VERSION,DATABASE_DISPLAYNAME,DATANASE_SIZE} from '../../database/BibleDB';
import {currentChapiter,currentBook} from '../../actions';

class Versets extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      move:"",
      chapiter_id:0,
      chapiter_number:0,
      updateVerseId:0,
      currentBookId:0,
      selectedIndex:2,
      chapiterverses:[],
      selectedVerses: [],
      selectedVerseIds:[],
      selectedVersets: [],
      currentBookName:"",
      updateVerseColor:null,
      currentChapiterNumber:0,
      currentNumberOfChapiters:0
    }
    this.updateIndex = this.updateIndex.bind(this)
    this.onSwipeRight = this.onSwipeRight.bind(this)
    this.onSwipeLeft = this.onSwipeLeft.bind(this)
    this.onCopyVerse = this.onCopyVerse.bind(this)
    this.handleSelected = this.handleSelected.bind(this)
    this.onClose = this.onClose.bind(this)
    this.addColor = this.addColor.bind(this)
    this.onShareVerse = this.onShareVerse.bind(this)
  }

  updateIndex (selectedIndex) {

    this.setState({selectedIndex})
    if (selectedIndex===0){
      this.props.navigation.navigate('BibleVersions')
    }else if(selectedIndex===1){
      this.props.navigation.navigate('BibleBooks',{
        versionId: 1
      })
    }else if(selectedIndex===2){
      let bookidProps = this.props.currentBookData.currentBookId;
      this.props.navigation.navigate('Chapitres',{})
    }
  }

  componentDidMount() {
    this.setState({
    chapiter_id: this.props.currentChapiterData.chapiter_id,
    currentBookId: this.props.currentBookData.currentBookId,
    chapiter_number: this.props.currentChapiterData.chapiter_number,
    currentNumberOfChapiters: this.props.currentChapiterData.numberOfChapiters
    })
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
    tx.executeSql('SELECT * FROM BibleVerses WHERE chapiter_id=?', [this.state.chapiter_id],
      this.successQueryVerses, this.errorCB)
  }
  successQueryVerses = (tx, results) => {
    let selectedVersetsTemp =[];
     selectedVersetsTemp = results.rows._array.filter(row =>{
      if (row.verse_color)
      return row.verse_id
    })

    this.setState({
        chapiterverses : results.rows._array,
        selectedVersets: [ ...this.state.selectedVersets, ...selectedVersetsTemp]
    })
  }
  swipeVerse (db) {
    db.transaction((txn) => {
      txn.executeSql(
        'SELECT 1 FROM Version LIMIT 1',
        [],
        () => {
          db.transaction(this.swipeNextVerse, this.errorCB, () => {
          })
        },
        (error) => {
          console.log('received version error:', error)
        }
      )
    })
  }

  swipeNextVerse = (tx) => {
    tx.executeSql('SELECT * FROM BibleVerses WHERE chapiter_id = ?', [this.state.chapiter_id],
      this.successSwipeNextVerse, this.errorCB)
  }
  successSwipeNextVerse = (tx, results) => {
    let selectedVersetsTemp =[];
     selectedVersetsTemp = results.rows._array.filter(row =>{
      if (row.verse_color)
      return row.verse_id
    })
    let tempBook={}
      tempBook = {
      book_name: results.rows._array[0].book_name,
      book_id: results.rows._array[0].book_id,
      book_number: results.rows._array[0].book_id,
    }
    let tempChap = {};
        tempChap = {
          book_id: results.rows._array[0].book_id,
          chapiter_id: results.rows._array[0].chapiter_id,
          chapiter_number: results.rows._array[0].chapiter_number,
          numberOfChapiters: this.props.currentChapiterData.numberOfChapiters
    }
    this.props.currentBook(tempBook)
    this.props.currentChapiter(tempChap)
    this.setState({
    chapiterverses : results.rows._array,
    chapiter_id: this.props.currentChapiterData.chapiter_id,
    currentBookId: this.props.currentBookData.currentBookId,
    chapiter_number: this.props.currentChapiterData.chapiter_number,
    currentNumberOfChapiters: this.props.currentChapiterData.numberOfChapiters,
    selectedVersets: [ ...this.state.selectedVersets, ...selectedVersetsTemp]
    })
  }

  swipeNextBook (db) {
    db.transaction((txn) => {
      txn.executeSql(
        'SELECT 1 FROM Version LIMIT 1',
        [],
        () => {
          db.transaction(this.swipeNextBookQuery, this.errorCB, () => {
          })
        },
        (error) => {
          console.log('received version error:', error)
        }
      )
    })
  }
  swipeNextBookQuery = (tx) => {
    tx.executeSql('SELECT * FROM BibleVerses WHERE book_id=? AND chapiter_number=?', [this.state.currentBookId,this.state.chapiter_number],
      this.successswipeNextBookQuery, this.errorCB)
  }
  successswipeNextBookQuery = (tx, results) => {

    let selectedVersetsTemp =[];
      selectedVersetsTemp = results.rows._array.filter(row =>{
       if (row.verse_color)
       return row.verse_id
     })
      //console.log(results.rows._array[0])
      let tempBook={}
      tempBook = {
        book_name: results.rows._array[0].book_name,
        book_id: results.rows._array[0].book_id,
        book_number: results.rows._array[0].book_id,
      }

     let tempChap = {};
         tempChap = {
           book_id: results.rows._array[0].book_id,
           chapiter_id: results.rows._array[0].chapiter_id,
           chapiter_number: results.rows._array[0].chapiter_number,
           numberOfChapiters: this.state.currentNumberOfChapiters
     }
     this.props.currentBook(tempBook)
     this.props.currentChapiter(tempChap)

     this.setState({
     chapiterverses : results.rows._array,
     chapiter_id: this.props.currentChapiterData.chapiter_id,
     currentBookId: this.props.currentBookData.currentBookId,
     chapiter_number: this.props.currentChapiterData.chapiter_number,
     currentNumberOfChapiters: this.props.currentChapiterData.numberOfChapiters,
     selectedVersets: [ ...this.state.selectedVersets, ...selectedVersetsTemp]
     })
  }


  onSwipeLeft() {
    if (this.props.currentChapiterData.chapiter_number===1 && this.props.currentBookData.currentBookId===1){
      ///console.log(" I am moving in this block .... ")
      let NumberOfChap = 0;
      for (i = 0; i < lastchapterindex.length ; i++) {
            if (lastchapterindex[i].id === 66) {
                chapiterNumber = lastchapterindex[i].lastBookIndex;
                break;
            }
        }
       this.setState({
         move: "left",
         currentBookId: 66,
         chapiter_number: 22,
         currentNumberOfChapiters: 22
       })
       this.swipeNextBook(db)
    }
    else{
      if(this.state.chapiter_number===1){
        let chapiterNumber = 0;
        bookIdNumber = this.state.currentBookId -1
        for (i = 0; i < lastchapterindex.length ; i++) {
              if (lastchapterindex[i].id === bookIdNumber) {
                  chapiterNumber = lastchapterindex[i].lastBookIndex;
                  break;
              }
          }
        this.setState({
          move: "left",
          currentBookId: bookIdNumber,
          currentNumberOfChapiters: chapiterNumber,
          chapiter_number: chapiterNumber
        })
        this.swipeNextBook(db)
      }else{
          let nextChapiterBackward=this.state.chapiter_id-1
          this.setState({
            move: "left",
            chapiter_id: nextChapiterBackward,
          })
          this.swipeVerse(db)
      }
    }
  }

  onSwipeRight() {
    let NumberOfChap = 0
  if (this.props.currentChapiterData.chapiter_number===this.props.currentChapiterData.numberOfChapiters){
    if (this.props.currentBookData.currentBookId===66){
      this.setState({
        move: "right",
        currentBookId:1,
        chapiter_number:1,
        currentNumberOfChapiters:50
      })
      this.swipeNextBook(db)
      }
    else{
      let nextBook = this.state.currentBookId + 1;
      for (var i = 0; i < lastchapterindex.length ; i++) {
            if (lastchapterindex[i].id === nextBook) {
                NumberOfChap = lastchapterindex[i].lastBookIndex;
                break;
            }
        }
      this.setState({
        move: "right",
        chapiter_number: 1,
        currentBookId:nextBook,
        currentNumberOfChapiters:NumberOfChap
      })
      this.swipeNextBook(db)
    }
    }
    else{
      let nextChapiterForward=this.state.chapiter_id+1
      this.setState({
        move: "right",
        chapiter_id: nextChapiterForward,
      })
      this.swipeVerse(db)
    }
  }

  static navigationOptions = {
    header: null
  }
  handleSelected(verse) {
      //console.log(verse)
      let tempSelectedVerses=[]
      let tempselectedVerseIds=[]
          tempSelectedVerses = this.state.selectedVerses.filter(v =>v.verse_id !== verse.verse_id)
          tempselectedVerseIds = this.state.selectedVerseIds.filter(v =>v !== verse.verse_id)

      if (tempSelectedVerses.length === this.state.selectedVerses.length)
      {
          let tempV =[]
              tempV = this.state.chapiterverses.map(v =>{
           if (v.verse_id === verse.verse_id){
             v.verse_color = "#DDDDDD"
             return v
           }
           return v
         })
         let tempVSorted =[];
             tempVSorted = [...tempSelectedVerses,verse].sort(function(a, b) {
           var x = a["verse_id"]; var y = b["verse_id"];
           return ((x < y) ? -1 : ((x > y) ? 1 : 0));
           });
         let tempIdSorted=[]
             tempIdSorted = [...tempselectedVerseIds,verse.verse_id].sort()
         this.setState({
             selectedVerses: [...tempVSorted],
             selectedVerseIds:[...tempIdSorted]
          });
          this.state.chapiterverses = tempV.concat()
      //    console.log("selectedVerses : ",this.state.selectedVerses)
      //    console.log("selectedVerseIds : ",this.state.selectedVerseIds)
       }
       else {
         let tempVR =[]
             tempVR = this.state.chapiterverses.map(v =>{
           if (v.verse_id === verse.verse_id){
             v.verse_color = null
             return v
           }
           return v
         })
         let tempidSorted =[]
             tempidSorted = tempselectedVerseIds.sort();
         let tempVsorted = [...tempSelectedVerses].sort(function(a, b) {
            var x = a["verse_id"]; var y = b["verse_id"];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
          });
         this.setState({
             selectedVerses: [...tempVsorted],
             selectedVerseIds:[...tempidSorted]
          });
          this.state.chapiterverses = tempVR.concat()
      //    console.log("selectedVerses : ",this.state.selectedVerses)
      //    console.log("selectedVerseIds : ",this.state.selectedVerseIds)
       }
     }


  onCopyVerse() {

      const a = this.state.selectedVerseIds;
      const listOfIds = a.reduce((r, n) => {
        const lastSubArray = r[r.length - 1];
        if(!lastSubArray || lastSubArray[lastSubArray.length - 1] !== n - 1) {
          r.push([]);
        }
        r[r.length - 1].push(n);
        return r;
      }, []);

       let first = this.state.selectedVerseIds[0]
       let last =  this.state.selectedVerseIds[this.state.selectedVerseIds.length-1]
       if (first===last)
       {
         last = ""
       }
       let verses = " "
       let printVerset =[]
       for (var j = 0; j < this.state.selectedVerses.length ; j++) {
             verses = verses + this.state.selectedVerses[j].verse_id + ". "+this.state.selectedVerses[j].verse_text+" "
       }
       let versesIds = " "
       if (listOfIds.length ===1 )
         versesIds = this.state.selectedVerseIds[0]+"-"+this.state.selectedVerseIds[this.state.selectedVerseIds.length-1]
       else {
         for (var k=0; k< listOfIds.length; k++){

             if (k ===listOfIds.length-1){
             versesIds = versesIds +listOfIds[k][0]+"-"+listOfIds[k][listOfIds[k].length-1]
              }
             else if (listOfIds[k].length===1){
               versesIds = versesIds +listOfIds[k][0]+", "
             }
             else{
               versesIds = versesIds +listOfIds[k][0]+"-"+listOfIds[k][listOfIds[k].length-1]+", "
             }
         }
       }
       printVerset.push(verses)
       const contentList = printVerset.map(item => {
         return `${this.state.selectedVerses[0].book_name} ${this.state.selectedVerses[0].chapiter_number}:${versesIds}${" "}"${item}"\n`;
       });

       Clipboard.setString(contentList.join("\n"));
       let tempVersets =[]
           tempVersets = this.state.chapiterverses.map(v =>{
         if (v.verse_color === "#DDDDDD"){
           v.verse_color = null
           return v
         }
         return v
       })
       this.setState({
         selectedVerses: [],
         selectedVerseIds:[]
       });
       this.state.chapiterverses = tempVersets.concat()
     }
     onShareVerse() {

         const a = this.state.selectedVerseIds;
         const listOfIds = a.reduce((r, n) => {
           const lastSubArray = r[r.length - 1];
           if(!lastSubArray || lastSubArray[lastSubArray.length - 1] !== n - 1) {
             r.push([]);
           }
           r[r.length - 1].push(n);
           return r;
         }, []);

          let first = this.state.selectedVerseIds[0]
          let last =  this.state.selectedVerseIds[this.state.selectedVerseIds.length-1]
          if (first===last)
          {
            last = ""
          }
          let verses = " "
          let printVerset =[]
          for (var j = 0; j < this.state.selectedVerses.length ; j++) {
                verses = verses + this.state.selectedVerses[j].verse_id + ". "+this.state.selectedVerses[j].verse_text+" "
          }
          let versesIds = " "
          if (listOfIds.length ===1 )
            versesIds = this.state.selectedVerseIds[0]+"-"+this.state.selectedVerseIds[this.state.selectedVerseIds.length-1]
          else {
            for (var k=0; k< listOfIds.length; k++){

                if (k ===listOfIds.length-1){
                versesIds = versesIds +listOfIds[k][0]+"-"+listOfIds[k][listOfIds[k].length-1]
                 }
                else if (listOfIds[k].length===1){
                  versesIds = versesIds +listOfIds[k][0]+", "
                }
                else{
                  versesIds = versesIds +listOfIds[k][0]+"-"+listOfIds[k][listOfIds[k].length-1]+", "
                }
            }
          }

          printVerset.push(verses)
          const contentList = printVerset.map(item => {
            return `${this.state.selectedVerses[0].book_name} ${this.state.selectedVerses[0].chapiter_number}:${versesIds}${" "}"${item}"\n`;
          });
          const shareContent = contentList.join("\n")
          Share.share({
                message:shareContent,
                title: "La Bible version Ostervald 1996, By Carnet System Tech",
                url: "www.lasaintete.com"
              },{
                tintColor:"#8ED1FC"
              }).then()

          let tempVersets =[]
              tempVersets = this.state.chapiterverses.map(v =>{
            if (v.verse_color === "#DDDDDD"){
              v.verse_color = null
              return v
            }
            return v
          })
          this.setState({
            selectedVerses: [],
            selectedVerseIds:[]
          });
        }
     onClose=()=>{
       let tempVersets =[]
           tempVersets = this.state.chapiterverses.map(v =>{
         if (v.verse_color === "#DDDDDD"){
           v.verse_color = null
           db.transaction(function(tx){
             tx.executeSql('UPDATE BibleVerses SET verse_color = ? WHERE id = ?', [null,v.id], this.errorCB)
           })
           return v
         }
         return v
       })
       this.setState({
         selectedVerses: [],
         selectedVerseIds:[]
       });
       this.state.chapiterverses = tempVersets.concat()
     }
     addColor=(color)=>{

       for (var h=0; h< this.state.selectedVerses.length; h++){
         let id = this.state.selectedVerses[h].id;
         db.transaction(function(tx){
           tx.executeSql('UPDATE BibleVerses SET verse_color = ? WHERE id = ?', [color,id], this.errorCB)
         })
       }
       let tempSelectedVerses =[]
           tempSelectedVerses = this.state.chapiterverses.map(v =>{
             let item = v
             for (var m=0; m< this.state.selectedVerses.length; m++){
                if(this.state.selectedVerses[m].id===v.id)
                {
                  item.verse_color = color
                  return item
                }
            }
            return v
       })
       this.setState({
         selectedVerses: [],
         selectedVerseIds:[]
       });
       this.state.chapiterverses = tempSelectedVerses.concat()

     }
     _renderToolbar() {
       if (this.state.selectedVerses.length) {
         return (
           <Footer>
           <Button
           onPress={() => this.addColor("#FF5722")}
           style={{
             width: 30,
             height: 30,
             borderRadius: 10,
             marginRight: 20,
             backgroundColor: "#FF5722",
             borderColor: "#7FDBFF",
             borderWidth: 1
           }}>
           </Button>
           <Button
           onPress={() => this.addColor("#8ED1FC")}
           style={{
             width: 30,
             height: 30,
             borderRadius: 10,
             marginRight: 20,
             backgroundColor: "#8ED1FC",
             borderColor: "#7FDBFF",
             borderWidth: 1
           }}>
           </Button>
           <Button
           onPress={() => this.addColor("#FFFA3B")}
           style={{
             width: 30,
             height: 30,
             borderRadius: 10,
             marginRight: 20,
             backgroundColor: "#FFFA3B",
             borderColor: "#7FDBFF",
             borderWidth: 1
           }}>
           </Button>
           <Button
           onPress={() => this.addColor("#37D67A")}
           style={{
             width: 30,
             height: 30,
             borderRadius: 10,
             marginRight: 20,
             backgroundColor: "#37D67A",
             borderColor: "#7FDBFF",
             borderWidth: 1
           }}>
           </Button>
           <View
           style={{
             width: 30,
             marginRight: 20,
             height: 40,
           }}>
           <Icon
             name="ios-copy"
             iconStyle={{ color: "green", backgroundColor: "green"}}
             onPress={() => this.onCopyVerse()} />
           </View>
           <View style={{
             width: 30,
             height: 40,
             marginRight: 20,
           }}>
           <Icon
           name="share"
           size={30}
           onPress={() => this.onShareVerse()}
           />
           </View>
           <View style={{
             width: 30,
             height: 40,
           }}>
           <Icon
             name="close"
             size={30}
             onPress={() => this.onClose()}/>
           </View>
           </Footer>
         );
       } else {
         return (
           <>
           <Fab
             style={{backgroundColor: 'orange', height: 30}}
             position="bottomRight"
             onPress={()=> this.onSwipeRight()}>
             <Icon name="ios-arrow-forward" />
           </Fab>
           <Fab
             style={{backgroundColor: 'orange', height: 30}}
             position="bottomLeft"
             onPress={()=> this.onSwipeLeft()}>
             <Icon name="ios-arrow-back" />
           </Fab>
           </>
         );
       }
     }
  render() {
    const buttons = ['Accueil','Livres', 'Chapitres']
    const { selectedIndex } = this.state.selectedIndex
    let styleArrow = {}
    if (Platform.OS === 'android') {
        styleArrow = {color:"orange"}
      }
      const alignTextTop = Platform.OS ==='android' ? {paddingTop: 20}: {};
    return (
      <Container>
      <Header style= {alignTextTop}>
        <Left>
          <Button transparent>
             <Icon name='arrow-back'
                style={{color: "orange"}}
                onPress={()=> this.props.navigation.navigate('Chapitres',{})}/>

          </Button>
        </Left>
        <Body >
          <Title style={{width: 200, color: Platform.OS==='android'? 'white':'black'}}>{this.props.currentBookData.currentBookName}{": "}{this.props.currentChapiterData.chapiter_number}</Title>
        </Body>
        <Right />
      </Header>
      <ButtonGroup
      onPress={this.updateIndex}
      selectedIndex={selectedIndex}
      buttons={buttons}
      textStyle={{color: "#fff", fontSize:17}}
      containerStyle={{height: 30, backgroundColor: "orange"}}
       />
      <Content>
      <FlatList
        extraData={this.state}
        data={this.state.chapiterverses}
        keyExtractor={(item, index) => item.verse_id.toString()}
        renderItem={({item, index}) =>
        <TouchableOpacity
          onPress={()=> this.handleSelected(item)}>
        <Text
        style={{
          borderBottomColor: 'transparent',
          borderBottomWidth: 0,
          marginTop: 4,
          marginBottom: 4,
          marginRight: 5,
          marginLeft: 15,
          backgroundColor: item.verse_color}}
          >
        <Text style={{ fontSize: 18, fontFamily: "Arial", color: 'black'}}>{item.verse_id}</Text><Text
          style={human.body}>{". "}{item.verse_text}</Text>

        </Text>
        </TouchableOpacity >
         }

        />

      </Content>
      {this._renderToolbar()}
      </Container>
    );
  }

}

var styles = StyleSheet.create({
  bottomStyle:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  selected: {
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    marginTop: 4,
    marginBottom: 4,
    marginRight: 5,
    marginLeft: 15,
    backgroundColor: 'green'
  },
  nonSelected: {
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    marginTop: 4,
    marginBottom: 4,
    marginRight: 5,
    marginLeft: 15,
    backgroundColor: 'white'
  },
})

function mapStateToProps(state){
  return {
    currentBookData: state.currentBookReducer,
    currentChapiterData: state.currentChapiterRecuder
  }
}

function mapDispatchToProps(dispatch){

  return bindActionCreators({currentChapiter,currentBook},dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Versets);
