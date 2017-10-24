import React from 'react';
import {
  Button,
  Icon,
  TouchableHighlight,
  Text,
  View,
  StyleSheet
} from 'react-native';
import { Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { NavigationActions} from 'react-navigation';
import _NewRecording from '../components/new-recording/_NewRecording';
import Colors from '../constants/Colors';


export default class RecordingScreen extends React.Component {
  static navigationOptions = {
    title: 'Record',
    header: null,
  };

  componentDidMount() {
    Font.loadAsync({
      'monoton-regular': require('../assets/fonts/Monoton-Regular.ttf'),
      'space-mono-regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
  }

  _goBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View>
        <View style={styles.headerWrapper}>
          <TouchableHighlight
            style={styles.closeButton}
            onPress={this._goBack}>
            <Ionicons
              name={'ios-arrow-down'}
              size={38}
              style={styles.closeButtonIcon}
            />
          </TouchableHighlight>
          <Text style={styles.headerTitle}>SPEAKEASY</Text>
          <View style={styles.rightContainer}></View>
        </View>
        <_NewRecording
          style={styles._NewRecording}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: Colors.backgroundColor,
    height: 70,
  },
  closeButton: {
    flex: 1,
  },
  closeButtonIcon: {
    color: Colors.iconSelectColor,
    paddingLeft: 15,
  },
  headerTitle: {
    color: Colors.primaryRed,
    fontFamily: 'monoton-regular',
    fontSize: 28,
    textAlign: 'center',
    flex: 4,
  },
  rightContainer: {
    flex: 1,
  },
  _NewRecording: {

  }
})
