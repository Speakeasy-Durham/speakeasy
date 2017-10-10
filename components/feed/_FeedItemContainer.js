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
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            source={{uri: this.props.userPhoto}}
            style={styles.image}
          />
          <Text style={styles.name}> { this.props.userName } </Text>
        </View>
        <AudioFileContainer
          key={this.props.key}
          title={this.props.key}
          username={this.props.username}
          audio={this.props.audio}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    // backgroundColor: '#D6FFDB',
  },
  imageContainer: {
    padding: 10,
    width:60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 56,
    height: 56,
    backgroundColor: '#000',
  },
  name: {
    marginTop: 4,
  },
})
