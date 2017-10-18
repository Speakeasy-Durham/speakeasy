import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Slider,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from 'expo';

import AudioFilePlayer from './_AudioFilePlayer'

class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

export default class AudioFileContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePost: null,
      id: null,
      shouldExpand: false,
    }
    this.id = null;
    this._expandPlayer = this._expandPlayer.bind(this);
  }

  componentWillMount() {

    this.setState({
      activePost: this.props.activePost,
      id: this.props.id,
      shouldExpand: this.props.shouldExpand,
    })




  }

  componentDidMount() {
    // this.setState({
    //
    // })
  }

  // shouldComponentUpdate() {
  //   if (this.props.activePost === this.state.)
  // }

  _expandPlayer() {
    console.log("expandPlayer this.state.id from AudioFileContainer");
    console.log(this.state.id);
    let expandedId = this.state.id;
    this.props._setActivePost(expandedId);
    this.setState({
      activePost: this.state.id,
    })

  }

  _renderIf() {


  }

  render () {



    return (
    <View>
      {/* if this.state.isExpanded === true, show expanded */}
          {/* {this.props.shouldExpand ?
            <Text>True</Text>
          :
            <Text>False</Text>
          } */}
          <TouchableHighlight
            onPress={ this._expandPlayer }>
            <View style={styles.container}>
              {/* <Text>collapsed</Text> */}
              <Text>{this.props.title} </Text>
              <Text>by: {this.props.username}</Text>
              {/* <View>
                <Text>
                  this.props.activePost
                </Text>
                <Text>
                  {this.props.activePost}
                </Text>
                <Text>
                    this.state.activePost
                  </Text>
                  <Text>
                    {this.state.activePost}
                  </Text>
                <Text>
                  this.state.id
                </Text>
                <Text>
                  {this.state.id}
                </Text>
                <Text>
                  {this.props.isExpanded}
                </Text>
              </View> */}
              {/* expanded for player */}
              {this.props.shouldExpand ?
                <View style={styles.playerContainer}>
                  <Text>expanded</Text>
                  <AudioFilePlayer
                    audio={this.props.audio}
                  />
                </View>
                : null
              }
            </View>
          </TouchableHighlight>



      {/* if this.state.isExpanded === false, show collapsed   */}
      {this._renderIf(this.state.shouldExpand !== true,
        (
          <TouchableHighlight
            onPress={ this._expandPlayer }>
            <View style={styles.container}>
              <Text>collapsed</Text>
              <Text>{this.props.title} </Text>
              <Text>by: {this.props.username}</Text>
              <View>
                <Text>
                  this.props.activePost
                </Text>
                <Text>
                  {this.props.activePost}
                </Text>
                <Text>
                    this.state.activePost
                  </Text>
                  <Text>
                    {this.state.activePost}
                  </Text>
                <Text>
                  this.state.id
                </Text>
                <Text>
                  {this.state.id}
                </Text>
                <Text>
                  {this.props.isExpanded}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        )
      )}
    </View>

      // <View>
      // <TouchableHighlight
      //   onPress={ this._expandPlayer }>
        // <View>
        //   <Text>
        //     this.props.activePost
        //   </Text>
        //   <Text>
        //     {this.props.activePost}
        //   </Text>
        //   <Text>
        //       this.state.activePost
        //     </Text>
        //     <Text>
        //       {this.state.activePost}
        //     </Text>
        //   <Text>
        //     this.state.id
        //   </Text>
        //   <Text>
        //     {this.state.id}
        //   </Text>
        //   <Text>
        //     {this.props.isExpanded}
        //   </Text>
        // </View>
      // </TouchableHighlight>
      // <Text>------------------------------</Text>
      // </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingLeft: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ff634766',
    minHeight: 100,
  },

  playerContainer: {
    flex: 1,


  }
})
