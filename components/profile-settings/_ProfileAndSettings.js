import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

    // import children
import RecordingPlayer from './_RecordingPlayer';

export default class ProfileAndSettings extends Component {
  render () {
    return (
      <View style={styles.main}>
        <View style={styles.profileBarContainer}>
          <View style={styles.imageContainer}>
            <Image
              resizeMode="contain"
              // source={{uri: ""}}
              style={styles.image}
            />
            <Text style={styles.name}>Profile Name</Text>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.info}>
              <Text style={styles.infoNumber}>
                ##
              </Text>
              <Text style={styles.infoType}>
                posts
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoNumber}>
                ##
              </Text>
              <Text style={styles.infoType}>
                followers
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoNumber}>
                ##
              </Text>
              <Text style={styles.infoType}>
                following
              </Text>
            </View>
          </View>
          <View style={styles.settingsContainer}>
            <Text>
              (s)
            </Text>
          </View>
        </View>
        <ScrollView style={styles.recordingsContainer}>
          <RecordingPlayer />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "pink"
  },
  profileBarContainer: {
    backgroundColor: '#FFF',
    borderBottomColor: '#000',
    flexDirection: 'row'
  },
  imageContainer: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 1,
  },
  image: {
    width: 56,
    height: 56,
    backgroundColor: '#000',
  },
  name: {
    marginTop: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    borderColor: 'red',
    borderWidth: 1,
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 8
  },
  infoNumber: {
    marginTop: 4,
    fontSize: 16
  },
  infoType: {
    marginTop: 8,
    fontSize: 12
  },
  settingsContainer: {
    flexDirection: 'column',
    flex: 0,
    minWidth: 48,
    // minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'blue',
    borderWidth: 1,
  }
})
