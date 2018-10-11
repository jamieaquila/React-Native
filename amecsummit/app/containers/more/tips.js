import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, ListView, TouchableHighlight, TouchableOpacity, Dimensions, Animated, Platform} from "react-native";
import { Actions } from 'react-native-router-flux'

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Images } from '../../themes'
import { Tip } from '../../config';

import Styles from '../../styles/NavigationContainerStyle'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class Tips extends React.Component {
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

              <Text style={{fontSize: 17, color: '#ffffff', textAlign: 'center', letterSpacing: -0.4, fontWeight: '600', position: 'absolute', top: Platform.OS === 'ios' ? 31 : 10, left: width/2-15}}>Tips</Text>
            </View>
            <ScrollView style={{marginBottom: 48, alignSelf: 'center'}}>
              <View style={{width: width, alignSelf: 'center', marginTop: 17, marginBottom: 46}}>
                {
                  Tip.map((tip, i) =>
                    <View key={i} style={i != 0 ? {marginTop: 40} : null}>
                      <Text style={{fontSize: 18, color: '#000000', letterSpacing: -0.4, fontWeight: '900', textAlign: 'left', marginLeft: 8}}>{tip.title}</Text>
                      <Text style={{fontSize: 13, color: '#000000', letterSpacing: -0.3, textAlign: 'left', marginTop: 5, marginLeft: 8, marginRight: 19}}>{tip.details}</Text>
                    </View>
                  )
                }
              </View>
            </ScrollView>
          </View>
        );
    }
}

const styles = StyleSheet.create({

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

export default connect(mapStateToProps, mapDispatchToProps)(Tips)
