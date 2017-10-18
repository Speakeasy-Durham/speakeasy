import React from 'react';
import { FlatList,
         ScrollView,
         StyleSheet,
         Text,
         View,
       } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import * as firebase from 'firebase';

import ProfileAndSettings from '../components/profile-settings/_ProfileAndSettings';
import AudioFileContainer from '../components/audio/_AudioFileContainer';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userPhoto: null,
      userEmail: null,
      userUid: null,
      userName: null,
      userPosts: [],
      // state to be changed by child
      activePost: null,
    };
    this.activePost = null;
    // bind this on the function to pass down as props while making its effects scope in this scope.
    this._setActivePost = this._setActivePost.bind(this);
  }

  _setActivePost(id) {
    console.log("first this.state.activePost");
    console.log(this.state.activePost);
    console.log("_setActivePost(id)");
    console.log(id);
    this.setState({ activePost: 0 });
    this.setState({activePost: id});
    this.activePost = this.state.activePost;
    console.log("this.state.activePost = id");
    console.log(this.state.activePost);
  }

  componentWillMount() {
    var user = firebase.auth().currentUser;
    // console.log(user);

    this.setState({userPhoto: user.providerData[0].photoURL});
    this.setState({userEmail: user.providerData[0].email});
    this.setState({userUid: user.providerData[0].uid});
    this.setState({userName: user.providerData[0].displayName});

    var currentUser = user.providerData[0].uid;
    // console.log(currentUser);

    // ref for recordings
    var ref = firebase.database().ref('recordings/');

    // find only by current user
    var currentUserRef = ref
      .orderByChild("userId")
      .equalTo(currentUser);
    currentUserRef.on("value", (snapshot) => {
            var userPosts = snapshot.val();
            // console.log(Object.keys(userPosts));
            var userPostsArray = [];
            userPostsArray = Object.keys(userPosts).map(key => {
               let array = userPosts[key]
               // Apppend key if one exists (optional)
               array.key = key
               return array
            });
            // console.log("userPostsArray");
            console.log(userPostsArray);
            this.setState({userPosts: userPostsArray})
          });
    }

  componentDidMount() {
    console.log("this.activePost");
    console.log(this.activePost);
    console.log("second this.state.activePost");
    console.log(this.state.activePost);
    console.log("ProfileScreen rendered");
  }

  _keyExtractor = (item, index) => item.id;

  render() {
    return (
      <ScrollView style={styles.container}>
        <ProfileAndSettings
          userUid={this.state.userUid}
          userEmail={this.state.userEmail}
          userPhoto={this.state.userPhoto}
          userName={this.state.userName}
          userPosts={this.state.userPosts}
        >
          <FlatList
            inverted
            activePost={this.state.activePost}
            keyExtractor={item => item.key}
            data={this.state.userPosts}
            extraData={this.state}
            renderItem={
              ({item}) =>
                (
                <AudioFileContainer
                  activePost={this.state.activePost}
                  id={item.key}
                  title={item.text}
                  username={item.username}
                  audio={item.audio}
                  _setActivePost={this._setActivePost}
                />


                )
              }

          />
        </ProfileAndSettings>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
});
