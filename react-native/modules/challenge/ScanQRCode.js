import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import Meteor from 'react-native-meteor'
import { withRouter } from 'react-router-native'
import CloseButton from '/modules/base/CloseButton'

@withRouter
export default class ScanQRCode extends React.Component {
  render() {
    return (
      <View style={{flex: 1, position: 'relative'}}>
        <QRCodeScanner
          onRead={this.onSuccess.bind(this)}

          cameraStyle={styles.cameraStyle}
          cameraType="back"
        />
      <View style={{position: 'absolute', top: 0, left: 0}}>
        <CloseButton />
      </View>
      </View>
    )
  }
  onSuccess(e) {
    Meteor.call('challenges.validate', {code: e.data}, (err) => {
      if(err) {
        console.log(err)
      } else {
        //Alert.alert(e.data)
      }
      this.props.history.goBack()
    })
  }
}

const styles = StyleSheet.create({
  cameraStyle: {
    height: '90%',
    width: '90%',
    marginHorizontal: '5%',
    marginVertical: '5%',
  },
})
