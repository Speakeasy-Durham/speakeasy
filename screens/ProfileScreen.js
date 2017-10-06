import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import * as firebase from 'firebase';

import ProfileAndSettings from '../components/profile-settings/_ProfileAndSettings';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'User\'s name',
  };

  constructor(props) {
    super(props);
    this.state = {
      userPhoto: null,
      userEmail: null,
      userUid: null,
      userName: null,
      userPosts: [],
    };
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
    currentUserRef.once("value", (snapshot) => {
            var userPosts = snapshot.val();
            console.log(Object.keys(userPosts));
            var userPostsArray = [];
            userPostsArray = Object.keys(userPosts).map(key => {
               let array = userPosts[key]
               // Apppend key if one exists (optional)
               array.key = key
               return array
            });
            console.log(userPostsArray);
            this.setState({userPosts: userPostsArray})
          });
    }


  render() {
    // console.log("this.state.userPosts");
    // console.log(this.state.userPosts);
    return (
      <ScrollView style={styles.container}>
        <ProfileAndSettings
          userUid={this.state.userUid}
          userEmail={this.state.userEmail}
          userPhoto={this.state.userPhoto}
          userName={this.state.userName}
          userPosts={this.state.userPosts}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: 'pink',
  },
});
