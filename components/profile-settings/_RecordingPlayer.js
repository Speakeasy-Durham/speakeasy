import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
    // import children


export default class RecordingPlayer extends Component {
  render () {
    return (
      <View style={styles.main}>
        <Text>
          This will be a player for a spoke.
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#CCC",
    paddingLeft: 8,
    
  }
})
