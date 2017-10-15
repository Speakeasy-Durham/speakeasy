import React from 'react';
import { Button } from 'react-native';
import _NewRecording from '../components/new-recording/_NewRecording';


export default class RecordingScreen extends React.Component {
  // static navigationOptions = {
  //   title: 'Record',
  //   header: null,
  // }

  render() {
    return (
      <_NewRecording />
    );
  }
}
