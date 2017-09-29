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

    // import children
import RecordingPlayer from './_RecordingPlayer';
import AudioFileContainer from '../audio/_AudioFileContainer';

export default class ProfileAndSettings extends Component {

  componentWillMount() {

  }

  _keyExtractor = (item, index) => item.id;

  _renderPost = 0;

  render () {

    // console.log(Object.keys(userPosts).forEach(function(post) {
    //   return post;
    // }
    //
    // ));
    var userPosts = this.props.userPosts;




    // console.log("userPostsArray");
    // console.log(userPostsArray);
    // console.log("userPostsArray[0]");
    // console.log(userPostsArray[0]);
    // console.log("userPostsArray[1]");
    // console.log(userPostsArray[1]);


    return (
      <View style={styles.main}>
        <View style={styles.profileBarContainer}>
          <View style={styles.imageContainer}>
            <Image
              resizeMode="contain"
              source={{uri: this.props.userPhoto}}
              style={styles.image}
            />
            <Text style={styles.name}>Profile Name</Text>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.info}>
              <Text style={styles.infoNumber}>
                ##
              </Text>
              <Text style={styles.infoType}>
                posts
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoNumber}>
                ##
              </Text>
              <Text style={styles.infoType}>
                followers
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoNumber}>
                ##
              </Text>
              <Text style={styles.infoType}>
                following
              </Text>
            </View>
          </View>
          <View style={styles.settingsContainer}>
            <Text>
              (s)
            </Text>
          </View>
        </View>
        <View>
          <Text>SHOW SOMETHING</Text>
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
                />
                )
              }

          />

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "pink"
  },
  profileBarContainer: {
    backgroundColor: '#FFF',
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 12,

  },
  infoNumber: {
    marginTop: 4,
    fontSize: 24
  },
  infoType: {
    marginTop: 8,
    fontSize: 12
  },
  settingsContainer: {
    flexDirection: 'column',
    flex: 0,
    minWidth: 48,
    // minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: 'blue',
    // borderWidth: 1,
  }
})
