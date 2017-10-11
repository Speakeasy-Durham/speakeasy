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
    }
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  render () {
    return (
      <View style={styles.listContainer}>
        <FlatList
          data={this.props.allPosts}
          keyExtractor={item => item.key}
          renderItem={
            ({item}) =>
              (
              <FeedItemContainer
                keyProp={item.key}
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
