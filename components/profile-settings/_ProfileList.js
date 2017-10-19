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

    // import children
import RecordingPlayer from './_RecordingPlayer';
import AudioFileContainer from '../audio/_AudioFileContainer';

export default class ProfileList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // userPosts: this.props.userposts,
      // state to be changed by child
      userPosts: null,
      activePost: null,
    }
    this.activePost = null;
    this.userPosts = null;
    // bind this on the function to pass down as props while making its effects scope in this scope.
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
    this.userposts = this.props.userPosts;
    // console.log("ProfileList componentWillMount this.props.userPosts");
    // console.log(this.props.userPosts);

  }

  componentDidMount() {
    this.setState({userPosts: this.props.userPosts});
  }

  render() {
    // console.log("ProfileList render this.props.userPosts");
    // console.log(this.props.userPosts);
    // console.log("ProfileList render this.state.userPosts");
    // console.log(this.state.userPosts);
    return (
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
    )

  }


}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
  }
})
