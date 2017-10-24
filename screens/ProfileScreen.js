import React from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import * as firebase from 'firebase';
import {NavigationActions} from 'react-navigation';

import ProfileAndSettings from '../components/profile-settings/_ProfileAndSettings';
import AudioFileContainer from '../components/audio/_AudioFileContainer';
import ProfileList from '../components/profile-settings/_ProfileList';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userPhoto: null,
      userEmail: null,
      userUid: null,
      userName: null,
      userPosts: null,
    };
    this.activePost = null;
  }

  componentWillMount() {
  // authorize current user
    var user = firebase.auth().currentUser;
    console.log(user);
    this.setState({userPhoto: user.providerData[0].photoURL});
    this.setState({userEmail: user.providerData[0].email});
    this.setState({userUid: user.providerData[0].uid});
    this.setState({userName: user.providerData[0].displayName});

    var currentUser = user.providerData[0].uid;

    // ref for recordings
    var ref = firebase.database().ref('recordings/');

    // find only by current user
    var currentUserRef = ref
      .orderByChild("userId")
      .equalTo(currentUser);
    currentUserRef.on("value", (snapshot) => {
            var userPosts = snapshot.val();
            // console.log(Object.keys(userPosts));
            if (userPosts != null) {
              // console.log("ProfileScreen userPosts isn't null");
              console.log(userPosts);
              var userPostsArray = [];
              userPostsArray = Object.keys(userPosts).map(key => {
                 let array = userPosts[key]
                 // Apppend key if one exists (optional)
                 array.key = key
                 return array
              });
              // console.log("userPostsArray");
              // console.log(userPostsArray);
              this.setState({userPosts: userPostsArray})
            } else {
              console.log("ProfileScreen userposts == null");
              console.log(userPosts);
              var userPostsArray = null;
          }
          });
    }

  componentDidMount() {
    // console.log("this.activePost");
    // console.log(this.activePost);
    // console.log("second this.state.activePost");
    // console.log(this.state.activePost);
    // console.log("ProfileScreen rendered");
  }

  // shouldComponentUpdate() {
  //
  // }

  _keyExtractor = (item, index) => item.id;

  _handleLogOut = () => {
       firebase.auth().signOut().then(user => {
         this._navigateTo('Signup');
         // Alert.alert(
         //   "You're logged out."
         // );
       }, function(error) {
         console.log(error);
     });
   }

   _navigateTo(routeName: string) {
     const actionToDispatch = NavigationActions.reset({
       index: 0,
       actions: [NavigationActions.navigate({ routeName })],
       key: null
     });

     this.props.navigation.dispatch(actionToDispatch);
   }

  render() {
    return (
      <View style={styles.container}>
        <ProfileAndSettings
          userUid={this.state.userUid}
          userEmail={this.state.userEmail}
          userPhoto={this.state.userPhoto}
          userName={this.state.userName}
          userPosts={this.state.userPosts}
        />
        <View>
          <Button
            onPress={this._handleLogOut}
            title="Logout of App"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
});
