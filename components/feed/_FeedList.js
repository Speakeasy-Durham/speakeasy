import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  Color,
  FlatList,
} from 'react-native';

import AudioFileContainer from '../audio/_AudioFileContainer';
import FeedItemContainer from './_FeedItemContainer';

import * as firebase from 'firebase';

export default class FeedList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allPosts: [],
      activePost: null,
    }

    this.activePost = null;
    this._setActivePost = this._setActivePost.bind(this);
  }

  _keyExtractor = (item, index) => item.id;

  _setActivePost(id) {
    // console.log("first this.state.activePost");
    // console.log(this.state.activePost);
    // console.log("_setActivePost(id)");
    // console.log(id);
    let expandedId = id;
    // this.setState({ activePost: 0 });
    this.setState({activePost: expandedId});
    this.activePost = expandedId;
    // console.log("this.state.activePost = id");
    // console.log(this.state.activePost);
  }


  componentWillMount() {

  }

  componentDidMount() {
    this.setState({userPosts: this.props.userPosts});
  }

  render () {
    return (

        <FlatList
          inverted
          style={styles.listContainer}
          data={this.props.allPosts}
          extraData={this.state.activePost}
          keyExtractor={item => item.key}
          renderItem={
            ({item}) =>
              (
              <FeedItemContainer
                activePost={this.state.activePost}
                id={item.key}
                title={item.text}
                username={item.username}
                audio={item.audio}
                duration={item.sound_duration}
                userPhoto={item.profile_picture}
                _setActivePost={this._setActivePost}
                style={styles.feedItemContainer}
                shouldExpand={
                  this.state.activePost === item.key
                  ? true : false
                }
              />
              )
            }
          />

      )
    }
  }

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 8,
    paddingRight: 8,
    paddingLeft: 8,

    // backgroundColor: '#D0C0E5',
  },
  feedItemContainer: {

  }
})
