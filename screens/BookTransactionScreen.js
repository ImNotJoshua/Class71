import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet,TextInput,Image, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from 'firebase';
import db from '../config';

export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        buttonState: 'normal',
        scanBookID: '',
        scanStudentID: '',
        transactionMessage:'',
      }
    }

    getCameraPermissions = async (id) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: 'clicked',
        scanned: false,
        buttonState: id
      });
    }

    handleBarCodeScanned = async({type, data})=>{
      this.setState({
        scanned: true,
        scannedData: data,
        buttonState: 'normal'
      });
    }

    handleTransaction=async()=>{
      var transactionMessage;
      db.collection("books").doc(this.state.scanBookID).get()
      .then((doc)=>{
        var book=doc.data()
        if(book.bookAvail){
          this.initiateBookIssue()
          transactionMessage="Book Issue"
        }
        else{
          this.initiateBookReturn();
          transactionMessage="Book Return";
        }
      })
      this.setState({
        transactionMessage:transactionMessage,
      })
    }

    initiateBookIssue=async()=>{
      db.collection("transactions").add({
        'studentID':this.state.scanStudentID,
        'bookID':this.state.scanBookID,
        'transcationType':'Issue',
        'date':firebase.firestore.Timestamp.now().toDate(),
      })

      db.collection("books").doc(this.state.scanBookID).update({
        bookAvail:'false',
      })
      
      db.collection("books").doc(this.scanStudentID).update({
          'booksIssued':firebase.firestore.FieldValue.increment(1)
      })
      Alert.alert("Book ISsued!");

      this.setState({
        scanStudentID:'',
        scanBookID:'',
      })
      
        
    }
    initiateBookReturn=async()=>{
      db.collection("transactions").add({
        'studentID':this.state.scanStudentID,
        'bookID':this.state.scanBookID,
        'transactionType':'Return'
      })
      db.collection("books").doc(this.this.state.scanBookID).update({
        bookAvail:'true'
      })
      db.collection("students").doc(this.scanStudentID).update({
        'booksIssued':firebase.firestore.FieldValue.increment(-1)
    })
    Alert.alert("Book Returned!");

    this.setState({
      scanBookID:'',
      scanBookID:'',
    })
  
    }

    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <View style={styles.container}>
              <View>
                 {//<Image source={require("../assets/booklogo.jpg")} style={{width:200, height: 200}}></Image>
                  } <Text> Willy </Text>
              </View>
              <View style={styles.inputView}>
                  <TextInput style={styles.inputBox} placeholder="bookID" value= {this.state.scanBookID}></TextInput>
          <TouchableOpacity
            onPress={this.getCameraPermissions("bookId")}
            style={styles.scanButton}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.inputView}>
                  <TextInput style={styles.inputBox} placeholder="studentID" value= {this.state.scanStudentID}></TextInput>
          <TouchableOpacity
            onPress={this.getCameraPermissions("studentID")}
            style={styles.scanButton}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.submitButton} onPress={async()=>{this.handleTransaction()}}>
              <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
          </View>
        </View>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    submitButton:{
      backgroundColor:"#34fe78",
      width:100,
      height:50,
    },
    submitText:{
      padding: 10,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white'
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 20,
    }
  }); 
