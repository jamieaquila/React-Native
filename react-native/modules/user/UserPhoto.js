import React from 'react'
import {Image, View} from 'react-native'
import getPhotoUrl from './getPhotoUrl'

export default function UserPhoto({ radius, user }) {
  const imageUri = getPhotoUrl(user)
  return (
    <View style={{flex:1}}>
      <Image
        source={{uri: imageUri}}
        style={{width: '100%', flex: 1, borderRadius: 2000}}
        resizeMode="contain"
      />
    </View>
  )
}

UserPhoto.defaultProps = {
  radius: 40
}
