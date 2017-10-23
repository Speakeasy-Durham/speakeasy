import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Alert,
  FlatList,
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';
import FeedList from '../components/feed/_FeedList.js';
import { AsyncStorage } from 'react-native';
// import Cognito from '../cognito-helper';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import  {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  } from 'amazon-cognito-identity-js';


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.allPosts = {};
    this.allPostsArray = [0,0,0];
    this.state = {
      userPhoto: null,
      userEmail: null,
      userUid: null,
      userName: null,
      allPosts: [],

    };
  }

  // static navigationOptions = {
  //   title: 'SPEAKEASY',
  //     headerTintColor: 'red',
  //     titleStyle: {
  //       backgroundColor: 'white',
  //     }
  // };

  componentWillMount() {
    let user = firebase.auth().currentUser;
    let userId = user.providerData[0].uid;
    var ref = firebase.database().ref('users/' + userId);
    initializeCognito();
    listStorageBuckets();
    ref.once('value')
      .then(function(dataSnapshot) {
        if(!dataSnapshot.exists()) {
            console.log("Adding a user to the firebase database");
            let user = firebase.auth().currentUser;
            let userId = user.providerData[0].uid;
            let email = user.providerData[0].email;
            let name = user.providerData[0].displayName;
            let imageUrl = user.providerData[0].photoURL;
            firebase.database().ref('users/' + userId).set({
              username: name,
              email: email,
              profile_picture: imageUrl
            })
        } else {
          console.log("User already added");
        }
    })
  }

  componentDidMount() {
    var ref = firebase.database().ref('recordings/');
    var allRecordingsRef = ref.orderByKey();
    allRecordingsRef.on("value", (snapshot) => {
      this.allPosts = snapshot.val();
      // console.log("this.allPosts");
      // console.log(this.allPosts);

      // turn firebase results into an array so that react native Flatlist can render each item
      this.allPostsArray = Object.keys(this.allPosts).map(key => {
        let array = this.allPosts[key]
        // Append key if one exists (optional)
        array.key = key
        return array
      })
      // console.log("this.allPostsArray");
      // console.log(this.allPostsArray);
      this.setState({
        allPosts: this.allPostsArray
      });
    })


  }

    render() {
      return (
      <ScrollView style={styles.container}>
        <View>
          <Button
            onPress={this._handleLogOut}
            title="Logout of App"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        <View>
          <FeedList
            allPosts={this.state.allPosts}/>
        </View>
      </ScrollView>
    );
  }

  _handleLogOut = () => {
      this._navigateTo('Signup');
      firebase.auth().signOut().then(user => {
        Alert.alert(
          "You're logged out."
        );
      }, function(error) {
        console.log(error);
    });
  }

  _navigateTo(routeName: string){
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })]
    })
      this.props.navigation.dispatch(actionToDispatch)
  }
}

initializeCognito = () => {
  AWS.config.region = 'us-east-1'; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:46e64e62-71d0-44c8-bed9-a0a0c7e31abd',
  });
}

listStorageBuckets = () => {
  var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: "tin-can"}
  });
  s3.listObjects({Delimiter: '/'}, function(err, data) {
    if (err) {
      return alert('There was an error listing your albums: ' + err.message);
    } else {
      // console.log("This is the data from the storage buckets function ", data);
    }
  })
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feedRecordingContainer: {
    borderRadius: 2,
  },
})
