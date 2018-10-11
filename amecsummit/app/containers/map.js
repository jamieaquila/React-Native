import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, ListView, TouchableHighlight, TouchableOpacity, Dimensions, Animated, Platform} from "react-native";
import { Actions } from 'react-native-router-flux'

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';

import PhotoView from 'react-native-photo-view';

import { Images } from '../themes'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class Map extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        return (
          <View style={styles.container}>
            <PhotoView              source={Images.maps}              minimumZoomScale={0.5}              maximumZoomScale={3}              style={{width: width, height: Platform.OS === 'ios' ? height - 49 : height - 69}}
              resizeMode={'contain'}/>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e10333"
  }
});

const mapStateToProps = (state) => {
    const props = {

    };
    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)
