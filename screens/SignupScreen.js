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

  checkLoggedIn() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.dispatch(resetStack);
      }
    });
  }

  async logInGoogle() {

      try {
        const result = await Expo.Google.logInAsync({
          behavior: 'web',
          iosClientId: "464757889372-ug65j7ujl3013g51l4jb1mj6rqdc77mi.apps.googleusercontent.com",
          scopes: ['profile', 'email'],
        });

        if (result.type === 'success') {
          var credential = firebase.auth.GoogleAuthProvider.credential(null, result.accessToken);
          firebase.auth().signInWithCredential(credential).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
          });
          firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(function() {
              return firebase.auth().signInWithEmailAndPassword(email, password);
            })
            .catch(function(error) {
              var errorCode = error.code;
              var errorMessage = error.message;
            });
          Alert.alert(
            'Logged in!',
          );
          this.props.navigation.dispatch(resetStack);
          return result.accessToken;
        } else {
          return {cancelled: true};
        }
      } catch(e) {
        console.log(e);
        return {error: true};
      }
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
