import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, ListView, TouchableHighlight, TouchableOpacity, Dimensions, Animated, Platform, Linking} from "react-native";
import { Actions } from 'react-native-router-flux'

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';

import Styles from '../../styles/NavigationContainerStyle'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class Sponsors extends React.Component {
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
                <Text style={Styles.back_text}>Sponsors</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{marginBottom: 49, alignSelf: 'center'}}>
              <View style={{flexDirection: 'column', width: width, height: 193, backgroundColor: '#f1f1f1', alignSelf: 'center', alignItems: 'center'}}>
                <View style={styles.image_view}>
                  <Image source={this.props.icon} style={{width: 120, height: 70}} resizeMode={'contain'}/>
                </View>
                <Text style={{width: width-20, fontSize: 13, color: '#000000', fontWeight: '900', letterSpacing: -0.3, textAlign: 'center', marginTop: 10}} numberOfLines={2}>{this.props.name}</Text>
              </View>
              <Text style={{fontSize: 13, padding: 10}}>{this.props.text}</Text>
              <Text style={{fontSize: 12, fontWeight: 'bold', height: 14, color: '#e10333', marginTop: 34, marginLeft: 10}}>CONTACT</Text>
              <Text style={{width: 282, fontSize: 18, color: '#000000', letterSpacing: -0.4, fontWeight: '900', textAlign: 'left', marginTop: 10, marginLeft: 8, marginBottom: 9}}>{this.props.contact_title}</Text>
              {
                this.props.telephone != '' ? (
                  <Text style={styles.text}>{this.props.telephone}</Text>
                ) : null
              }
              {
                this.props.mobile != '' ? (
                  <Text style={styles.text}>{this.props.mobile}</Text>
                ) : null
              }
              {
                this.props.email != '' ? (
                  <Text style={styles.text}>{this.props.email}</Text>
                ) : null
              }
              {
                this.props.website != '' ? (
                  <Text style={styles.text} onPress={() => Linking.openURL(`http://${this.props.website}`)}>{this.props.website}</Text>
                ) : null
              }
              {
                this.props.twitter != '' ? (
                  <Text style={styles.text}>{this.props.twitter}</Text>
                ) : null
              }

              {
                this.props.name == 'Gold Sponsor & AMEC Awards 2017 Sponsor' ? (
                  <View style={{marginTop: 35}}>
                    <Text style={{width: 282, fontSize: 18, color: '#000000', letterSpacing: -0.4, fontWeight: '900', textAlign: 'left', marginLeft: 8, marginBottom: 9}}>Tom Vesey, Managing Director Global Analytics</Text>
                    <Text style={styles.text}>Tel: +44 (0) 20 8877 3314{'\n'}Email: tom.vesey@carma.com</Text>
                    <Text style={styles.text} onPress={() => Linking.openURL('http://www.carma.com')}>www.carma.com</Text>
                    <Text style={styles.text}>@CARMA</Text>
                  </View>
                ) : null
              }

              {
                this.props.email == 'Email: rundong_xu@cipra.org.cn' ? (
                  <View style={{marginTop: 35}}>
                    <Text style={{width: 282, fontSize: 18, color: '#000000', letterSpacing: -0.4, fontWeight: '900', textAlign: 'left', marginLeft: 8, marginBottom: 9}}>Huo Ran, Vice Director of Research & Development Department, China International Public Relations Association(CIPRA).</Text>
                    <Text style={styles.text}>Tel: +86 18201097899{'\n'}Email: ran_huo@cipra.org.cn</Text>
                  </View>
                ) : null
              }

              {
                this.props.email == 'Email: rundong_xu@cipra.org.cn' ? (
                  <View style={{marginTop: 35}}>
                    <Text style={{width: 282, fontSize: 18, color: '#000000', letterSpacing: -0.4, fontWeight: '900', textAlign: 'left', marginLeft: 8, marginBottom: 9}}>Shen Jian, Senior Vice President, D&S Media Group</Text>
                    <Text style={styles.text}>Tel: +86 18610261029</Text>
                  </View>
                ) : null
              }

              <View style={{width: width, height: 40}}/>

            </ScrollView>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  image_view: {
    marginTop: 37,
    width: 147,
    height: 95,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    backgroundColor: '#ffffff'
  },
  text: {
    width: width-20,
    fontSize: 13,
    color: '#000000',
    letterSpacing: -0.3,
    textAlign: 'left',
    marginLeft: 10
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

export default connect(mapStateToProps, mapDispatchToProps)(Sponsors)
