import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Slider,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from 'expo';


export default class AudioFilePlayer extends Component {
  constructor(props) {
    super(props);

  }

  render () {
    console.log("now rendering AudioFilePlayer");
    console.log(this.props.audio);
    return (
      <View style={styles.playerContainer}>
        <Text> `${ this.props.audio }` </Text>
        <TouchableHighlight style={styles.heartContainer}>
            <Ionicons
              name={`ios-heart`}
              size={28} />
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  playerContainer: {
    flex: 1,
  },

  heartContainer: {
    flex: 1,
  }
})
