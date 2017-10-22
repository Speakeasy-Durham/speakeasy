// import React from 'react';
import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Slider,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Button,
  TextInput,
  Alert
} from 'react-native';
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from 'expo';
import { RNS3 } from 'react-native-aws3';
import * as firebase from 'firebase';
import { NavigationActions } from 'react-navigation';
import Colors from '../../constants/Colors';
// import ModalExample from './_PostRecordingModal';

class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

const ICON_RECORD_BUTTON = new Icon(require('../../assets/images/record.png'), 50, 50);
const ICON_PLAY_BUTTON = new Icon(require('../../assets/images/play.png'), 50, 50);
const ICON_PAUSE_BUTTON = new Icon(require('../../assets/images/pause.png'), 50, 50);
const ICON_SAVE_BUTTON = new Icon(require('../../assets/images/save.png'), 50, 50);
const ICON_DELETE_BUTTON = new Icon(require('../../assets/images/delete.png'), 50, 50);
const ICON_VOLUME_BUTTON = new Icon(require('../../assets/images/sound.png'), 67, 58);

const ICON_RECORDING = new Icon(require('../../assets/images/dots.png'), 15, 15);
const ICON_TRACK_1 = new Icon(require('../../assets/images/slider.png'), 166, 5);
const ICON_THUMB_1 = new Icon(require('../../assets/images/thumbslider.png'), 25, 25);
const ICON_THUMB_2 = new Icon(require('../../assets/images/thumbslider.png'), 25, 25);

const TAPE = new Icon(require('../../assets/images/tape6.png'), 100, 100);
const SPEAKER = new Icon(require('../../assets/images/speaker3.png'), 100, 100);

const { width: DEVICE_WIDTH,
       height: DEVICE_HEIGHT } = Dimensions.get('window');

const DISABLED_OPACITY = 0.5;
const RATE_SCALE = 3.0;

