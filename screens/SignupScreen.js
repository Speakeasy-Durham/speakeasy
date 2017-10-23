import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
  TouchableHighlight,
} from 'react-native';
import Font from 'expo';
import { Ionicons } from '@expo/vector-icons';
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
            "You're logged in!",
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

  render () {
    this.checkLoggedIn();
    return (
      <View style={styles.main}>
        <Text style={styles.headerText}>SPEAKEASY</Text>
        <TouchableHighlight onPress={this._handleFacebookAuth} style={styles.touchableBtn}>
          <View style={styles.facebookButton}>
            <Ionicons name="logo-facebook" size={24} color="white" style={styles.providerIcon} />
            <Text style={styles.providerText}>Login with Facebook</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._handleGoogleAuth} style={styles.touchableBtn}>
          <View style={styles.googleButton} >
            <Ionicons name="logo-google" size={24} color="white" style={styles.providerIcon} />
            <Text style={styles.providerText}>Login with Google</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}
const fbBlue = 'rgb(59,89,152)';
const googRed = '#ea4335';
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "rgb(234, 231, 222)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "black",
    fontSize: 40,
    fontFamily: 'monoton-regular',
    marginBottom: 44,
  },
  facebookButton: {
    width: 250,
    height: 44,
    backgroundColor: fbBlue,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleButton: {
    width: 250,
    height: 44,
    backgroundColor: googRed,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  touchableBtn: {
    marginBottom: 12,
    borderRadius: 12,
  },
  providerText: {
    color: "white",
  },
  providerIcon: {
    marginRight: 8,
  }
})
