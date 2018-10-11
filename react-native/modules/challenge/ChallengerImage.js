import React from 'react'
import {Image, View} from 'react-native'

export default function ChallengerImage({ radius }) {

  return (
    <View>
      <Image
        source={require('./img/profil.png')}
        style={{width: radius * 2, height: radius * 2, borderRadius: radius}}
      />
    </View>
  )
}

ChallengerImage.defaultProps = {
  radius: 60,
}
