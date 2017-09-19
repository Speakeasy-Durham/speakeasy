import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import * as firebase from 'firebase';

import ProfileAndSettings from '../components/profile-settings/_ProfileAndSettings';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'User\'s name',
  };


  render() {
    return (
      <ScrollView style={styles.container}>
        <ProfileAndSettings />
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
