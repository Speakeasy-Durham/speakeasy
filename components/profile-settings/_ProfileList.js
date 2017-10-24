import React, { Component } from 'react';
import {
  FlatList,
  Image,
  List,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import RecordingPlayer from './_RecordingPlayer';
import AudioFileContainer from '../audio/_AudioFileContainer';

export default class ProfileList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // state to be changed by child
      userPosts: null,
      activePost: null,
    }
    this.activePost = null;
    this.userPosts = null;
    this._setActivePost = this._setActivePost.bind(this);
  }

  _keyExtractor = (item, index) => item.id;

  _setActivePost(id) {
    let expandedId = id;
    this.setState({activePost: expandedId});
    this.activePost = expandedId;
  }

  _isPlaying(id) {

  }

  componentWillMount() {
    this.userposts = this.props.userPosts;
  }

  componentDidMount() {
    this.setState({userPosts: this.props.userPosts});
    // console.log("ProfileList this.state.activePost");
    // console.log(this.state.activePost);
  }

  render() {
    // console.log("ProfileList this.state.activePost");
    // console.log(this.state.activePost);
    return (
      <View>
      <Text>this.state.activePost</Text>
      <Text>{this.state.activePost}</Text>

      <FlatList
        inverted
        activePost={this.state.activePost}
        keyExtractor={item => item.key}
        data={this.props.userPosts}
        extraData={this.state.activePost}
        contentContainerStyle={styles.contentContainer}
        renderItem={
          ({item}) =>
            (
            <AudioFileContainer
              activePost={this.state.activePost}
              id={item.key}
              title={item.text}
              username={item.username}
              audio={item.audio}
              duration={item.sound_duration}
              _setActivePost={this._setActivePost}
              shouldExpand={
                this.state.activePost === item.key
                ? true : false
              }
              style={styles.contentContainer}
            />
          )}
        />
        </View>
    )

  }


}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
  }
})
