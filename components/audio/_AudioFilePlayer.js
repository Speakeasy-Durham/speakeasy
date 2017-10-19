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
    // this.sound = null;
    this.audioSource = { uri: this.props.audio };
    this.sound = null;
    this.state = {
      isLoading: false,
      isPlaybackAllowed: false,
      shouldPlay: false,
      isPlaying: false,

    }
    this._testClick = this._testClick.bind(this);
  }


  // create sound Object
  async _loadSound() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
    try {
      await this.sound.loadAsync(this.audioSource);
      await this.sound.playAsync();
      console.log(this.sound);
      } catch (error) {
        console.log(error);
      }
    }


  componentWillMount() {
    this.sound = new Expo.Audio.Sound();
    this._loadSound();
  }

  componentDidMount() {
    this.setState({
      isPlaybackAllowed: true,
      shouldPlay: true,
      isPlaying: true
    })
    console.log(this.sound);
  }

  async _enablePlayback() {
    this.setState({
      isLoading: true,
    });
  }

  _testClick() {
    console.log(this.sound);
  }

  render () {
    console.log("now rendering AudioFilePlayer");
    console.log(this.props.audio);
    return (
      <View style={styles.playerContainer}>
        <View style={styles.sliderContainer}>
          {/* <Text> `${ this.props.audio }` </Text> */}
        </View>
        <TouchableHighlight style={styles.heartContainer}
          onPress={ this._testClick }>
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
    marginTop: 8,
    paddingTop: 8,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ff634722',
  },

  heartContainer: {
    width: width*0.2,
    alignItems: 'center',
    justifyContent: 'center',

  },
  sliderContainer: {
    width: width*0.5,
  }
})
