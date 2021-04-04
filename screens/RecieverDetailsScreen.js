import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import{Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';
import {AppDrawerNavigator} from '../components/AppDrawerNavigator'
import db from '../config.js';

export default class RecieverDetailsScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      userId          : firebase.auth().currentUser.email,
      recieverId      : this.props.navigation.getParam('details')["userID"],
      requestId       : this.props.navigation.getParam('details')["requestID"],
      bookName        : this.props.navigation.getParam('details')["bookName"],
      reason_for_requesting     : this.props.navigation.getParam('details')["reason"],
      recieverName    : '',
      recieverContact : '',
      recieverAddress : '',
      recieverRequestDocId : ''
    }
  }

 addNotification=()=>{
    var message = this.state.userName + " has shown interest in donating the book"
    db.collection("all_notifications").add({
      "targeted_user_id"    : this.state.recieverId,
      "donor_id"            : this.state.userId,
      "request_id"          : this.state.requestId,
      "book_name"           : this.state.bookName,
      "date"                : firebase.firestore.FieldValue.serverTimestamp(),
      "notification_status" : "unread",
      "message"             : message
    })
  }


getRecieverDetails(){
  db.collection('Users').where('email','==',this.state.recieverId).get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      this.setState({
        recieverName    : doc.data().firstName,
        recieverContact : doc.data().phoneNo,
        recieverAddress : doc.data().Address,
      })
    })
  });

  db.collection('request').where('requestID','==',this.state.requestId).get()
  .then(snapshot=>{
    snapshot.forEach(doc => {
      this.setState({recieverRequestDocId:doc.id})
   })
})}

updateBookStatus=()=>{
  db.collection('all_donations').add({
    bookName           : this.state.bookName,
    requestID          : this.state.requestId,
    requestedBy        : this.state.recieverName,
    donorID            : this.state.userId,
    requestStatus      :  "Donor Interested"
  })
}



componentDidMount(){
  this.getRecieverDetails()
}


  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
          <Header
            leftComponent ={<Icon name='arrow-left' type='feather' color='#696969'  onPress={() => this.props.navigation.goBack()}/>}
            centerComponent={{ text:"Donate Books", style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
            backgroundColor = "#eaf8fe"
          />
        </View>
        <View style={{flex:0.3}}>
          <Card
              title={"Supply Information"}
              titleStyle= {{fontSize : 20}}
            >
            <Card >
              <Text style={{fontWeight:'bold'}}>Name : {this.state.bookName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Reason : {this.state.reason_for_requesting}</Text>
            </Card>
          </Card>
        </View>
        <View style={{flex:0.3}}>
          <Card
            title={"Reciever Information"}
            titleStyle= {{fontSize : 20}}
            >
            <Card>
              <Text style={{fontWeight:'bold'}}>Name: {this.state.recieverName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Contact: {this.state.recieverContact}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Address: {this.state.recieverAddress}</Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {
            this.state.recieverId !== this.state.userId
            ?(
              <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{
                    this.updateBookStatus()
                    this.addNotification()
                    this.props.navigation.navigate('Donations')
                  }}>
                <Text>I want to Donate</Text>
              </TouchableOpacity>
            )
            : null
          }
        </View>
      </View>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:200,
    height:50,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  }
})
