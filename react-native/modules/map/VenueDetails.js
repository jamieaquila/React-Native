import PropTypes    from 'prop-types'
import React        from 'react'
import {ScrollView, View, Image, StyleSheet, Text, TouchableOpacity} from 'react-native'
import { moderateScale } from 'modules/scaling/scaling'

export default class VenuesDetails extends React.Component {
  static propTypes = {
    canEnter:   PropTypes.func.isRequired,
    enterVenue: PropTypes.func.isRequired,
    venue:      PropTypes.object,
  }
  render() {
    const { canEnter, enterVenue, venue } = this.props
    if(!venue) return null
    return (
      <View style={styles.container}>
        <View style={ styles.blockName }>
          <Text style={ styles.title }>{venue.properties.name}</Text>
          <Text style={ styles.subTitle }>{''}</Text>
        </View>
        <View style={{ flex: 7 }}>
          <ScrollView style={styles.usersList}>
            {venue.properties.users.map(user => (
              <Text style={styles.user} key={user.username}>{user.username}</Text>
            ))}
            {venue.properties.users.length ?
              null
              : <Text style={styles.user}>{'There is no player inside this venue at the moment. Be the first one!'}</Text> }

          </ScrollView>
        </View>
        {!canEnter(venue.geometry.coordinates) &&
          <View style={{ flex: 2, paddingVertical: '4%', }}>
            <Image source={require('./img/icone_cadena.png')} style={ styles.imgZym } resizeMode="contain"/>
            <Text style={styles.closerText}>{'Come closer !'}</Text>
          </View>
        }
        {canEnter(venue.geometry.coordinates) &&
          <TouchableOpacity style={styles.enter} onPress={enterVenue(venue)}>
            <Image source={require('./img/icone_porte.png')} style={ styles.imgZym } resizeMode="contain"/>
          </TouchableOpacity>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '70%',
    backgroundColor: 'white',
    flex: 1,
    overflow: 'hidden'
  },
  blockName:{
    flex: 1,
    borderColor: '#69DCC7',
    borderStyle:'dashed',
    borderBottomWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title:{
    textAlign: 'center',
    color: '#E63B97',
    fontFamily: 'Quicksand-Bold',
    fontSize: moderateScale(18, 0.4),
  },
  subTitle:{
    textAlign: 'center',
    color: '#E63B97',
    fontFamily: 'Quicksand-Bold',
    fontSize: moderateScale(12, 0.4),
  },
  usersList: {
    paddingHorizontal: '5%',
    paddingVertical: '5%',
  },
  user: {
    color: '#69DCC7',
    paddingBottom: '2%',
    fontFamily: 'Quicksand-Bold',
    fontSize: moderateScale(14, 0.4),
  },
  closerText: {
    color: '#69DCC7',
    paddingBottom: '2%',
    fontFamily: 'Quicksand-Bold',
    fontSize: moderateScale(14, 0.4),
    textAlign: 'center'
  },
  enter:{
    flex: 2,
    alignItems: 'center',
    borderTopWidth: 2,
    borderColor: '#69DCC7',
    paddingVertical: '2%',
  },
  imgZym: {
    width: '100%',
    height: '100%'
  }
})
