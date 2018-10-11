import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, ListView, TouchableHighlight, TouchableOpacity, Dimensions, Animated, Platform, Linking} from "react-native";
import { Actions } from 'react-native-router-flux'

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Images } from '../../themes'

import MapView from 'react-native-maps';

import Styles from '../../styles/NavigationContainerStyle'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class Accomodation extends React.Component {
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
                <Text style={Styles.back_text}>Welcome</Text>
              </TouchableOpacity>
              <Text style={{fontSize: 17, color: '#ffffff', textAlign: 'center', letterSpacing: -0.4, fontWeight: '600', position: 'absolute', top: Platform.OS === 'ios' ? 31 : 10, left: width/2-54}}>Accommodation</Text>
            </View>
            <ScrollView style={{marginBottom: 49}}>
              <Image source={Images.Accomadation}  style={{width: width, height: 213}}/>
              <Text style={{fontSize: 18, color: '#000000', textAlign: 'left', letterSpacing: -0.4, fontWeight: '900', marginTop: 20, marginLeft: 8}}>Summit Headquarters</Text>
              <Text style={{fontSize: 13, color: '#000000', textAlign: 'left', letterSpacing: -0.3, marginTop: 3, marginLeft: 10, marginRight: 17}}>A great location overlooking Bangkok’s bustling Chao Phraya River, the AVANI Riverside Bangkok Hotel opened only in Spring, 2016. It has a contemporary style in its conference facilities and bedrooms. AMEC has negotiated a very low rate for hotel rooms and every hotel room has a river view. A river bus leaves from the nearby river pier every 20 minutes.</Text>
              <MapView
                style={{width: width-20, height: 165, alignSelf: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', marginTop: 20}}
                initialRegion={{
                  latitude: 13.7048581,
                  longitude: 100.4913573,
                  latitudeDelta: 0.0042,
                  longitudeDelta: 0.0021,
                }}>
                <MapView.Marker
                  coordinate={{latitude: 13.7048581, longitude: 100.4913573}}
                />
              </MapView>
              <TouchableOpacity style={styles.details_view} onPress={() => Linking.openURL('http://maps.google.com/maps?q=13.7048581,100.4913573')}>
                <Text style={styles.text}>Get Directions</Text>
              </TouchableOpacity>
              <Text style={{fontSize: 13, color: '#000000', textAlign: 'left', letterSpacing: -0.3, marginTop: 20, marginLeft: 10, marginBottom: 22}}>257 Charoennakorn Road,{'\n'}Thonburi,{'\n'}Bangkok 10600,{'\n'}Thailand</Text>
            </ScrollView>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  details_view: {
    width: width-20,
    height: 50,
    marginTop: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#e10333'
  },
  text: {
    fontSize: 15,
    color: '#ffffff',
    letterSpacing: -0.4,
    fontWeight: 'bold',
    textAlign: 'center'
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

export default connect(mapStateToProps, mapDispatchToProps)(Accomodation)
