import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import * as firebase from 'firebase';

 const resetStack = NavigationActions.reset({
   index: 0,
   actions: [
     NavigationActions.navigate({ routeName: 'Main' })
   ]
 });

export default class SignupScreen extends React.Component {
  static navigationOptions = {
    header: null
  }


  async logInGoogle(accessToken) {
      try {
        const result = await Expo.Google.logInAsync({
          behavior: 'web',
          androidClientId: "464757889372-7rot9u82fm6ncvpec4cl4kng4elo10mk.apps.googleusercontent.com",
          iosClientId: "464757889372-0l11hjb6nmrstbfp56q437l17sq68tqu.apps.googleusercontent.com",
          scopes: ['profile', 'email'],
        });
        if (result.type === 'success') {
          return result.accessToken;
        } else {
          return {cancelled: true};
        }
      } catch(e) {
        return {error: true};
      }
  }

  checkLoggedIn() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.dispatch(resetStack);
      }
    });
  }

  async logInFB() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('113477732653798', {
        permissions: ['public_profile', 'email'],
      });
    if (type === 'success') {
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,picture,email&access_token=${token}`);
      const fbInfo = await response.json();
      let access_token = token;
      var credential = firebase.auth.FacebookAuthProvider.credential(access_token);
      firebase.auth().signInWithCredential(credential).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
      });
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
          return firebase.auth().signInWithEmailAndPassword(email, password);
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
        });
      Alert.alert(
        'Logged in!',
        `Hi ${fbInfo.name}!`,
      );
      this.props.navigation.dispatch(resetStack);
    }
  }

  _handleFacebookAuth = ()  => {
    this.logInFB();
  }

  _handleGoogleAuth = () => {
    this.logInGoogle();
  }
  render () {
    this.checkLoggedIn();
    return (
      <View style={styles.main}>
        <Text style={styles.mainText}>This is the signup Screen</Text>
        <Button
          onPress={this._handleFacebookAuth}
          title="Facebook"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this._handleGoogleAuth}
          title="Google"
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
    color: "gray",
    fontSize: 30,
  },
})
