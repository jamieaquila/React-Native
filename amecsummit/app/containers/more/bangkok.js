import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, ListView, TouchableHighlight, TouchableOpacity, Dimensions, Animated, Platform} from "react-native";
import { Actions } from 'react-native-router-flux'

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Images } from '../../themes'

import Styles from '../../styles/NavigationContainerStyle'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class Bangkok extends React.Component {
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

              <Text style={{fontSize: 17, color: '#ffffff', textAlign: 'center', letterSpacing: -0.4, fontWeight: '600', position: 'absolute', top: Platform.OS === 'ios' ? 31 : 10, left: width/2-27}}>Explore</Text>
            </View>
            <ScrollView style={{marginBottom: 48, alignSelf: 'center'}}>
              <View style={{width: width}}>
                <Text style={{fontSize: 13, color: '#000000', textAlign: 'left', letterSpacing: -0.3, marginTop: 17, marginLeft: 10, marginRight: 17}}>Mention Bangkok and you suddenly have everyone’s attention. People remember their first or last visit. They talk about sunrise or sunset over the river that snakes through the centre of the capital; of the bars; the street-food and the markets. And always, about the warmth of the Thai people.</Text>
              </View>
              <View style={{width: width, height: 1, backgroundColor: '#d8d8d8', marginTop: 16}}/>

              <View style={styles.render_view}>
                <Image source={Images.Noodles}  style={styles.image_view}/>
                <View style={styles.text_view}>
                  <Text style={styles.title_text}>Food</Text>
                  <Text style={styles.details_text}>Noodles, spicy, sour, sweet and salty</Text>
                </View>
              </View>
              <View style={styles.line_view}/>

              <View style={styles.render_view}>
                <Image source={Images.Explore}  style={styles.image_view}/>
                <View style={styles.text_view}>
                  <Text style={styles.title_text}>Explore</Text>
                  <Text style={styles.details_text}>Hidden markets, dark alleys of Chinatown and the great Chao Praya River</Text>
                </View>
              </View>
              <View style={styles.line_view}/>

              <View style={styles.render_view}>
                <Image source={Images.Bangkok_river}  style={styles.image_view}/>
                <View style={styles.text_view}>
                  <Text style={styles.title_text}>The Thais</Text>
                  <Text style={styles.details_text}>Anything worth doing should have an element of sà·nùk (fun)</Text>
                </View>
              </View>
              <View style={styles.line_view}/>

              <Text style={{fontSize: 12, fontWeight: 'bold', letterSpacing: -0.3, color: '#e10333', marginTop: 37, marginLeft: 10}}>TOP THINGS TO DO</Text>
              <View style={styles.line_view}/>

              <View style={styles.render_view}>
                <Image source={Images.Jim}  style={styles.image_view}/>
                <View style={styles.text_view}>
                  <Text style={styles.title_text}>Jim Thompson House</Text>
                  <Text style={styles.details_text}>The former home of the eponymous American silk entrepreneur and art collector.</Text>
                </View>
              </View>
              <View style={styles.line_view}/>

              <View style={styles.render_view}>
                <Image source={Images.floating}  style={styles.image_view}/>
                <View style={styles.text_view}>
                  <Text style={styles.title_text}>Tha Kha Floating Market, Samut Songkhram</Text>
                  <Text style={styles.details_text}>A rendezvous of vendor boats that carry local food, vegetable, and fruit for selling.</Text>
                </View>
              </View>
              <View style={styles.line_view}/>

              <View style={styles.render_view}>
                <Image source={Images.Weekend}  style={styles.image_view}/>
                <View style={styles.text_view}>
                  <Text style={styles.title_text}>Chatuchak Weekend Market</Text>
                  <Text style={styles.details_text}>Among the largest markets in the world. Chatuchak unites everything buyable from used vintage sneakers to baby squirrels.</Text>
                </View>
              </View>
              <View style={styles.line_view}/>

              <Text style={{fontSize: 12, fontWeight: 'bold', letterSpacing: -0.3, color: '#e10333', marginTop: 37, marginLeft: 10}}>HISTORIC TEMPLES AND ROYAL PALACES</Text>
              <View style={styles.line_view}/>

              <View style={styles.render_view}>
                <Image source={Images.Wat}  style={styles.image_view}/>
                <View style={styles.text_view}>
                  <Text style={styles.title_text}>Wat Pho</Text>
                  <Text style={styles.details_text}>The city’s largest reclining Buddha, the largest collection of Buddha images in Thailand and the country’s earliest centre for public education.</Text>
                </View>
              </View>
              <View style={styles.line_view}/>

              <View style={styles.render_view}>
                <Image source={Images.Temple}  style={styles.image_view}/>
                <View style={styles.text_view}>
                  <Text style={styles.title_text}>Temple of Dawn</Text>
                  <Text style={styles.details_text}>Towering over the banks of the Chao Phraya River with its unique design and colourfully decorated spires, the Temple of the Dawn (Wat Arun) is easily one of the most visually striking and famous landmarks in Bangkok.</Text>
                </View>
              </View>
              <View style={styles.line_view}/>

              <View style={styles.render_view}>
                <Image source={Images.Ayutthaya}  style={styles.image_view}/>
                <View style={styles.text_view}>
                  <Text style={styles.title_text}>Ancient Kingdom of Ayutthaya</Text>
                  <Text style={styles.details_text}>Once an important centre of global diplomacy and commerce, Ayutthaya is now an archaeological ruin with remains of tall prang (reliquary towers) and Buddhist monasteries of monumental proportions.</Text>
                </View>
              </View>
              <View style={styles.line_view}/>

            </ScrollView>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  render_view: {
    flexDirection: 'row'
  },
  image_view: {
    marginLeft: 10,
    marginTop: 10,
    width: 60,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  text_view: {
    width: width-95,
    flexDirection: 'column',
    marginLeft: 10,
    marginTop: 10
  },
  title_text: {
    fontSize: 17,
    color: '#1f1f1f',
    letterSpacing: -0.4,
    fontWeight: '600'
  },
  details_text: {
    fontSize: 13,
    color: '#000000',
    letterSpacing: -0.3
  },
  line_view: {
    width: width,
    height: 1,
    backgroundColor: '#d8d8d8',
    marginTop: 10
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

export default connect(mapStateToProps, mapDispatchToProps)(Bangkok)
