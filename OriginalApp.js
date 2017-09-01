import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Feed from './components/feed/_Feed.js';
    //
import * as firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyAkbmuMGHpzdJYyeyhokfO02_oqn9EmlAk",
  authDomain: "tin-can-durm.firebaseapp.com",
  databaseURL: "https://tin-can-durm.firebaseio.com",
  projectId: "tin-can-durm",
  storageBucket: "tin-can-durm.appspot.com",
  messagingSenderId: "464757889372"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Feed />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});
