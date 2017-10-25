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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationActions} from 'react-navigation';
import _NewRecording from '../components/new-recording/_NewRecording';
import Colors from '../constants/Colors';


export default class RecordingScreen extends React.Component {
  static navigationOptions = {
    title: 'Record',
    header: null,
  };

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
            <MaterialCommunityIcons
              name={'chevron-down'}
              size={42}
              style={styles.closeButtonIcon}
            />
          </TouchableHighlight>
          <Text style={styles.headerTitle}>SPEAKEASY</Text>
          <View style={styles.rightContainer}></View>
        </View>
        <_NewRecording />
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
    color: Colors.primaryRed,
    paddingLeft: 12,
  },
  headerTitle: {
    color: Colors.fontColorDark,
    fontFamily: 'monoton-regular',
    fontSize: 30,
    textAlign: 'center',
    flex: 4,
  },
  rightContainer: {
    flex: 1,
  },
})
