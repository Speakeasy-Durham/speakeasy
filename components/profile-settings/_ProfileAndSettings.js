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

export default class ProfileAndSettings extends Component {

  componentWillMount() {

  }

  _keyExtractor = (item, index) => item.id;

  _renderPost = 0;

  render () {

    var userPosts = this.props.userPosts;
    console.log(userPosts.length);
    return (
      <View style={styles.main}>
        <View style={styles.profileBarContainer}>
          <View style={styles.imageContainer}>
            <Image
              resizeMode="contain"
              source={{uri: this.props.userPhoto}}
              style={styles.image}
            />
            <Text style={styles.name}> { this.props.userName } </Text>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.info}>
              <Text style={styles.infoNumber}>
                {userPosts.length}
              </Text>
              <Text style={styles.infoType}>
                posts
              </Text>
            </View>
          </View>
          <View style={styles.settingsContainer}>
            <Ionicons
              name={`ios-settings`}
              size={28} />
          </View>
        </View>
        {/* Flatlist renders AudioFileContainer for each item */}
        <View style={styles.listContainer}>
          <FlatList
            data={userPosts}
            keyExtractor={this._keyExtractor}
            renderItem={
              ({item}) =>
                (
                <AudioFileContainer
                  key={item.key}
                  title={item.key}
                  username={item.username}
                  audio={item.audio}
                />
                )
              }

          />
          <RecordingPlayer />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#FCFCFC",
    justifyContent: 'flex-start'
  },
  profileBarContainer: {
    backgroundColor: '#ff634744',
    borderBottomColor: '#000',
    flexDirection: 'row'
  },
  imageContainer: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderColor: 'green',
    // borderWidth: 1,
  },
  image: {
    width: 56,
    height: 56,
    backgroundColor: '#000',
  },
  name: {
    marginTop: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    // borderColor: 'red',
    // borderWidth: 1,
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  infoNumber: {
    marginTop: 12,
    minHeight: 32,
    fontSize: 30
  },
  infoType: {
    marginTop: 8,
  },
  settingsContainer: {
    flexDirection: 'column',
    flex: 0,
    minWidth: 100,
    // minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: 'blue',
    // borderWidth: 1,
  },
  listContainer: {
    paddingTop: 8,
    paddingRight: 8,
    paddingLeft: 8,
  },
})
