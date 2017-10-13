import React from 'react';
import {
  Dimensions,
  Image,
  Slider,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Button
} from 'react-native';
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from 'expo';
import { RNS3 } from 'react-native-aws3';
import * as firebase from 'firebase';
import { Entypo } from '@expo/vector-icons';


export default class PostRecordingScreen extends React.Component {

  render() {
    return (
      <View>
        <Text>Post your recording!</Text>
      </View>
    );
  }
}
