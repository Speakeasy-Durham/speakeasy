import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import * as firebase from 'firebase';

import ProfileAndSettings from '../components/profile-settings/_ProfileAndSettings';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'User\'s name',
  };

  constructor(props) {
    super(props);
    this.state = {
      userPhoto: null,
      userEmail: null,
      userUid: null,
      userName: null,
    };
  }

  componentWillMount() {
    var user = firebase.auth().currentUser;
    this.setState({userPhoto: user.providerData[0].photoURL});
    this.setState({userEmail: user.providerData[0].email});
    this.setState({userUid: user.providerData[0].uid});
    this.setState({userName: user.providerData[0].displayName});
  }


  render() {
    return (
      <ScrollView style={styles.container}>
        <ProfileAndSettings
          userUid={this.state.userUid}
          userEmail={this.state.userEmail}
          userPhoto={this.state.userPhoto}
          userName={this.state.userName}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: 'pink',
  },
});
