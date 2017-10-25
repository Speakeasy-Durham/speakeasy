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

import Colors from '../../constants/Colors';

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
      activePost: null,
      isLoading: false,
      isPlaybackAllowed: false,
      shouldPlay: false,
      isPlaying: false,
      muted: false,
      soundDuration: null,
      soundPosition: null,

    }
    // this._stopSound = this.stopSound.bind(this);
    // this._loadSound = this.loadSound.bind(this);
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
      // console.log(this.sound);
      } catch (error) {
        console.log(error);
      }
    }

  // async _stopSound() {
  //     await this.sound.stopAsync();
  //     await this.sound.unloadAsync();
  //     console.log("_stopSound");
  //     this.sound = null;
  // }

  componentWillMount() {
    this.sound=null;
  }

  componentDidMount() {
    this.setState({
      activePost: this.props.activePost
    })
    this.setState({
      isPlaybackAllowed: true,
      shouldPlay: true,
      isPlaying: true
    })

  }

  async _enablePlayback() {
    this.setState({
      isLoading: true,
    });
  }

  render () {
    // console.log("now rendering AudioFilePlayer");

    if (this.props.shouldPlay === true) {
      // if (this.sound != null) {
      //   console.log("Sound already playing, stopAsync");
      //   this._stopSound();
      //
      //  } else {
        console.log("this.sound");
        console.log(this.sound);
        this.sound = new Expo.Audio.Sound();
        this._loadSound();
        console.log("Sound " + this.props.id + " should play")
      // }
    }

    if (this.sound !== null && this.props.shouldPlay === false) {
      this.sound.unloadAsync()
      console.log("Sound " + this.props.id + " should stop")
    }

    return (
      <View style={styles.container}>
        <View style={styles.sliderContainer}>
          <Text style={ this.props.shouldPlay ?
            styles.durationText_active :
            styles.durationText_inactive
          }> {this.props.duration} </Text>
        </View>
        {this.props.shouldPlay ?
          <View style={styles.playerContainer}>


            {/* <TouchableHighlight
              style={styles.heartContainer}
              // onPress={ this._testClick }
            >
              <View>
                <Ionicons
                  name={`ios-heart`}
                  size={28}
                  color='#ff6347'/>
                </View>
            </TouchableHighlight> */}
          </View>
        : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  playerContainer: {

    marginTop: 0,
    paddingTop: 0,

  },
  durationText_inactive: {
    fontFamily: 'space-mono-regular',
    color: Colors.fontColorLight,
    fontSize: 18,
  },
  durationText_active: {
    fontFamily: 'space-mono-regular',
    color: Colors.accentGreen,
    fontSize: 24,
  },
  heartContainer: {
    width: width*0.2,
    alignItems: 'center',
    justifyContent: 'center',

  },
  sliderContainer: {
    // width: width*0.5,
  }
})
