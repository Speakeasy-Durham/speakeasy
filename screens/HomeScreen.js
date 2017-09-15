import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Alert
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';
import _FeedSong from '../components/feed/_FeedRecording.js';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userPhoto: null,
      userEmail: null,
      userUid: null,
      userName: null,
    };
  }
  static navigationOptions = {
    title: 'Feed',
  };

  componentWillMount() {
    var user = firebase.auth().currentUser;
    this.setState({userPhoto: user.providerData[0].photoURL});
    this.setState({userEmail: user.providerData[0].email});
    this.setState({userUid: user.providerData[0].uid});
    this.setState({userName: user.providerData[0].displayName});
  }
    render() {
      return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          <_FeedSong
            userUid={this.state.userUid}
            userEmail={this.state.userEmail}
            userPhoto={this.state.userPhoto}
            userName={this.state.userName}
          />
          <View style={styles.getStartedContainer}>
              <Button
                onPress={this._handleLogOut}
                title="Logout of App"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
              />
            </View>
          </ScrollView>
        </View>
    );
  }

  _handleLogOut = () => {
      this._navigateTo('Signup');
      firebase.auth().signOut().then(user => {
        Alert.alert(
          "You're logged out."
        );
      }, function(error) {
        console.log(error);
    });
  }

  _navigateTo(routeName: string){
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })]
    })
      this.props.navigation.dispatch(actionToDispatch)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feedRecordingContainer: {
    borderRadius: 2,
  },
})
