import React, { Component } from 'react';
import { Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
 class HeaderScreen extends Component {
  render() {
    return (
        <Header>
          <Left>
            <Button transparent>
            <Icon name='arrow-back'
                onPress={()=> this.props.navigation.navigate('Chapitres',{
            })}/>
            </Button>
          </Left>
          <Body>
            <Title>{this.props.currentBookData.currentBookName}{": "}{this.props.currentChapiterData.chapiter_number}</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='search' />
            </Button>
          </Right>
        </Header>
    );
  }
}
function mapStateToProps(state){
  return {
    currentBookData: state.currentBookReducer,
    currentChapiterData: state.currentChapiterRecuder
  }
}
export default connect(mapStateToProps, null)(HeaderScreen);
