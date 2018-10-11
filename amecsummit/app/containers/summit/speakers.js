import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, ListView, TouchableHighlight, TouchableOpacity, Dimensions, Animated, Platform} from "react-native";
import { Actions } from 'react-native-router-flux'

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';

import { FIREBASE_CONFIG } from '../../config';

import Styles from '../../styles/NavigationContainerStyle'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class Speakers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        return (
          <View style={Styles.container}>
            <View style={Styles.navBar}>
              <TouchableOpacity  style={Styles.back_view} onPress={Actions.pop}>
                <Icon name="angle-left" size={35} color={'#ffffff'} />
                <Text style={Styles.back_text}>Speakers</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{marginBottom: 49, alignSelf: 'center'}}>
              <View style={{flexDirection: 'column', width: width, height: 210, backgroundColor: '#f1f1f1', alignSelf: 'center', alignItems: 'center'}}>
                <Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${this.props.image}`}}  style={styles.image_view}/>
                <Text style={{width: width-20, fontSize: 24, color: '#e10333', fontWeight: '900', textAlign: 'center', marginTop: 10}} numberOfLines={1}>{this.props.name}</Text>
                <Text style={{width: width-20, fontSize: 12, color: '#000000', fontWeight: '900', textAlign: 'center'}}>{this.props.title}</Text>
              </View>
              <Text style={{fontSize: 13, padding: 10}}>{this.props.profile}</Text>
            </ScrollView>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  image_view: {
    marginTop: 20,
    width: 93,
    height: 93,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)'
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

export default connect(mapStateToProps, mapDispatchToProps)(Speakers)
