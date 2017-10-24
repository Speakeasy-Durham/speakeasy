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
    this.duration = null;
    this._expandPlayer = this._expandPlayer.bind(this);
  }

  componentWillMount() {
    this.setState({
      activePost: this.props.activePost,
      id: this.props.id,
      shouldExpand: this.props.shouldExpand,
    })
    this.duration = this._convertMStoSeconds(this.props.duration);
  }

  _convertMStoSeconds(ms) {
    let duration = "";
    let seconds = Math.floor((ms / 1000) % 60);
    if (seconds < 10) {
      duration = ":0" + seconds;
    } else {
      duration = ":" + seconds;
    }
    return duration
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
        <View style={styles.rowsContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>
              {this.props.username} </Text>
            <Text style={styles.nameText}>
              {this.props.title} </Text>


            </View>
            {/* <Text> shouldExpand? {this.props.shouldExpand ? "true" : "false"}</Text> */}
            <View style={styles.playerContainer}>
              <AudioFilePlayer
                audio={this.props.audio}
                id={this.props.id}
                duration={this.duration}
                activePost={this.props.activePost}
                shouldPlay={this.props.shouldExpand}
              />
              {this.props.shouldExpand ?
                <View>
                  {/* <Text>expanded</Text> */}
                  {/* <Text>{this.props.activePost}</Text> */}
                </View>
                : null
              }
              </View>
          </View>
        </TouchableHighlight>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    // alignItems: 'stretch',
    flex: 1,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomColor: Colors.accentOrange,
    borderBottomWidth: 1,
    marginLeft: 8,
  },
  rowsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    flex: 1,
  },
  textContainer: {
    flexDirection: 'column',
    flex: 3,

  },
  titleText: {
    fontFamily: 'space-mono-bold',
    color: Colors.fontColorDark,
    fontSize: 14,
  },
  nameText: {
    fontFamily: 'space-mono-regular',
    color: Colors.fontColorLight,
    fontSize: 16,
  },
  playerContainer: {
    // alignSelf: 'stretch',
    flex: 1,

  }
})
