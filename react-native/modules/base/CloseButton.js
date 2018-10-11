import React                 from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {withRouter} from 'react-router-native'
import { moderateScale } from 'modules/scaling/scaling'


export default withRouter(CloseButton)
function CloseButton({history, onPress, color}) {
  onPress = onPress || function() { history.goBack() }
  return (
    <TouchableOpacity style={styles.closeButton} onPress={onPress}>
      <Text style={{ color: color, fontFamily: 'Quicksand-Bold', fontSize: moderateScale(30, 0.4),}}>X</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  closeButton: {
    paddingHorizontal: '5%',
  },

})

CloseButton.defaultProps = {
  color: '#ddd'
}
