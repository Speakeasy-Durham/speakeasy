import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

    // import children
import SpokePlayer from './_SpokePlayer';

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
        </View>
        <SpokePlayer />
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
    // width: Layout.window.width
  },
  imageContainer: {
    padding: 10
  },
  image: {
    width: 50,
    height: 50
  },
  name: {

  },
  infoContainer: {
    flexDirection: 'row',
    
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoNumber: {

  },
  infoType: {

  }
})
