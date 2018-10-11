import React                 from 'react'
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native'
import { withRouter }  from 'react-router-native'
import Banner           from './Banner'
import StatusBar        from './StatusBar'
import Menu             from './Menu'
const BLUE_BACKGROUND = require('./blue_radient_background.png')
const PINK_BACKGROUND = require('./pink_radient_background.png')

@withRouter
export default class AppBase extends React.Component {
  state = {menuOpen: false}
  render() {
    const { children, location, user } = this.props
    const { menuOpen } = this.state
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <ImageBackground
          source={locationToBackground(location, !!user.venueId)}
          style={styles.backgroundImage}
          resizeMode="cover">
          <View style={styles.header}>
            <TouchableOpacity style={styles.menuOpenButton} onPress={() => this.setState({menuOpen: true})}>
              <Image source={require('./burger_blanc.png')} style={ styles.imgMenu } resizeMode="contain"/>
            </TouchableOpacity>
            <View style={{flex: 10, marginLeft: '2%',}}>
              <Banner />
            </View>
          </View>
          <View style={styles.main}>
            {children}
          </View>
          <Menu user={user} menuOpen={menuOpen} onClose={() => this.setState({menuOpen: false})} />
        </ImageBackground>
      </View>
    )
  }
}

function locationToBackground(location, insideVenue) {
  console.log(location.pathname)
  if(location.pathname === '/' && !insideVenue) return BLUE_BACKGROUND
  if(location.pathname === '/ownProfile')       return BLUE_BACKGROUND
  if(location.pathname.substr(0, 4) === '/map') return BLUE_BACKGROUND
  return PINK_BACKGROUND
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%'
  },
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  header: {
    flex: 1,
    marginHorizontal: '4%',
    marginBottom: '2%',
    marginTop: '7%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  main:{
    flex: 50,
    overflow: 'hidden'
  },
  menuOpenButton: {
    flex: 1,
  },
  imgMenu:{
    width: '100%',
  },
})
