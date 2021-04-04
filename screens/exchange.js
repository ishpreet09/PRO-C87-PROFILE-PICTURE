import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity,TextInput, Alert, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import MyHeader from '../components/header';
import db from '../config';
import * as firebase from 'firebase';

export default class ExchangeScreen extends Component{
    constructor(){
      super();
      this.state ={
        userId : firebase.auth().currentUser.email,
        bookName:"",
        reasonToRequest:"",
        IsBookRequestActive : "",
        requestedBookName: "",
        bookStatus:"",
        requestId:"",
        userDocId: '',
        docId :''
      }
    }
  
    createUniqueId(){
      return Math.random().toString(36).substring(7);
    }
  
  
  
    addRequest = async (requestedBookName,reasonToRequest)=>{
      var userId = this.state.userId
      var randomRequestId = this.createUniqueId()
      db.collection('request').add({
          "userID": userId,
          "bookName":requestedBookName,
          "reason":reasonToRequest,
          "requestID"  : randomRequestId,
          "bookStatus" : "requested",
           "date"       : firebase.firestore.FieldValue.serverTimestamp()
  
      })
  
      await  this.getBookRequest()
      db.collection('Users').where("email","==",userId).get()
      .then()
      .then((snapshot)=>{
        snapshot.forEach((doc)=>{
          db.collection('Users').doc(doc.id).update({
        IsBookRequestActive: true
        })
      })
    })
  
      this.setState({
          bookName :'',
          reasonToRequest : '',
          requestId: randomRequestId
      })
  
      return Alert.alert("Book Requested Successfully")
  
  
    }
  
  receivedBooks=(bookName)=>{
    var userId = this.state.userId
    var requestId = this.state.requestId
    db.collection('received-books').add({
        "userID": userId,
        "bookName":bookName,
        "requestID"  : requestId,
        "bookStatus"  : "received",
  
    })
  }
  
  
  
  
  getIsBookRequestActive(){
    db.collection('Users')
    .where('email','==',this.state.userId)
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({
          IsBookRequestActive:doc.data().IsBookRequestActive,
          userDocId : doc.id
        })
      })
    })
  }
  
  
  
  
  
  
  
  
  
  
  getBookRequest =()=>{
    // getting the requested book
  var bookRequest=  db.collection('request')
    .where('userID','==',this.state.userId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if(doc.data().bookStatus !== "received"){
          this.setState({
            requestId : doc.data().requestID,
            requestedBookName: doc.data().bookName,
            bookStatus:doc.data().bookStatus,
            docId     : doc.id
          })
        }
      })
  })}
  
  
  
  sendNotification=()=>{
    //to get the first name and last name
    db.collection('Users').where('email','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().firstName
        var lastName = doc.data().lastName
  
        // to get the donor id and book nam
        db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            var donorId  = doc.data().donor_id
            var bookName =  doc.data().book_name
  
            //targert user id is the donor id to send notification to the user
            db.collection('all_notifications').add({
              "targeted_user_id" : donorId,
              "message" : name +" " + lastName + " received the book " + bookName ,
              "notification_status" : "unread",
              "book_name" : bookName
            })
          })
        })
      })
    })
  }
  
  componentDidMount(){
    this.getBookRequest()
    this.getIsBookRequestActive()
  
  }
  
  updateBookRequestStatus=()=>{
    //updating the book status after receiving the book
    db.collection('request').doc(this.state.docId)
    .update({
      bookStatus : 'recieved'
    })
  
    //getting the  doc id to update the users doc
    db.collection('Users').where('email','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        //updating the doc
        db.collection('Users').doc(doc.id).update({
          IsBookRequestActive: false
        })
      })
    })
  
  
  }
  
  
    render(){
  
      if(this.state.IsBookRequestActive === true){
        return(
  
          // Status screen
  
          <View style = {{flex:1,justifyContent:'center'}}>
            <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text>Book Name</Text>
            <Text>{this.state.requestedBookName}</Text>
            </View>
            <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text> Book Status </Text>
  
            <Text>{this.state.bookStatus}</Text>
            </View>
  
            <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
            onPress={()=>{
              this.sendNotification()
              this.updateBookRequestStatus();
              this.receivedBooks(this.state.requestedBookName)
            }}>
            <Text>I recieved the book </Text>
            </TouchableOpacity>
          </View>
        )
      }
      else
      {
      return(
        // Form screen
          <View style={{flex:1}}>
            <MyHeader title="Request Barters" navigation ={this.props.navigation}/>
  
            <ScrollView>
              <KeyboardAvoidingView style={styles.keyBoardStyle}>
                <TextInput
                  style ={styles.formTextInput}
                  placeholder={"enter book name"}
                  onChangeText={(text)=>{
                      this.setState({
                          bookName:text
                      })
                  }}
                  value={this.state.bookName}
                />
                <TextInput
                  style ={[styles.formTextInput,{height:300}]}
                  multiline
                  numberOfLines ={8}
                  placeholder={"Why do you need the book"}
                  onChangeText ={(text)=>{
                      this.setState({
                          reasonToRequest:text
                      })
                  }}
                  value ={this.state.reasonToRequest}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{ this.addRequest(this.state.bookName,this.state.reasonToRequest);
                  }}
                  >
                  <Text>Request</Text>
                </TouchableOpacity>
  
              </KeyboardAvoidingView>
              </ScrollView>
          </View>
      )
    }
  }
  }
  
  const styles = StyleSheet.create({
    keyBoardStyle : {
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
      },
    }
  )
  
  
  