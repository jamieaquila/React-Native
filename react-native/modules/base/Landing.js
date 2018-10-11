import React     from 'react'
import { StyleSheet, Text, View, Image }  from 'react-native'
import { scale, moderateScale, verticalScale} from 'modules/scaling/scaling';
import ResponsiveImage from 'react-native-responsive-image';

export default function Landing() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>A real-world{'\n'}mobile game</Text>
      </View>
      <Image source={require('./top-wave.png')} style={{ flex: 1, width: '100%'}} resizeMode="stretch"/>
      <View style={styles.main}>
        <ResponsiveImage source={require('./logo_enzym_white.png')} initWidth="370" initHeight="120"/>
      </View>
      <Image source={require('./bottom-wave.png')} style={{ flex: 1, width: '100%'}} resizeMode="stretch"/>
      <View style={styles.footer}>
        <Text style={styles.title}>Favoring human{'\n'}interactions</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  header: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD900'
  },
  main:{
    flex: 2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#69DCC7'
  },
  footer:{
    width: '100%',
    backgroundColor: '#E63B97',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    fontSize: moderateScale(30, 0.4),
  }

})
