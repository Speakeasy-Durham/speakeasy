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

const width = Dimensions.get('window').width,
      height = Dimensions.get('window').height;

console.log(width);
console.log(height);

export default class AudioFilePlayer extends Component {
  constructor(props) {
    super(props);

  }

  render () {
    console.log("now rendering AudioFilePlayer");
    console.log(this.props.audio);
    return (
      <View style={styles.playerContainer}>
        <View style={styles.sliderContainer}>
          <Text> `${ this.props.audio }` </Text>
        </View>
        <TouchableHighlight style={styles.heartContainer}>
            <Ionicons
              name={`ios-heart`}
              size={28}
              color='#ff6347'/>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  playerContainer: {
    flex: 1,
    paddingTop: 4,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  heartContainer: {
    width: width*0.2,
    alignItems: 'center',
    justifyContent: 'center',

  },
  sliderContainer: {
    width: width*0.7,
  }
})
