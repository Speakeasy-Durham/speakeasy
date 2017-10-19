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
      activePost: null,
      id: null,
      shouldExpand: false,
    }
    this.id = null;
    this._expandPlayer = this._expandPlayer.bind(this);
  }

  componentWillMount() {
    this.setState({
      activePost: this.props.activePost,
      id: this.props.id,
      shouldExpand: this.props.shouldExpand,
    })
  }


  _expandPlayer() {
    // console.log("expandPlayer this.state.id from AudioFileContainer");
    // console.log(this.state.id);
    let expandedId = this.state.id;
    this.props._setActivePost(expandedId);
    this.setState({
      activePost: this.state.id,
    })

  }

  render () {

    return (
      <TouchableHighlight
        onPress={ this._expandPlayer }
        underlaycolor={'#ffffff'}
        style={styles.container}
        >
        <View
          >
          <Text>{this.props.title} </Text>
          <Text>by: {this.props.username}</Text>
          {/* <View>
            <Text>
              this.props.activePost
            </Text>
            <Text>
              {this.props.activePost}
            </Text>
            <Text>
                this.state.activePost
              </Text>
              <Text>
                {this.state.activePost}
              </Text>
            <Text>
              this.state.id
            </Text>
            <Text>
              {this.state.id}
            </Text>
            <Text>
              {this.props.isExpanded}
            </Text>
          </View> */}
          {/* expanded for player */}
          {this.props.shouldExpand ?
            <View style={styles.playerContainer}>
              <AudioFilePlayer
                audio={this.props.audio}
              />
            </View>
            : null
          }
        </View>
      </TouchableHighlight>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: 1,
  },

  playerContainer: {


  }
})
