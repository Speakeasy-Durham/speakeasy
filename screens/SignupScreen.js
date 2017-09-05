import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert
} from 'react-native';
import { NavigationActions } from 'react-navigation';

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





 // dismissed and go to the homescreen (navigation)
 // it will need to see if you are signed in
 // use async storage to figure out if signed in
 // use storage to add information about user

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

  // storeHighScore(userId, score) {
  //   firebase.database().ref('users/' + userId).set({
  //     highscore: score
  //   });
  // }

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



  async logInFB() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('113477732653798', {
        permissions: ['public_profile'],
      });
    if (type === 'success') {

      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`);

      const fbInfo = await response.json();
      console.log(fbInfo);

      Expo.SecureStore.setValueWithKeyAsync(fbInfo.id, "fbId").then( () => {
        Expo.SecureStore.getValueWithKeyAsync("fbId")
          .then( result => console.log(result))
          .catch( error => console.log(error));
      });
        // console.log(fbToken);
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
        <Button
          onPress={this._handleGoogleAuth}
          title="Google+"
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
