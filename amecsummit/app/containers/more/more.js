import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, ListView, TouchableHighlight, TouchableOpacity, Dimensions, Animated, Platform, Linking} from "react-native";
import { Actions } from 'react-native-router-flux'

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Images } from '../../themes'

import firebase from 'firebase';
import {getSpeakers, getAgenda} from '../../actions';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class More extends React.Component {
    constructor(props) {
        super(props);

        this.rootRef = firebase.database().ref();

        this.state = {

        }
    }

    componentDidMount() {
      this.rootRef.on('value', (dataSnapshot) => {
        var speakers = [];
        dataSnapshot.forEach((child) => {
          this.props.getAgenda(child.val())
          for (let prop in child.val()) {
            speakers.push(child.val()[prop]);
          }
        });
        this.props.getSpeakers(speakers)
      });
    }

    render() {
        return (
          <View style={styles.container}>
            <ScrollView style={{marginBottom: 49}}>
              <Image source={Images.logos}  style={{width: width, height: 172, backgroundColor: '#e10333', alignItems: 'center'}} resizeMode={'stretch'}>
                <Text style={{fontSize: 23, color: '#ffffff', letterSpacing: -0.6, fontWeight: '900', textAlign: 'center', marginTop: 37, backgroundColor: 'rgba(0,0,0,0)'}}>Welcome to AMEC</Text>
                <Text style={{width: width-30, fontSize: 13, color: '#ffffff', letterSpacing: -0.3, textAlign: 'center', marginTop: 20, backgroundColor: 'rgba(0,0,0,0)'}}>Thank you for downloading the 2017 AMEC{'\n'}Summit app. Here are some tips and information{'\n'}to help you make the better use of the app and{'\n'}your time at the Summit.</Text>
              </Image>

              <TouchableOpacity style={styles.render_view}  onPress={() => Linking.openURL('https://twitter.com/AmecOrg')}>
                <Image source={Images.twitter}  style={styles.image_view}/>
                <View style={{marginLeft: 10, justifyContent: 'center'}}>
                  <Text style={{fontSize: 13, color: '#000000', letterSpacing: -0.3}} numberOfLines={1}>Join in on Twitter</Text>
                  <Text style={{fontSize: 17, color: '#1f1f1f', letterSpacing: -0.4, fontWeight: '600'}} numberOfLines={1}>#amecsummit</Text>
                </View>
                <Icon name="angle-right" size={30} color={'#c7c7cc'} style={{position: 'absolute', right: 10}} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.render_view}  onPress={() => Linking.openURL('https://www.facebook.com/amecorg/')}>
                <Image source={Images.facebook}  style={styles.image_view}/>
                <View style={{marginLeft: 10, justifyContent: 'center'}}>
                  <Text style={{fontSize: 13, color: '#000000', letterSpacing: -0.3}} numberOfLines={1}>Find us on Facebook</Text>
                  <Text style={{fontSize: 17, color: '#1f1f1f', letterSpacing: -0.4, fontWeight: '600'}} numberOfLines={1}>AMECorg</Text>
                </View>
                <Icon name="angle-right" size={30} color={'#c7c7cc'} style={{position: 'absolute', right: 10}} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.render_view}  onPress={Actions.tips}>
                <Image source={Images.tip}  style={styles.image_view}/>
                <Text style={{fontSize: 17, color: '#1f1f1f', letterSpacing: -0.4, fontWeight: '600', justifyContent: 'center', marginLeft: 10}} numberOfLines={1}>Tips</Text>
                <Icon name="angle-right" size={30} color={'#c7c7cc'} style={{position: 'absolute', right: 10}} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.render_view}  onPress={Actions.accomodation}>
                <Image source={Images.Accomadation}  style={styles.image_view}/>
                <Text style={{fontSize: 17, color: '#1f1f1f', letterSpacing: -0.4, fontWeight: '600', justifyContent: 'center', marginLeft: 10}} numberOfLines={1}>Accommodation</Text>
                <Icon name="angle-right" size={30} color={'#c7c7cc'} style={{position: 'absolute', right: 10}} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.render_view}  onPress={Actions.bangkok}>
                <Image source={Images.Explore}  style={styles.image_view}/>
                <Text style={{fontSize: 17, color: '#1f1f1f', letterSpacing: -0.4, fontWeight: '600', justifyContent: 'center', marginLeft: 10}} numberOfLines={1}>Explore Bangkok</Text>
                <Icon name="angle-right" size={30} color={'#c7c7cc'} style={{position: 'absolute', right: 10}} />
              </TouchableOpacity>
            </ScrollView>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  render_view: {
    flexDirection: 'row',
    width: width,
    height: 79,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  image_view: {
    marginLeft: 10,
    width: 60,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
});

const mapStateToProps = (state) => {
    const props = {

    };
    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {
      getSpeakers: (speakers) => {
        dispatch(getSpeakers(speakers));
      },
      getAgenda: (agenda) => {
        dispatch(getAgenda(agenda));
      }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(More)
