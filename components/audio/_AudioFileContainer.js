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
      activePost: this.props.activePost,
      id: this.props.id,
    }
    this.id = null;
    this._expandPlayer = this._expandPlayer.bind(this);
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.setState({

    })
  }

  _expandPlayer() {
    this.props._setActivePost(this.id);
    this.setState({
      activePost: this.state.id,
    })
  }

  render () {

    this.id = this.props.id;

    return (
      <View>
      <TouchableHighlight
        onPress={ this._expandPlayer }>
        <View>
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
        </View>
      </TouchableHighlight>
      <Text>------------------------------</Text>
      </View>
      // <View>
      //   {/* TouchableHighlight triggers AudioFilePlayer  */}
      //   <TouchableHighlight
      //     onPress={ this._toggleExpandPlayer }>
      //     <View style={styles.container}>
      //       <Text>{this.props.title} </Text>
      //       <Text>by: {this.props.username}</Text>
      //       { this._expandPlayer() }
      //     </View>
      //   </TouchableHighlight>
      // </View>
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
    minHeight: 100,
  },

  playerContainer: {
    flex: 1,


  }
})
