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


class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

export default class AudioFileContainer extends Component {
  render () {
    return (
    <View>
      <View>
        <View>
          <Text>{this.props.title} </Text>
          <Text>{this.props.username}</Text>
        </View>
        <TouchableHighlight>
            <Ionicons
              name={`ios-heart`}
              size={28} />
        </TouchableHighlight>
      </View>
    </View>
    )
  }
}
