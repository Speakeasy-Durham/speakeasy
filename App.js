import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';

import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAkbmuMGHpzdJYyeyhokfO02_oqn9EmlAk",
  authDomain: "tin-can-durm.firebaseapp.com",
  databaseURL: "https://tin-can-durm.firebaseio.com",
  storageBucket: "tin-can-durm.appspot.com"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);



// setupHighscoreListener(userId) {
//   firebase.database().ref('users/' + userId).on('value', (snapshot) => {
//     const highscore = snapshot.val().highscore;
//     console.log("New high score: " + highscore);
//   });
// }

export default class App extends React.Component {
  state = {
    assetsAreLoaded: false,
  };

  // storeHighScore(userId, score) {
  //   firebase.database().ref('users/' + userId).set({
  //     highscore: score
  //   });
  // }

  componentWillMount() {
    this._loadAssetsAsync();
  };

  render() {
    if (!this.state.assetsAreLoaded && !this.props.skipLoadingScreen) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' &&
            <View style={styles.statusBarUnderlay} />}
          <RootNavigation />
        </View>
      );
    }
  }

  async _loadAssetsAsync() {
    try {
      await Promise.all([
        Asset.loadAsync([
          require('./assets/images/robot-dev.png'),
          require('./assets/images/robot-prod.png'),
        ]),
        Font.loadAsync([
          // This is the font that we are using for our tab bar
          Ionicons.font,
          // We include SpaceMono because we use it in HomeScreen.js. Feel free
          // to remove this if you are not using it in your app
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
        ]),
      ]);
    } catch (e) {
      // In this case, you might want to report the error to your error
      // reporting service, for example Sentry
      console.warn(
        'There was an error caching assets (see: App.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e);
    } finally {
      this.setState({ assetsAreLoaded: true });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  text: {
    color: 'red',
    fontSize: 20,
  },
});