export default class _NewRecording extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      haveRecordingPermissions: false,
      isLoading: false,
      isPlaybackAllowed: false,
      muted: false,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      text: "Your title goes here",
    };
    this.recordingSettings = JSON.parse(
      JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY)
    );
    // // UNCOMMENT THIS TO TEST maxFileSize:
    // this.recordingSettings.android['maxFileSize'] = 12000;
  }

  componentDidMount() {
    (async () => {
      await Font.loadAsync({
        'space-mono-regular': require('../../assets/fonts/SpaceMono-Regular.ttf'),
        'monoton-regular': require('../../assets/fonts/Monoton-Regular.ttf'),
      });
      this.setState({ fontLoaded: true });
    })();
    this._askForPermissions();
  }

  _askForPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === 'granted',
    });
  };

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

  _updateScreenForRecordingStatus = status => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
      });
      if (!this.state.isLoading) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };

  async _stopPlaybackAndBeginRecording() {
    this.setState({
      isLoading: true,
    });
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);
    this.recording = recording;
    await this.recording.startAsync();
    await setTimeout(() => {
      this.recording.stopAndUnloadAsync()}, 30000);
    this.setState({
      isLoading: false,
    });
  }

  async _stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true,
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
    const { sound, status } = await this.recording.createNewLoadedSound(
      {
        isLooping: true,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      this._updateScreenForSoundStatus
    );
    this.sound = sound;
    this.setState({
      isLoading: false,
    });
  }

  async _saveRecordingAndPost() {
    const info = await FileSystem.getInfoAsync(this.recording.getURI());
    const jsonInfo = (`${JSON.stringify(info)}`);
    const newUri = info.uri;
    let user = firebase.auth().currentUser;
    let userId = user.providerData[0].uid;
    const file = {
  // `uri` can also be a file system path (i.e. file://)
      uri: `${newUri}`,
      name: `${userId + Date.now()}.caf`,
      title: `${this.state.text}`,
      type: "testaudio/caf"
    }
    const jsonFile = (`${JSON.stringify(file)}`);
    console.log("this is the file and right before options are built for S3 " + file);
    const options = {
      keyPrefix: "uploads/",
      bucket: "tin-can",
      region: "us-east-2",
      accessKey: "AKIAI6DKQKOMLHFF5KDQ",
      secretKey: "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",
      successActionStatus: 201
    }
    let audioLocation = await this._uploadFileToS3(file, options);
    console.log("this is the passed through audio location", audioLocation);
    this._addRecordingToFirebase(audioLocation);
  }

  async _uploadFileToS3(file, options) {
    let s3Response = RNS3.put(file, options);
    let audioLoc = await s3Response.then(response => {
      const responseJson = (`${JSON.stringify(response)}`);
      let urlLocation = responseJson.location;
      if (response.status !== 201)
      throw new Error("Failed to upload file to S3");
      let audioLocation = response.body.postResponse.location;
      return audioLocation;
    });
    return audioLoc;
  }

  async _addRecordingToFirebase(audioLocation) {
    let user = firebase.auth().currentUser;
    let userId = user.providerData[0].uid;
    let date = Date.now();
    let recordingId = date + "_" + user.providerData[0].uid;
    let recordingDate = date;
    let name = user.providerData[0].displayName;
    let imageUrl = user.providerData[0].photoURL;

    firebase.database().ref('recordings/' + recordingId).set({
      username: name,
      userId: userId,
      audio: audioLocation,
      profile_picture: imageUrl,
      date: recordingDate,
      text: this.state.text,
      sound_position: this.state.soundPosition,
      sound_duration: this.state.soundDuration
    })
    console.log("added to firebase");
    console.log(recordingId);
  }

  async _deleteRecording() {
    this.setState({
      soundDuration: null,
      soundPosition: null,
      isPlaybackAllowed: false,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      text: "Your title goes here"
    })
  }

  _onRecordPressed = () => {
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
    } else {
      this._stopPlaybackAndBeginRecording();
    }
  };

  _onPlayPausePressed = () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        this.sound.pauseAsync();
      } else {
        this.sound.playAsync();
      }
    }
  };

  // _myAction = () => {
  //  const nav = NavigationActions.navigate({
  //    action: NavigationActions.navigate({ routeName: 'HomeScreen' })
  //  });
  //  return nav;
  // };

  // _returnHome(routeName: string) {
  //   const actionToDispatch = NavigationActions.reset({
  //     index: 0,
  //     actions: [NavigationActions.navigate({ routeName })]
  //   })
  //   this.props.navigation.dispatch(actionToDispatch)
  // };

  _postAndGoHome = () => {
    this.props.navigation.navigate('Home')
  }

  _onSavePressed = () => {
    if (this.state.isPlaybackAllowed) {
      if (this.sound != null) {
        this.sound.stopAsync();
        Alert.alert(
          'New Recording',
          'Share this recording with the community?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'POST', onPress: () => {
              this._saveRecordingAndPost();
              // this._postAndGoHome;
            }
          },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          'New Recording',
          'Share this recording with the community?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'POST', onPress: () => {
              this._saveRecordingAndPost();
              // this._postAndGoHome;
            }
          },
          ],
          { cancelable: false }
        );
      }
    }
  }





  _onDeletePressed = () => {
    if (this.state.isPlaybackAllowed) {
      this._deleteRecording();
    }
  }

  _onMutePressed = () => {
    if (this.sound != null) {
      this.sound.setIsMutedAsync(!this.state.muted);
    }
  };

  _onVolumeSliderValueChange = value => {
    if (this.sound != null) {
      this.sound.setVolumeAsync(value);
    }
  };

  _onSeekSliderValueChange = value => {
    if (this.sound != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.sound.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async value => {
    if (this.sound != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.soundDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.sound.playFromPositionAsync(seekPosition);
      } else {
        this.sound.setPositionAsync(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return this.state.soundPosition / this.state.soundDuration;
    }
    return 0;
  }

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    // const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    // return padWithZero(minutes) + ':' + padWithZero(seconds);
    return padWithZero(seconds);
  }

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

  _getRecordingTimestamp() {
    if (this.state.recordingDuration != null) {
      return `${this._getMMSSFromMillis(this.state.recordingDuration)}`;
    }
    return `${this._getMMSSFromMillis(0)}`;
  }

  render() {
    return !this.state.fontLoaded
      ? <View style={styles.emptyContainer} />
      : !this.state.haveRecordingPermissions
        ? <View style={styles.container}>
            <View />
            <Text
              style={[
                styles.noPermissionsText,
                { ...Font.style('space-mono-regular') },
              ]}>
              You must enable audio recording permissions in order to use this
              app.
            </Text>
            <View />
          </View>
        : <View style={styles.container}>
            <View
              style={[
                styles.topScreenContainer,
              ]}>
              <View />
                <View style={styles.speakerContainer}>
                  <Image
                    source={SPEAKER.module}
                    style={styles.speaker}
                  >
                    {/* <View style={styles.brandBackdrop}>
                      <Text
                        style={[
                          styles.brandName,
                          { ...Font.style('monoton-regular') },
                        ]}>
                        SPEAKEASY
                      </Text>
                    </View> */}
                  </Image>
                </View>
              <View />
            </View>

            <View
              style={[
                styles.middleScreenContainer,
              ]}>
              <View />
                <View
                  style={styles.tapeContainer}
                >
                  <Image
                    source={TAPE.module}
                    style={styles.tape}
                  >
                    <TextInput
                       style={[
                         styles.recordingName,
                         { ...Font.style('space-mono-regular') },
                       ]}
                       onChangeText={(text) => this.setState({text})}
                       value={this.state.text}
                    />
                  </Image>
                </View>
              <View />
            </View>



            <View
              style={[
                styles.bottomScreenContainer,
              ]}>
              <View />

              <View
                style={[
                  styles.controlsContainerBase,
                  // styles.buttonsContainerTopRow,
                ]}>

                <View style={styles.recordingDataRowContainer}>
                  {/* <Image
                    style={[
                      styles.image,
                      // { opacity: this.state.isRecording ? 1.0 : 0.0 },
                      styles.stretch
                    ]}
                    source={ICON_RECORDING.module}
                  /> */}
                  <Text
                    style={[
                      styles.recordingTimestamp,
                      { ...Font.style('space-mono-regular') },
                    ]}>
                    {this._getRecordingTimestamp()}
                  </Text>

                  <Text
                    style={[
                      styles.liveText,
                      { ...Font.style('space-mono-regular') },
                    ]}>
                    {this.state.isRecording ? 'LIVE' : ''}
                  </Text>

                  <View >
                    <View />

                    <View style={styles.recordingDataContainer}>
                      <View />


                      <Text
                        style={[
                          styles.playbackTimestamp,
                          { ...Font.style('space-mono-regular') },
                        ]}>
                        {this._getPlaybackTimestamp()}
                      </Text>

                      <View />
                    </View>
                    <View />
                  </View>

                </View>
                <View style={styles.allButtonsContainer}>
                  <TouchableHighlight
                    underlayColor={Colors.liveColor}
                    style={styles.recButtonWrapper}
                    onPress={this._onRecordPressed}
                    disabled={this.state.isLoading}>
                    <View>
                      <Image
                        style={styles.buttonIcon}
                        source={ICON_RECORD_BUTTON.module}
                      />
                      <Text style={styles.buttonText}>REC</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor={Colors.liveColor}
                    style={styles.buttonWrapper}
                    onPress={this._onPlayPausePressed}
                    disabled={
                      !this.state.isPlaybackAllowed || this.state.isLoading
                    }>
                    <View>
                      <Image
                        style={styles.buttonIcon}
                        source={
                          this.state.isPlaying
                            ? ICON_PAUSE_BUTTON.module
                            : ICON_PLAY_BUTTON.module
                        }
                      />
                      <Text style={styles.buttonText}>
                        {this.state.isPlaying ? 'PAUSE' : 'PLAY'}
                      </Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor={Colors.liveColor}
                    style={styles.buttonWrapper}
                    onPress={this._onSavePressed}
                    disabled={
                      !this.state.isPlaybackAllowed || this.state.isLoading
                    }>
                    <View>
                      <Image
                        style={styles.buttonIcon}
                        source={ICON_SAVE_BUTTON.module}
                      />
                      <Text style={styles.buttonText}>POST</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor={Colors.liveColor}
                    style={styles.buttonWrapper}
                    onPress={this._onDeletePressed}
                    disabled={
                      !this.state.isPlaybackAllowed || this.state.isLoading
                    }>
                    <View>
                      <Image
                        style={styles.buttonIcon}
                        source={ICON_DELETE_BUTTON.module}
                      />
                      <Text style={styles.buttonText}>DELETE</Text>
                    </View>
                  </TouchableHighlight>
                </View>
                <View />
              </View>

              <View />
            </View>
          </View>;
  }
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: 'stretch',
    backgroundColor: Colors.backgroundColor,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: Colors.backgroundColor,
    minHeight: DEVICE_HEIGHT - 70,
    maxHeight: DEVICE_HEIGHT - 70,
    minWidth: DEVICE_WIDTH,
    minWidth: DEVICE_WIDTH,
    // borderWidth: 2,
    // borderColor: '#228b22',
  },
  topScreenContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: DEVICE_HEIGHT / 3,
    maxHeight: DEVICE_HEIGHT / 3,
    paddingBottom: 10,
  },
  middleScreenContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: DEVICE_HEIGHT / 3,
    maxHeight: DEVICE_HEIGHT / 3,
    paddingBottom: 1,
  },
  bottomScreenContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: DEVICE_HEIGHT / 5,
    maxHeight: DEVICE_HEIGHT / 5,
  },
  controlsContainerBase: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: DEVICE_WIDTH,
    maxWidth: DEVICE_WIDTH,
    backgroundColor: Colors.backgroundColor2,
    // borderWidth: 2,
    // borderColor: '#b0e0e6',
  },
  noPermissionsText: {
    textAlign: 'center',
  },
  recordingDataContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    // minHeight: ICON_RECORD_BUTTON.height,
    // maxHeight: ICON_RECORD_BUTTON.height,
    // minWidth: ICON_RECORD_BUTTON.width * 3.0,
    // maxWidth: ICON_RECORD_BUTTON.width * 3.0,
    // borderWidth: 2,
    // borderColor: Colors.liveColor,
  },
  recordingDataRowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: ICON_RECORDING.height * 2.0,
    maxHeight: ICON_RECORDING.height * 2.0,
    minWidth: DEVICE_WIDTH,
    maxWidth: DEVICE_WIDTH,
    backgroundColor: Colors.backgroundColor,
    // borderWidth: 2,
    // borderColor: '#b22222',///////NEEDS FIXING///////////////////
  },
  playbackContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: ICON_THUMB_1.height * 1.5,
    maxHeight: ICON_THUMB_1.height * 1.5,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: Colors.backgroundColor,
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  tapeContainer: {
    height: DEVICE_WIDTH / 1.725,
    width: DEVICE_WIDTH / 1.15,
    borderRadius: 10,
    marginBottom: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 1,
  },
  tape: {
    height: DEVICE_WIDTH / 1.725,
    width: DEVICE_WIDTH / 1.15,
    // height: 200,
    // width: 300,
    borderRadius: 10,
    borderWidth: 20,
    marginBottom: 4,
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: Colors.accentColor,
  },
  recordingName: {
    backgroundColor: Colors.buttonColor,
    height: DEVICE_WIDTH / 14.5,
    width: DEVICE_WIDTH / 1.7,
    marginTop: 17,
    textAlign: 'left',
  },
  speakerContainer: {
    height: DEVICE_WIDTH / 1.8,
    width: DEVICE_WIDTH / 1.15,
    borderRadius: 10,
    marginBottom: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 1,
  },
  speaker: {
    height: DEVICE_WIDTH / 1.8,
    width: DEVICE_WIDTH / 1.15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'repeat',
    backgroundColor: Colors.backgroundColor2,
  },
  // brandBackdrop: {
  //   backgroundColor: 'rgba(0,0,0,0)',
  // },
  // brandName: {
  //   color: Colors.RECbuttonColor,
  //   fontSize: 25,
  //   backgroundColor: Colors.backgroundColor2,
  // },
  allButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // minWidth: ICON_PLAY_BUTTON.width * 4.5,
    // maxWidth: ICON_PLAY_BUTTON.width * 4.5,
    // minWidth: DEVICE_WIDTH,
    // maxWidth: DEVICE_WIDTH,
    minHeight: ICON_RECORD_BUTTON.height * 2,
    maxHeight: ICON_RECORD_BUTTON.height * 2,
    marginRight: -10,
    marginLeft: -10,
    backgroundColor: Colors.backgroundColor2,
    borderRadius: 4,
    paddingLeft: 5,
    paddingRight: 5,
  },
  recButtonWrapper: {
    borderRadius: 4,
    margin: 5,
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: Colors.RECbuttonColor,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonWrapper: {
    borderRadius: 4,
    margin: 5,
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: Colors.buttonColor,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonIcon: {
    height: 50,
    width: 50,
  },
  buttonText: {
    color: '#000000',
    fontFamily: 'space-mono-regular',
    textAlign: 'center',
    paddingTop: 5,
  },
  playbackSlider: {
    alignSelf: 'stretch',
    backgroundColor: Colors.backgroundColor,
  },
  liveText: {
    color: Colors.liveColor,
    backgroundColor: Colors.buttonColor,
    borderColor: Colors.backgroundColor2,
  },
  recordingTimestamp: {
    marginLeft: 20,
    backgroundColor: Colors.buttonColor,
    borderColor: Colors.backgroundColor2,
  },
  playbackTimestamp: {
    textAlign: 'right',
    alignSelf: 'stretch',
    paddingRight: 20,
  },
  textButton: {
    backgroundColor: Colors.backgroundColor,
    padding: 10,
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0,
  },
});

// Expo.registerRootComponent(App);
