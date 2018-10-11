import PropTypes from 'prop-types'
import React     from 'react'
import { Animated, Easing, View, StyleSheet, Text } from 'react-native'
import Meteor, {withTracker} from 'react-native-meteor'
import isLoading from '/modules/base/isLoading'

@withTracker(() => {
  const user = Meteor.user()
  return {
    isLoading: isLoading.get('value') || false,
    zyms: user && user.zyms || 0,
  }
})
export default class Banner extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    zyms:      PropTypes.number.isRequired,
  }
  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
  }
  componentDidUpdate(prevProps) {
    if(this.props.isLoading !== prevProps.isLoading) {
      if(this.props.isLoading) {
        this.oneRotationRound()
      }
    }
  }
  render() {
    const { isLoading, zyms } = this.props
    const percent = Math.min(100, zyms / 500 * 100)
    const gaugeSize = percent + "%"
    const backgroundColor = zyms <= 50 ? '#ED1C24' : '#FFD900'
    const interpolateRotation = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    })
    const animatedStyle = {
      transform: [
        { rotate: interpolateRotation }
      ]
    }
    return (
      <View style={styles.banner}>
        <Animated.Image source={require('./logo_zym_small.png')} style={ [styles.imgZym, animatedStyle] } resizeMode="contain"/>
        <Text style={styles.textZyms}>{zyms}</Text>
        <View style={ styles.barOut}>
          <View style={{width:gaugeSize, height:"100%", borderRadius: 6, backgroundColor, justifyContent:"center"}}>
          </View>
        </View>
      </View>
    )
  }
  oneRotationRound = () => {
    this.animatedValue.setValue(0)
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear
    }).start(() => {
      if(this.props.isLoading) {
        this.oneRotationRound()
      }
    })
  }
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    width:"100%",
  },
  barOut:{
    flex: 9,
    height: 25,
    justifyContent:"center",
    borderRadius: 12,
    borderWidth:3,
    borderColor:"#FFD900",
    padding:3
  },
  imgZym:{
    flex: 1,
    width: '100%',
  },
  textZyms: {
    color: 'white',
    padding: '2%',
  }
})
