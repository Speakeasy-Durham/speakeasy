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

import AudioFilePlayer from './_AudioFilePlayer'

class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

export default class AudioFileContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    }

    this._toggleExpandPlayer = this._toggleExpandPlayer.bind(this);

    this._expandPlayer = this._expandPlayer.bind(this);
  }

  _toggleExpandPlayer() {

    this.setState({
      expanded: !this.state.expanded,
    });
  }

  _expandPlayer() {
    if (!this.state.expanded) {
      return null;
    }
    return (
      <View style={styles.playerContainer}>
        <AudioFilePlayer
          audio={this.props.audio}
        />
      </View>
    );
  }

  render () {

    return (
      <View>
        {/* TouchableHighlight triggers AudioFilePlayer  */}
        <TouchableHighlight
          onPress={ this._toggleExpandPlayer }>
          <View style={styles.container}>
            <Text>{this.props.title} </Text>
            <Text>by: {this.props.username}</Text>
            { this._expandPlayer() }
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingLeft: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ff634766',

  },

  playerContainer: {
    flex: 1,


  }
})
