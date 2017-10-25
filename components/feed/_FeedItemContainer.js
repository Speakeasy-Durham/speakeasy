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

import AudioFileContainer from '../audio/_AudioFileContainer';
import AudioFilePlayer from '../audio/_AudioFilePlayer';

export default class FeedItemContainer extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    key = this.props.key
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            source={{uri: this.props.userPhoto}}
            style={styles.image}
          />
          {/* <Text style={styles.name}> { this.props.userName } </Text> */}
        </View>

        <AudioFileContainer
          activePost={this.props.activePost}
          id={this.props.id}
          title={this.props.title}
          username={this.props.username}
          audio={this.props.audio}
          duration={this.props.duration}
          _setActivePost={this.props._setActivePost}
          shouldExpand={this.props.shouldExpand}
          style={styles.audioContainer}
          />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginRight: 4,
  },
  imageContainer: {
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
  },
  image: {
    width: 56,
    height: 56,
    backgroundColor: '#000',
    borderRadius: 28,
  },
  name: {
    marginTop: 4,
  },
  audioContainer: {

  }
})
