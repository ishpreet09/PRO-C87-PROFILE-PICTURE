import firebase from 'firebase';
require('@firebase/firestore');


var firebaseConfig = {
    apiKey: "AIzaSyBwC1jblgBY8AukvHpz54r7KiENSRPnDH8",
    authDomain: "pro-c77.firebaseapp.com",
    projectId: "pro-c77",
    storageBucket: "pro-c77.appspot.com",
    messagingSenderId: "258381873724",
    appId: "1:258381873724:web:ca247746c0d59f672c3939"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();