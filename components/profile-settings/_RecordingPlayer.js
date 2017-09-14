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
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from 'expo';
    // import children

class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

const ICON_PLAY_BUTTON = new Icon(
  require('../../assets/images/play_button.png'),
  34,
  51
);
const ICON_PAUSE_BUTTON = new Icon(
  require('../../assets/images/pause_button.png'),
  34,
  51
);
const ICON_TRACK_1 = new Icon(require('../../assets/images/track_1.png'), 166, 5);

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');


export default class RecordingPlayer extends Component {
  constructor(props) {
    super(props);
    this.sound = null;
    this.isSeeking = false;
    this.state = {
      isLoading: false,
      isPlaybackAllowed: false,
      muted: false,
      soundPosition: null,
      soundDuration: null,
      shouldPlay: false,
      isPlaying: false,
      volume: 1.0,
      rate: 1.0,
      testPlay: false,
      animation: new Animated.Value()
    };
  }

  componentDidMount() {
    (async () => {
      await Font.loadAsync({
        'space-mono-regular': require('../../assets/fonts/SpaceMono-Regular.ttf'),
      });
      this.setState({ fontLoaded: true });
    })();
  }

  _updateScreenForSoundStatus = status => {
    if (status.isLoaded) {
      this.setState({
        soundDuration: status.durationMillis,
        soundPosition: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
        isPlaybackAllowed: true,
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false,
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _onPlayPausePressed = () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        this.setState({
          testPlay: true
        });
        this.sound.pauseAsync();
      } else {
        this.setState({
          testPlay: false
        });
        this.sound.playAsync();
      }
    }
  };

  _getPlaybackTimestamp() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.soundPosition
      )} / ${this._getMMSSFromMillis(this.state.soundDuration)}`;
    }
    return '';
  }

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }


  // render () {
  //   return (
  //     <View style={styles.container}>
  //       <Text>
  //         This will be an audio player.
  //       </Text>
  //     </View>
  //   )
  // }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.playerContainer}>
          <TouchableHighlight
            style={styles.playStopContainer}
            onPress={this._onPlayPausePressed}
          >
              <Text>></Text>
          </TouchableHighlight>
          <View style={styles.recordingInfoContainer}>
            <Text>Title</Text>
          </View>
          <View style={styles.playbackTimeContainer}>
            <Text>0:00</Text>
          </View>
        </View>
        <View style={styles.sliderContainer}>
          <Slider style={styles.slider} />
        </View>
      </View>
    )
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    borderColor: '#333',
    borderWidth: 1,
  },
  playerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    minHeight: 36,
    flexWrap: 'wrap',
  },
  playStopContainer: {
    flex: 1,
    borderColor: 'green',
    borderWidth: 1,
  },
  recordingInfoContainer: {
    flex: 2,
    borderColor: 'red',
    borderWidth: 1,
  },
  playbackTimeContainer: {
    flex: 1,
    borderColor: 'blue',
    borderWidth: 1,
  },
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  slider: {
    width: DEVICE_WIDTH * 0.8,
  },

  testPlayTrue: {
    minHeight: 36,
  },
  testPlayFalse: {
    minHeight: 18,
  }
})
