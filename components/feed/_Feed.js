import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
    // import children


export default class Feed extends Component {
  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>This is the Feed page</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "pink"
  },
  text: {
    color: "white",
    fontSize: 48
  }
})
