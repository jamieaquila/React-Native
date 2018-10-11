import React from 'react'
import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'

const openDrawer = () => {
  NavigationActions.refresh({
    key: 'drawer',
    open: true
  })
}

export default {
  backButton () {
    return (
      <TouchableOpacity onPress={NavigationActions.pop}>
        <Icon name="angle-right" size={30} color={'#ffffff'} style={{marginLeft: 8.5}} />
      </TouchableOpacity>
    )
  }
}
var styles = StyleSheet.create({
  navButtonLeft: {
    marginLeft: 4,
    backgroundColor: 'rgba(0,0,0,0)',
    width: 25,
    height: 25
  }
})
