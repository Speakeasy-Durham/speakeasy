import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert
} from 'react-native';
    // import children
    // import * as firebase from 'firebase';
    //
    // const firebaseConfig = {
    //   apiKey: "AIzaSyAkbmuMGHpzdJYyeyhokfO02_oqn9EmlAk",
    //   authDomain: "tin-can-durm.firebaseapp.com",
    //   databaseURL: "https://tin-can-durm.firebaseio.com",
    //   storageBucket: "tin-can-durm.appspot.com"
    // };
    //
    // const firebaseApp = firebase.initializeApp(firebaseConfig);

    async function logIn() {
      const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('113477732653798', {
          permissions: ['public_profile'],
        });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`);
        Alert.alert(
          'Logged in!',
          `Hi ${(await response.json()).name}!`,
        );
      }
    }

 // dismissed and go to the homescreen (navigation)
 // it will need to see if you are signed in
 // use async storage to figure out if signed in
 // use storage to add information about user
export default class SignupScreen extends Component {
  
  // storeHighScore(userId, score) {
  //   firebase.database().ref('users/' + userId).set({
  //     highscore: score
  //   });
  // }

  _handleFacebookAuth = ()  => {
    logIn();
  }



  render () {
    // storeHighSchore("swallsy", 4500);

    return (
      <View style={styles.main}>
        <Text style={styles.mainText}>This is the signup Screen</Text>
        <Button
          onPress={this._handleFacebookAuth}
          title="Facebook"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "pink",
  },
  mainText: {
    color: "white",
    fontSize: 30,
  },
})
