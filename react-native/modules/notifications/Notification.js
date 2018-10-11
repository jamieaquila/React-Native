import React from 'react'
import {StyleSheet, Image, View, Text, TouchableOpacity} from 'react-native'
import { moderateScale } from '/modules/scaling/scaling'

export default function Notification() {
  return (
    <View style={ styles.block }>
      <View style={ styles.blockImg }>
        <Image source={require('./img/logo_zym_small.png')} style={ styles.imgZym } resizeMode="contain"/>
      </View>
      <View style={ styles.blockText }>
        <Text style={ styles.text }>{'Ceci est un test'}</Text>
      </View>
      <TouchableOpacity style={ styles.blockClose}>
        <Text style={ styles.close }>{'x'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  block: {
    position: 'absolute',
    marginHorizontal: '2%',
    paddingHorizontal: '1%',
    backgroundColor: '#FFD900',
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999
  },
  text:{
    color: '#E63B97',
    fontFamily: 'Quicksand-Bold',
    fontSize: moderateScale(14, 0.4),
  },
  blockText:{
    flex: 6,
  },
  blockImg:{
    flex: 1,
    alignItems: 'center',
    paddingVertical: '5%'
  },
  blockClose: {
    flex: 1
  },
  close: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Quicksand-Bold',
    fontSize: moderateScale(24, 0.4),
  },
  imgZym:{
    flex: 1,
    width: '100%',
    height: '100%'
  },
})
