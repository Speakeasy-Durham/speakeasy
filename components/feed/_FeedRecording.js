import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  Color
} from 'react-native';
    // import children

export default class feedSong extends Component {

  render () {
    return (
      <View style={styles.container}>
        <Image source={{uri: this.props.userPhoto}} style={styles.userImg}/>
        <Text style={styles.text}>{this.props.userName}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  text: {
    color: "black",
    fontSize: 10
  },
  userImg: {
    width: 80,
    height: 80,
    borderRadius: 40
  }
})
