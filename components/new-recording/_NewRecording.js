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
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from 'expo';
import { MaterialCommunityIcons } from '@expo/vector-icons/';
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



const TAPE = new Icon(require('../../assets/images/tape-1.png'), 300, 200);
const SPEAKER = new Icon(require('../../assets/images/speaker4.png'), 100, 100);

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
      text: '',
    };
    this.recordingSettings = JSON.parse(
      JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY)
    );
  };

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
      this._stopRecordingAndEnablePlayback()
    }, 30000);
    this.setState({
      isLoading: false,
    });
  };

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
  };

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
  };

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
  };

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
  };

  async _deleteRecording() {
    this.setState({
      soundDuration: null,
      soundPosition: null,
      isPlaybackAllowed: false,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      text: ''
    })
  };

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

  _onPostPressed = () => {
    if (this.state.isPlaybackAllowed) {
      if (this.state.text == '') {
        Alert.alert(
          'Hang on a sec',
          'Give this recording a proper name!',
        );
      } else if (this.sound != null) {
        this.sound.stopAsync();
        Alert.alert(
          'New Recording',
          'Share it with the community?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'POST', onPress: () => {
              this._saveRecordingAndPost();
              // this._returnHome('Main');
              }
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          'New Recording',
          'Share it with the community?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'POST', onPress: () => {
              this._saveRecordingAndPost();
              // this._returnHome('Main');
              }
            },
          ],
          { cancelable: false }
        );
      }
    }
  };

  _onDeletePressed = () => {
    if (this.state.isPlaybackAllowed) {
      this._deleteRecording();
    }
  };

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(seconds);
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
  };

  _getRecordingTimestamp() {
    if (this.state.recordingDuration != null) {
      return `${this._getMMSSFromMillis(this.state.recordingDuration)} / 30`;
    }
    return `${this._getMMSSFromMillis(0)} / 30`;
  };


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
        : <KeyboardAvoidingView
           behavior='position'
          //  keyboardVerticalOffset={10}
           style={styles.container}>


            <View style={styles.topScreenContainer}>
              <View style={styles.speakerContainer}>
                <Image
                  source={SPEAKER.module}
                  style={styles.speaker} />
              </View>
            </View>


            <View style={styles.middleScreenContainer}>
              <Image
                source={require('../../assets/images/lines.png')}
                style={styles.lines}
              />
              <View
                style={styles.tapeContainer}>
                <Image
                  source={TAPE.module}
                  style={styles.tape}>
                  <TextInput
                    style={[
                       styles.tapeTitle,
                       { ...Font.style('space-mono-regular') },
                    ]}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                    placeholder='Enter a title...'
                    placeholderTextColor={Colors.fontColorLight}
                    returnKeyType='done'
                    maxLength={60}
                    />
                </Image>
              </View>
              <Image
                source={require('../../assets/images/lines.png')}
                style={styles.lines}
              />
            </View>


            <View style={styles.bottomScreenContainer}>
              <View style={styles.recordingDataRowContainer}>
                <View style={styles.recordingTimeContainer}>
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
                </View>

                <View style={styles.playbackTimeContainer}>
                  <Text
                    style={[
                      styles.playbackTimestamp,
                      { ...Font.style('space-mono-regular') },
                    ]}>
                    {this._getPlaybackTimestamp()}
                  </Text>
                </View>
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableHighlight
                  underlayColor={Colors.liveColor}
                  style={styles.recButtonWrapper}
                  onPress={this._onRecordPressed}
                  disabled={this.state.isLoading}>
                  <View>
                    <MaterialCommunityIcons
                      name={'record'}
                      size={50}
                      color={'rgb(50, 50, 50)'}
                    />
                    <Text style={styles.buttonText}>REC</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={Colors.iconDefaultColor}
                  style={styles.buttonWrapper}
                  onPress={this._onPlayPausePressed}
                  disabled={
                    !this.state.isPlaybackAllowed || this.state.isLoading
                  }>
                  <View>
                    <MaterialCommunityIcons
                      name={this.state.isPlaying ? 'pause' : 'play'}
                      size={50}
                      color={'rgb(50, 50, 50)'}
                    />
                    <Text style={styles.buttonText}>
                      {this.state.isPlaying ? 'PAUSE' : 'PLAY'}
                    </Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={Colors.iconDefaultColor}
                  style={styles.buttonWrapper}
                  onPress={this._onPostPressed}
                  disabled={
                    !this.state.isPlaybackAllowed || this.state.isLoading
                  }>
                  <View>
                    <MaterialCommunityIcons
                      name={'eject'}
                      size={50}
                      color={'rgb(50, 50, 50)'}
                    />
                    <Text style={styles.buttonText}>POST</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={Colors.iconDefaultColor}
                  style={styles.buttonWrapper}
                  onPress={this._onDeletePressed}
                  disabled={
                    !this.state.isPlaybackAllowed || this.state.isLoading
                  }>
                  <View>
                    <MaterialCommunityIcons
                      name={'close'}
                      size={50}
                      color={'rgb(50, 50, 50)'}
                    />
                    <Text style={styles.buttonText}>DELETE</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>


          </KeyboardAvoidingView>
  }
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: 'stretch',
    backgroundColor: Colors.backgroundColor,
  },
  noPermissionsText: {
    textAlign: 'center',
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
  },
  topScreenContainer: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: DEVICE_HEIGHT / 3.5,
    paddingBottom: 10,
  },
  middleScreenContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // alignSelf: 'stretch',
    height: DEVICE_HEIGHT / 3.5,
    paddingBottom: 10,
  },
  bottomScreenContainer: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: DEVICE_HEIGHT / 4.2,
    // borderWidth: 2,
    // borderColor: 'green',
  },
  speakerContainer: {
    height: DEVICE_WIDTH / 1.8,
    width: DEVICE_WIDTH / 1.15,
    borderRadius: 10,
    marginBottom: DEVICE_HEIGHT / 40,
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
    borderWidth: DEVICE_WIDTH / 23,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'repeat',
    borderColor: 'rgb(247, 239, 224)',
    // backgroundColor: Colors.backgroundColor2,
    backgroundColor: 'rgb(247, 239, 224)',
  },
  tapeContainer: {
    height: DEVICE_WIDTH / 1.95,
    width: DEVICE_WIDTH / 1.3,
    borderRadius: 10,
    marginBottom: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 1,
    // backgroundColor: Colors.backgroundColor2,
    backgroundColor: 'rgb(50, 50, 50)',
  },
  tape: {
    height: DEVICE_WIDTH / 1.95,
    width: DEVICE_WIDTH / 1.3,
    // height: 200,
    // width: 300,
    borderRadius: 10,
    borderWidth: 16,
    // marginBottom: 4,
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: Colors.accentGreen,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
  },
  tapeTitle: {
    height: DEVICE_WIDTH / 14.5,
    width: DEVICE_WIDTH / 1.7,
    marginTop: 10,
    paddingLeft: 6,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: Colors.primaryRed,
    textAlign: 'left',
    color: Colors.fontColorDark,
    backgroundColor: Colors.buttonColor,
  },
  lines: {
    height: DEVICE_HEIGHT / 10,
    width: DEVICE_WIDTH / 10
  },
  recordingDataRowContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: DEVICE_HEIGHT / 20,
    width: DEVICE_WIDTH / 1.5,
    backgroundColor: Colors.backgroundColor,
    // borderWidth: 2,
    // borderColor: 'blue',
  },
  recordingTimeContainer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: 'green',
  },
  playbackTimeContainer: {
    // flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // borderWidth: 2,
    // borderColor: 'red',
  },
  recordingTimestamp: {
    color: 'rgb(50, 50, 50)',
  },
  liveText: {
    color: Colors.liveColor,
  },
  playbackTimestamp: {
    color: 'rgb(50, 50, 50)',
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    // height: DEVICE_HEIGHT / 6,
    width: DEVICE_WIDTH,
    backgroundColor: Colors.backgroundColor2,
    // borderWidth: 2,
    // borderColor: 'red',
  },
  recButtonWrapper: {
    borderRadius: 4,
    margin: 2,
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 7,
    paddingRight: 7,
    backgroundColor: Colors.RECbuttonColor,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonWrapper: {
    borderRadius: 4,
    margin: 2,
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 7,
    paddingRight: 7,
    backgroundColor: Colors.buttonColor,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonText: {
    color: 'rgb(50, 50, 50)',
    fontFamily: 'space-mono-regular',
    textAlign: 'center',
    paddingTop: 5,
  },
});

// Expo.registerRootComponent(App);
