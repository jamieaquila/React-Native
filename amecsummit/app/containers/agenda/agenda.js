import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, ListView, TouchableHighlight, TouchableOpacity, Dimensions, Animated, Platform} from "react-native";
import { Actions } from 'react-native-router-flux'

import { connect } from 'react-redux'

import Icon from 'react-native-vector-icons/FontAwesome';
import { Images } from '../../themes'

import { FIREBASE_CONFIG } from '../../config';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class Agenda extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          week_state: 1
        }
    }

    componentDidMount() {

    }

    TuesdayView(){
      return (
        <ScrollView style={{marginBottom: 49}}>
          <View style={[styles.red_view, {marginTop: 0}]}>
            <Text style={styles.red_text1}>Registration</Text>
            <Text style={styles.red_text2}>11th Floor Hotel Lobby, AVANI Riverside Bangkok Hotel</Text>
            <Text style={styles.red_text2}>16.00 – 20.00</Text>
          </View>

          <Text style={styles.red_text3}>Welcome Drinks Reception</Text>
          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 5, marginLeft: 10}]}>Attitude Rooftop Bar, AVANI Riverside Bangkok Hotel</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Sponsored by Media Track Pte Ltd</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>18.00 – 19.30</Text>

        </ScrollView>
      )
    }

    WednesdayView(){
      return (
        <ScrollView style={{marginBottom: 49}}>
          <View style={[styles.red_view, {marginTop: 0}]}>
            <Text style={styles.red_text1}>Registration & Refreshments</Text>
            <Text style={styles.red_text2}>Summit Networking Hub, 10th Floor</Text>
            <Text style={styles.red_text2}>07.30 – 09.00</Text>
          </View>

          <Text style={styles.red_text3}>SUMMIT SCENE-SETTER WORKSHOP</Text>
          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 5, marginLeft: 10}]}>Results from AMEC’s Global Business Insights Survey</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Wind Room, 10th Floor</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>07.30 – 08.30</Text>

          <View style={{flexDirection: 'row', marginTop: 18, marginLeft: 10}}>
            <View>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>PANEL</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Carlos-Diaz.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> :
                    speaker.image == "Michael-OConnell.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                    speaker.image == "Francois-van-Dyk.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginRight: 10}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>MODERATORS</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Rayna-de-Lange.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> :
                    speaker.image == "Phillip-Lynch.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginRight: 10}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
          </View>

          <View style={styles.line_view}/>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Welcome and Introductions</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar/Moon Rooms, 10th Floor</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>09.00</Text>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            {
              this.props.speakers.map((speaker, i) =>
                speaker.image == "Richard-Bagnall.jpeg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                speaker.image == "John-Croll.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                speaker.image == "Barry-Leggetter.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
              )
            }
          </View>

          <View style={styles.line_view}/>

          <Text style={styles.red_text3}>ASIA MASTERCLASS</Text>
          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 5, marginLeft: 10}]}>How does the Asia Powerhouse influences global communication trends?</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar/Moon Rooms</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>09.15</Text>

          <View style={{flexDirection: 'row', marginTop: 18, marginLeft: 10}}>
            <View>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>SPEAKERS</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "John-Croll.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> :
                    speaker.image == "Elaine-Ng.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                    speaker.image == "Fritz-Quinn.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginRight: 10}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>MODERATOR</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Barry-Leggetter.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
          </View>

          <View style={styles.line_view}/>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Measurement Majlis: Listen and Learn, or Fail</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar/Moon Rooms</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>10.15</Text>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            {
              this.props.speakers.map((speaker, i) =>
                speaker.image == "Brian-Lott.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
              )
            }
          </View>

          <View style={styles.red_view}>
            <Text style={styles.red_text1}>Networking refreshment break</Text>
            <Text style={styles.red_text2}>Summit Networking Hub, 10th Floor</Text>
            <Text style={styles.red_text2}>10.40 – 11.10</Text>
          </View>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Finding Esperanto</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar/Moon Rooms</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>11.10</Text>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            {
              this.props.speakers.map((speaker, i) =>
                speaker.image == "Deepa-Day.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
              )
            }
          </View>

          <View style={styles.line_view}/>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Only you can do what you do (and you can prove it)</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar/Moon Rooms</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>11.35</Text>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            {
              this.props.speakers.map((speaker, i) =>
                speaker.image == "Fritz-Quinn.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
              )
            }
          </View>

          <View style={styles.line_view}/>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Drive-thru the boardroom - do we measure relevancy + advocacy and link it to sales?</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar/Moon Rooms</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>12.00</Text>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            {
              this.props.speakers.map((speaker, i) =>
                speaker.image == "Lavanya-Wadgaonkar.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
              )
            }
          </View>

          <View style={styles.line_view}/>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Measurement in a changing governance landscape</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar/Moon Rooms</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>12.25</Text>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            {
              this.props.speakers.map((speaker, i) =>
                speaker.image == "Ivan-YEO.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
              )
            }
          </View>

          <View style={styles.red_view}>
            <Text style={styles.red_text1}>Lunch & business networking</Text>
            <Text style={styles.red_text2}>Skyline Restaurant, 11th Floor</Text>
            <Text style={styles.red_text2}>12.50</Text>
          </View>

          <Text style={styles.red_text3}>LUNCH TIME PRESENTATION</Text>
          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 5, marginLeft: 10}]}>What can social media in China teach the world?</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Wind Room, 10th Floor</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>13.15 – 13.55</Text>

          <View style={{flexDirection: 'row', marginTop: 20}}>
            {
              this.props.speakers.map((speaker, i) =>
                speaker.image == "Linda-Xu.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
              )
            }
          </View>

          <View style={styles.line_view}/>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>How to measure nothing. Or, how quantum theory can help evaluate the absence of action</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar/Moon Rooms</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>14.00</Text>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            {
              this.props.speakers.map((speaker, i) =>
                speaker.image == "David-Watson.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
              )
            }
          </View>

          <View style={styles.line_view}/>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Measuring Voices … beyond just us!</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar/Moon Rooms</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>14.25</Text>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            {
              this.props.speakers.map((speaker, i) =>
                speaker.image == "Rachana-Panda.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
              )
            }
          </View>

          <View style={styles.line_view}/>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>From Taking Credit to Taking Action</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar/Moon Rooms</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>14.50</Text>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            {
              this.props.speakers.map((speaker, i) =>
                speaker.image == "Jamin-Spitzer.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
              )
            }
          </View>

          <View style={styles.red_view}>
            <Text style={styles.red_text1}>Networking refreshment break</Text>
            <Text style={styles.red_text2}>Summit Networking Hub, 10th Floor</Text>
            <Text style={styles.red_text2}>15.15 – 15.45</Text>
          </View>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Navigating the world of Influencer Engagement: Opportunities and Challenges for PR</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar/Moon Rooms</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>15.45</Text>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            {
              this.props.speakers.map((speaker, i) =>
                speaker.image == "Christopher-Daguimol.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
              )
            }
          </View>

          <View style={styles.line_view}/>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>The convergence of traditional media and social media. Are you listening?</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar/Moon Rooms</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>16.10</Text>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            {
              this.props.speakers.map((speaker, i) =>
                speaker.image == "Dianne-Draganovic.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
              )
            }
          </View>

          <View style={styles.line_view}/>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>How Brexit brought insights and evaluation into the global spotlight</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar/Moon Rooms</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>16.35</Text>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            {
              this.props.speakers.map((speaker, i) =>
                speaker.image == "Jim-Macnarmara.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
              )
            }
          </View>

          <View style={[styles.red_view, {height: 78}]}>
            <Text style={styles.red_text1}>Day 1 ends</Text>
            <Text style={styles.red_text2}>17.00</Text>
          </View>

          <Text style={styles.red_text3}>AMEC AWARDS 2017 AND SUMMIT DINNER</Text>
          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Headline Sponsor: Ninestars</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginRight: 18}]}>Anantara Riverside Bangkok Resort (5 minute walk from the Summit hotel ground floor lobby. There will be guides to escort you)</Text>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Drinks Reception</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Grand Sala</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>18.30</Text>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Summit Gala Dinner followed by AMEC Awards 2017 Ceremony</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Riverside Terrace</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>19.15</Text>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>Post-Awards Drinks Reception</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4, marginBottom: 25}]}>22.00</Text>

        </ScrollView>
      )
    }

    ThursdayView(){
      return (
        <ScrollView style={{marginBottom: 49}}>
          <View style={[styles.red_view, {marginTop: 0}]}>
            <Text style={styles.red_text1}>Registration & Refreshments</Text>
            <Text style={styles.red_text2}>Summit Networking Hub, 10th Floor</Text>
            <Text style={styles.red_text2}>08.30 – 09.00</Text>
          </View>

          <Text style={styles.red_text3}>SUMMIT SPECIAL SESSION</Text>
          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 5, marginLeft: 10}]}>Measurement and the PR and Communications Professional{'\n'}Why measurement should be non-negotiable!</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar/Moon Rooms</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>09.00</Text>

          <View style={{marginTop: 18, marginLeft: 10}}>
            <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>STAGE 1</Text>
            <View style={{flexDirection: 'row', marginTop: 3}}>
              {
                this.props.speakers.map((speaker, i) =>
                  speaker.image == "Francis-Ingham.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> :
                  speaker.image == "Dr-Rajeev-Kumar.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                  speaker.image == "Brian-Lott.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                  speaker.image == "Tina-McCorkindale.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                  speaker.image == "Xu-Weidong.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                  speaker.image == "Andy-West.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
                )
              }
            </View>
          </View>

          <View style={styles.line_view}/>

          <View style={{marginTop: 18, marginLeft: 10}}>
            <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>STAGE 2</Text>
            <View style={{flexDirection: 'row', marginTop: 3}}>
              {
                this.props.speakers.map((speaker, i) =>
                  speaker.image == "Deepa-Day.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> :
                  speaker.image == "Nitin-Mantri.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                  speaker.image == "Fritz-Quinn.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                  speaker.image == "David-Watson.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
                )
              }
            </View>
          </View>

          <View style={styles.line_view}/>

          <View style={{flexDirection: 'row', marginTop: 18, marginLeft: 10}}>
            <View>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>VIRTUAL STAGE</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Juan-Fernando.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> :
                    speaker.image == "Paul-Hender.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                    speaker.image == "Mazen-Nahawi.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                    speaker.image == "Sean-Smith.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginRight: 10}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>MODERATORS</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Richard-Bagnall.jpeg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> :
                    speaker.image == "Barry-Leggetter.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginRight: 10}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
          </View>

          <View style={styles.line_view}/>

          <Text style={styles.red_text3}>SUMMIT KEYNOTE ADDRESS</Text>
          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 5, marginLeft: 10}]}>Cloud Data, Technology and Measurement Transformation: Finally coming to the Communications World</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar/Moon Rooms</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>10.30</Text>

          <View style={{flexDirection: 'row', marginTop: 20}}>
            {
              this.props.speakers.map((speaker, i) =>
                speaker.image == "Kevin-Akeroyd.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
              )
            }
          </View>

          <View style={styles.red_view}>
            <Text style={styles.red_text1}>Networking refreshment break</Text>
            <Text style={styles.red_text2}>Group photo opportunity outside the conference room!</Text>
            <Text style={styles.red_text2}>10.55 – 11.45</Text>
          </View>

          <Text style={styles.red_text3}>WORKSHOP A & B</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>11.45 – 12.45</Text>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>WORKSHOP A</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar Room</Text>
          <Text style={[styles.red_text3, {color: '#000000', marginTop: 4, marginLeft: 7}]}>“Mirror Mirror on the Wall”</Text>
          <Text style={styles.red_text2}>Is the real barrier to measurement vanity? Ego? Not space to fail and learn? How can we sell measurement in a business climate that is risk averse?</Text>
          <View style={{flexDirection: 'row', marginTop: 18, marginLeft: 10}}>
            <View>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>PANEL</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Christopher-Daguimol.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> :
                    speaker.image == "Khali-Sakkas.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                    speaker.image == "Lavanya-Wadgaonkar.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginRight: 10}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>MODERATOR</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Marion-McDonald.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
          </View>

          <View style={styles.line_view}/>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>WORKSHOP B</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Moon Room</Text>
          <Text style={[styles.red_text3, {color: '#000000', marginTop: 4, marginLeft: 7}]}>Walking the Talk – Getting Real Value from Data</Text>
          <Text style={styles.red_text2}>Big Data is everywhere but how much have we really progresses in the use of research and measurement in communications? The stats are positive but what’s the real story and more importantly, how do we improve it?</Text>
          <View style={{flexDirection: 'row', marginTop: 18, marginLeft: 10}}>
            <View>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>PANEL</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Rachana-Panda.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> :
                    speaker.image == "Aseem-Sood.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                    speaker.image == "Matthew-Stanton.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginRight: 10}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>MODERATOR</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Ruth-Pestana.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
          </View>

          <View style={styles.line_view}/>

          <Text style={styles.red_text3}>WORKSHOP C & D</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>12.50 – 13.35</Text>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>WORKSHOP C</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar Room</Text>
          <Text style={[styles.red_text3, {color: '#000000', marginTop: 4, marginLeft: 7}]}>How to use the new AMEC Framework – a practical tutorial</Text>
          <Text style={styles.red_text2}>A practical ‘how to’ session. Two of the international team who developed the Framework will explain why it is needed, what it is and how to get the best results from adapting and using it.</Text>

          <View style={{marginTop: 18, marginLeft: 10}}>
            <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>Presenters</Text>
            <View style={{flexDirection: 'row', marginTop: 3}}>
              {
                this.props.speakers.map((speaker, i) =>
                  speaker.image == "Richard-Bagnall.jpeg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> :
                  speaker.image == "Paul-Hender.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
                )
              }
            </View>
          </View>

          <View style={styles.line_view}/>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>WORKSHOP D</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Moon Room</Text>
          <Text style={[styles.red_text3, {color: '#000000', marginTop: 4, marginLeft: 7}]}>Content and data rights in the digital age</Text>
          <Text style={styles.red_text2}>How leading organisations use content and data to give competitive advantage</Text>
          <View style={{flexDirection: 'row', marginTop: 18, marginLeft: 10}}>
            <View>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>PANEL</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Andrew-Hughes.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> :
                    speaker.image == "Sean-Smith.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginRight: 10}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>MODERATOR</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Christophe-Dickes.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
          </View>

          <View style={styles.red_view}>
            <Text style={styles.red_text1}>Lunch & Business Networking</Text>
            <Text style={styles.red_text2}>Skyline Restaurant, 11th Floor</Text>
            <Text style={styles.red_text2}>13.35 – 14.35</Text>
          </View>

          <Text style={styles.red_text3}>WORKSHOP E & F</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>14.35 – 15.20</Text>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>WORKSHOP E</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar Room</Text>
          <Text style={[styles.red_text3, {color: '#000000', marginTop: 4, marginLeft: 7}]}>Measurement and Evaluation Across Communication Industries</Text>
          <Text style={styles.red_text2}>Latest trends and developments in standards and best practice globally</Text>

          <View style={{marginTop: 18, marginLeft: 10}}>
            <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>PRESENTER</Text>
            <View style={{flexDirection: 'row', marginTop: 3}}>
              {
                this.props.speakers.map((speaker, i) =>
                  speaker.image == "Jim-Macnarmara.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> : null
                )
              }
            </View>
          </View>

          <View style={styles.line_view}/>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>WORKSHOP F</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Moon Room</Text>
          <Text style={[styles.red_text3, {color: '#000000', marginTop: 4, marginLeft: 7}]}>Measurement in a post-truth world: how does the measurement and research industry need to address fake news and alternative facts?</Text>
          <Text style={styles.red_text2}>How to face up to and deal with the new global challenges of fake news and “alternative facts” in traditional and social media.</Text>
          <View style={{flexDirection: 'row', marginTop: 18, marginLeft: 10}}>
            <View>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>PANEL</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Ngaire-Crawford.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> :
                    speaker.image == "Ben-Levine.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                    speaker.image == "Michael-OConnell.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginRight: 10}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>MODERATOR</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Mazen-Nahawi.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
          </View>

          <View style={styles.red_view}>
            <Text style={styles.red_text1}>Networking refreshment break</Text>
            <Text style={styles.red_text2}>Summit Networking Hub, 10th Floor</Text>
            <Text style={styles.red_text2}>15.20 – 15.50</Text>
          </View>

          <Text style={styles.red_text3}>WORKSHOP G & H</Text>
          <Text style={[styles.red_text2, {color: '#8a8a8a', marginLeft: 10}]}>15.50 – 16.50</Text>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>WORKSHOP G</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Lunar Room</Text>
          <Text style={[styles.red_text3, {color: '#000000', marginTop: 4, marginLeft: 7}]}>Measurement in action: The latest trends from around the world!</Text>
          <Text style={styles.red_text2}>Actionable trends from new research and campaign results from around the world</Text>

          <View style={{flexDirection: 'row', marginTop: 18, marginLeft: 10}}>
            <View>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>SPEAKERS</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Christophe-Dickes.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> :
                    speaker.image == "Kasper-Hulsen.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                    speaker.image == "Per-Ostergaard.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                    speaker.image == "Anna-Rokina.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                    speaker.image == "Lasse-Skjoldan.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginRight: 10}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>MODERATOR</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Johna-Burke.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
          </View>

          <View style={styles.line_view}/>

          <Text style={[styles.red_text1, {color: '#1f1f1f', marginTop: 20, marginLeft: 10}]}>WORKSHOP H</Text>
          <Text style={[styles.red_text2, {marginLeft: 10, marginTop: 4}]}>Moon Room</Text>
          <Text style={styles.red_text2}>Insight, impact and change! Measurement and analytics at a cross roads of change and evolution.</Text>

          <View style={{flexDirection: 'row', marginTop: 18, marginLeft: 10}}>
            <View>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>SPEAKERS</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Steffen-Egelund.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> :
                    speaker.image == "Sharam-Fouladgar.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                    speaker.image == "Mazen-Nahawi.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                    speaker.image == "Mats-Wangelin.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginRight: 10}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={[styles.red_text3, {color: '#000000', marginTop: 0, marginLeft: 0}]}>MODERATOR</Text>
              <View style={{flexDirection: 'row', marginTop: 3}}>
                {
                  this.props.speakers.map((speaker, i) =>
                    speaker.image == "Sean-Smith.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={[styles.image_view, {marginLeft: 0}]}/></TouchableOpacity> : null
                  )
                }
              </View>
            </View>
          </View>

          <View style={styles.red_view}>
            <Text style={styles.red_text1}>Summit Closing</Text>
            <Text style={styles.red_text2}>Summit Networking Hub, 10th Floor</Text>
            <Text style={styles.red_text2}>16.50</Text>
          </View>

          <View style={{flexDirection: 'row', marginTop: 20}}>
            {
              this.props.speakers.map((speaker, i) =>
                speaker.image == "John-Croll.jpg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> :
                speaker.image == "Richard-Bagnall.jpeg" ? <TouchableOpacity key={i} onPress={() => Actions.speakers1(speaker)}><Image source={{uri: `${FIREBASE_CONFIG.storageBucket}${speaker.image}`}} style={styles.image_view}/></TouchableOpacity> : null
              )
            }
          </View>

          <View style={[styles.red_view, {height: 78}]}>
            <Text style={styles.red_text1}>Complimentary end of Summit drinks</Text>
            <Text style={styles.red_text2}>17.00 – 18.00</Text>
          </View>

        </ScrollView>
      )
    }

    render() {

        return (
          <View style={styles.container}>
            <View style={styles.navBar}>
              <View style={styles.navBar_view}>
                <TouchableOpacity style={this.state.week_state == 0 ? [styles.nav_touch, {borderBottomLeftRadius: 4, borderTopLeftRadius: 4, backgroundColor: '#ffffff'}] : [styles.nav_touch, {borderBottomLeftRadius: 4, borderTopLeftRadius: 4, borderRightWidth: 1, borderColor: '#ffffff'}]} onPress={() => this.setState({week_state: 0})}>
                  <Text style={this.state.week_state == 0 ? [styles.nav_text, {color: '#e10333', fontWeight: 'bold'}] : styles.nav_text}>Tuesday</Text>
                </TouchableOpacity>
                <TouchableOpacity style={this.state.week_state == 1 ? [styles.nav_touch, {backgroundColor: '#ffffff'}] : styles.nav_touch} onPress={() => this.setState({week_state: 1})}>
                  <Text style={this.state.week_state == 1 ? [styles.nav_text, {color: '#e10333', fontWeight: 'bold'}] : styles.nav_text}>Wednesday</Text>
                </TouchableOpacity>
                <TouchableOpacity style={this.state.week_state == 2 ? [styles.nav_touch, {borderBottomRightRadius: 4, borderTopRightRadius: 4, backgroundColor: '#ffffff'}] : [styles.nav_touch, {borderBottomRightRadius: 4, borderTopRightRadius: 4, borderLeftWidth: 1, borderColor: '#ffffff'}]} onPress={() => this.setState({week_state: 2})}>
                  <Text style={this.state.week_state == 2 ? [styles.nav_text, {color: '#e10333', fontWeight: 'bold'}] : styles.nav_text}>Thursday</Text>
                </TouchableOpacity>
              </View>
            </View>

            {
              this.state.week_state == 1 ? this.WednesdayView()
              : this.state.week_state == 0 ? this.TuesdayView()
              : this.ThursdayView()
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

  red_view: {
    width: width, height: 97, backgroundColor: '#d8d8d8', justifyContent: 'center', marginTop: 20
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
  image_view: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  line_view: {
    width: width, height: 1, backgroundColor: '#d8d8d8', marginTop: 20
  }
});

const mapStateToProps = (state) => {
    const props = {
      agenda: state.agenda.agenda,
      speakers: state.speakers.speakers
    };
    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Agenda)
