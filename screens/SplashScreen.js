import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  Platform,
  ScrollView,
  View
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';

export default class SplashScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  _initializeApp() {
    var _this = this;
    setTimeout(
      function () {
        _this.setState({isReady: true});
      },
      2500
    )
  }

  _navigateTo(routeName: string) {
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
       key: null
    });
    this.props.navigation.dispatch(actionToDispatch);
  }

  componentDidMount() {
    this._initializeApp();
  }

  componentDidUpdate() {
    if (this.state.isReady) {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this._navigateTo('Main')
        } else {
          this._navigateTo('Signup')
        }
      })
    }
  }

  render() {
    return (
      <Image source={require('../assets/images/splashscreen.png')} style={styles.splashImage} />
    )
  }

  initializeApp() {
    var _this = this;
    setTimeout(
      function () {
        _this.setState({isReady: true});
      },
      2500
    )
  }

  _navigateTo(routeName: string) {
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
      key: null
    });

    this.props.navigation.dispatch(actionToDispatch);
  }
}

const styles = StyleSheet.create({
  splashImage: {
    flex: 1,
    width: undefined,
    height: undefined,
  }
})
