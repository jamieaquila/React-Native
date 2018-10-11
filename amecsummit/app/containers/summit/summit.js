import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, ListView, TouchableHighlight, TouchableOpacity, Dimensions, Animated, Platform, Linking} from "react-native";
import { Actions } from 'react-native-router-flux'

import { connect } from 'react-redux'

import Icon from 'react-native-vector-icons/FontAwesome';

import { Images } from '../../themes'

import { FIREBASE_CONFIG, Logos, Awards } from '../../config';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class Summit extends React.Component {
    constructor(props) {
        super(props);

        const rowHasChanged = (r1, r2) => r1 !== r2
        const ds = new ListView.DataSource({rowHasChanged})

        this.state = {
          speaker_state: 0,
          dataSource: ds
        }
    }

    componentDidMount() {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(this.props.speakers)})
    }

    renderRow (rowData) {
      return (
        <TouchableOpacity style={styles.render_view}  onPress={() => Actions.speakers(rowData)}>
          <Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${rowData.image}`}} style={styles.image_view}/>
          <View style={{flexDirection: 'column', marginLeft: 10}}>
            <Text style={{fontSize: 17, color: '#1f1f1f', fontWeight: '600', justifyContent: 'center'}} numberOfLines={1}>{rowData.name}</Text>
            <Text style={{width: width*2/3, fontSize: 12, color: '#8a8a8a', justifyContent: 'center', marginTop: 4}} numberOfLines={1}>{rowData.title}</Text>
          </View>
          <Icon name="angle-right" size={30} color={'#c7c7cc'} style={{position: 'absolute', right: 10}} />
        </TouchableOpacity>
      )
    }

    render() {
        return (
          <View style={styles.container}>
            <View style={styles.navBar}>
              <View style={styles.navBar_view}>
                <TouchableOpacity style={this.state.speaker_state == 0 ? [styles.nav_touch, {borderBottomLeftRadius: 4, borderTopLeftRadius: 4, backgroundColor: '#ffffff'}] : [styles.nav_touch, {borderBottomLeftRadius: 4, borderTopLeftRadius: 4, borderRightWidth: 1, borderColor: '#ffffff'}]} onPress={() => this.setState({speaker_state: 0})}>
                  <Text style={this.state.speaker_state == 0 ? [styles.nav_text, {color: '#e10333', fontWeight: 'bold'}] : styles.nav_text}>Speakers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={this.state.speaker_state == 1 ? [styles.nav_touch, {backgroundColor: '#ffffff'}] : styles.nav_touch} onPress={() => this.setState({speaker_state: 1})}>
                  <Text style={this.state.speaker_state == 1 ? [styles.nav_text, {color: '#e10333', fontWeight: 'bold'}] : styles.nav_text}>Sponsors</Text>
                </TouchableOpacity>
                <TouchableOpacity style={this.state.speaker_state == 2 ? [styles.nav_touch, {borderBottomRightRadius: 4, borderTopRightRadius: 4, backgroundColor: '#ffffff'}] : [styles.nav_touch, {borderBottomRightRadius: 4, borderTopRightRadius: 4, borderLeftWidth: 1, borderColor: '#ffffff'}]} onPress={() => this.setState({speaker_state: 2})}>
                  <Text style={this.state.speaker_state == 2 ? [styles.nav_text, {color: '#e10333', fontWeight: 'bold'}] : styles.nav_text}>Awards</Text>
                </TouchableOpacity>
              </View>
            </View>
            {
              this.state.speaker_state == 0 ? (
                <ListView
                  style={{marginBottom: 48}}
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow.bind(this)}
                />
              ) : this.state.speaker_state == 1 ? (
                <ScrollView style={{marginBottom: 48}}>
                  {
                    Logos.map((logo, i) =>
                      <View key={i} style={i == 0 ? [styles.logos_view, {marginTop: 5}] : i == 14 ? [styles.logos_view, {marginBottom: 29}] : styles.logos_view}>
                        {
                          logo.map((details, j) =>
                            <TouchableOpacity key={j} style={styles.details_view} onPress={() => Actions.sponsors(details)}>
                              <Image source={details.icon} style={{width: width/2-50, height: 70}} resizeMode={'contain'}/>
                            </TouchableOpacity>
                          )
                        }
                      </View>
                    )
                  }
                </ScrollView>
              ) : (
                <ScrollView style={{marginBottom: 48}}>
                  <Text style={styles.red_text3}>AMEC AWARDS 2017 AND SUMMIT DINNER</Text>
                  <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Headline Sponsor: Ninestars</Text>
                  <TouchableOpacity style={styles.logo_view} onPress={() => Actions.sponsors(Logos[0][1])}>
                    <Image source={Images.ninestars} style={{width: 120, height: 70}} resizeMode={'contain'}/>
                  </TouchableOpacity>

                  <Text style={[styles.red_text2, {marginLeft: 10, marginRight: 18}]}>Anantara Riverside Bangkok Resort (5 minute walk from the Summit hotel ground floor lobby. There will be guides to escort you)</Text>

                  <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Drinks Reception</Text>
                  <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Grand Sala</Text>
                  <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>18.30</Text>

                  <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Summit Gala Dinner followed by AMEC Awards 2017 Ceremony</Text>
                  <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Riverside Terrace</Text>
                  <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>19.15</Text>

                  <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Post-Awards Drinks Reception</Text>
                  <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>22.00 – midnight</Text>

                  <Text style={[styles.red_text2, {marginLeft: 10, marginRight: 18}]}>The AMEC International Communication Effectiveness Awards will again be announced as part of the Summit Dinner. An international panel of judges have reviewed entries and decided on the winners who will announced in an evening of celebration.</Text>

                  <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>SHORTLIST</Text>

                  {
                    Awards.map((award, i) =>
                      <View key={i}>
                        <Text style={{fontSize: 12, color: '#e10333', letterSpacing: -0.3, fontWeight: 'bold', textAlign: 'left', marginTop: 20, marginLeft: 10}}>{award.title}</Text>
                        {
                          award.description.map((details, j) =>
                            <View key={j} style={j == 0 ? {marginTop: 8, marginLeft: 8} : {marginTop: 30, marginLeft: 8}}>
                              <Text style={{fontSize: 18, color: '#000000', letterSpacing: -0.4, fontWeight: '900', textAlign: 'left'}}>{details.sub_title}</Text>
                              <Text style={{fontSize: 13, color: '#1f1f1f', letterSpacing: -0.3, textAlign: 'left', marginTop: 10}}>{details.details}</Text>
                            </View>
                          )
                        }
                      </View>
                    )
                  }
                  <TouchableOpacity style={{width: width-20, height: 61, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e10333', borderRadius: 10, marginTop: 24.6, marginBottom: 20}} onPress={() => Linking.openURL('https://www.regonline.com/registration/Checkin.aspx?EventID=1908104')}>
                    <Text style={{fontSize: 18, color: '#ffffff', letterSpacing: -0.4, fontWeight: '900', textAlign: 'center'}}>Need a ticket?</Text>
                  </TouchableOpacity>
                </ScrollView>
              )
            }
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection:'row',
    height: Platform.OS === 'ios' ? 64 : 44,
    width: width,
    backgroundColor: "#e10333",
    alignItems: 'center',
    justifyContent: 'center'
  },
  navBar_view: {
    flexDirection: 'row',
    width: width - 16,
    height: 29,
    borderWidth: 1,
    borderColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: Platform.OS === 'ios' ? 17.5 : 0
  },
  nav_touch: {
    width: (width - 18)/3,
    height: 29,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  nav_text: {
    fontSize: 13,
    color: '#ffffff',
    letterSpacing: -0.1,
    backgroundColor: 'rgba(0,0,0,0)',
    textAlign: 'center'
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
  logos_view: {
    flexDirection: 'row',
    width: width,
    height: 105,
    alignItems: 'center',
    alignSelf: 'center'
  },
  details_view: {
    width: width/2-15,
    height: 95,
    marginLeft: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    backgroundColor: '#ffffff'
  },
  red_text1: {
    fontSize: 17, color: '#000000', fontWeight: '600', letterSpacing: -0.4, justifyContent: 'center', marginLeft: 7
  },
  red_text2: {
    fontSize: 12, color: '#000000', letterSpacing: -0.3, justifyContent: 'center', marginTop: 4, marginLeft: 7
  },
  red_text3: {
    fontSize: 12, color: '#e10333', letterSpacing: -0.3, fontWeight: 'bold', marginTop: 21, marginLeft: 10
  },
  logo_view: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
    width: 147,
    height: 95,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    backgroundColor: '#ffffff'
  }
});

const mapStateToProps = (state) => {
    const props = {
      speakers: state.speakers.speakers
    };
    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Summit)
