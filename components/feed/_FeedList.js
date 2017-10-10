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
      isLoading: true,
      allPosts: [],
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.setState({
      allposts: this.props.allPosts
    })
  }

  render () {

    console.log("this.props.allPosts");
    console.log(this.props.allPosts);
    var allPosts = this.state.allPosts;
    return (
      <View style={styles.listContainer}>
        <FlatList
          data={this.props.allPosts}

          renderItem={
            ({item}) =>
              (
              <FeedItemContainer
                key={item.key}
                title={item.key}
                username={item.username}
                audio={item.audio}
                userPhoto={item.profile_picture}
              />
              )
            }
        />
      </View>
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
})
