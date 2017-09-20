import React from 'react';
import _NewRecording from '../components/new-recording/_NewRecording';
// import { ExpoConfigView } from '@expo/samples';

export default class RecordingScreen extends React.Component {
  static navigationOptions = {
    title: 'Record',
  };
  render() {
    return (
      <_NewRecording />
    );
  }
}
