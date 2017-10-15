import React from 'react';
import { Button, Icon } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationActions, StackNavigator } from 'react-navigation';
import _NewRecording from '../components/new-recording/_NewRecording';


export default class RecordingScreen extends React.Component {
  static navigationOptions = {
    title: 'Record',
    // headerRight: ({ goBack }) => <Icon name={"close"} onPress={goBack} />
  }

  // static navigationOptions = {
  //   title: "Record",
  //   header: ({state, setParams, goBack}, defaultHeader) => ({
  //       ...defaultHeader,
  //       left:
  //         <Button title="back" transparent onPress={e => {
  //           e.preventDefault();
  //           goBack();
  //           }
  //         }>
  //           <Ionicons name="ios-arrow-round-back" style ={{color:"#fff", marginLeft:5}} />
  //         </Button>
  //     })
  // };

  render() {
    return (
      <_NewRecording />
    );
  }
}
