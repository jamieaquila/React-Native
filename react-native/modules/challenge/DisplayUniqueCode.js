import PropTypes from 'prop-types'
import React     from 'react'
import { StyleSheet, View } from 'react-native'
import QRCode    from 'react-native-qrcode-svg'
import Meteor, {withTracker} from 'react-native-meteor'
import { withRouter } from 'react-router-native'
import CloseButton from '/modules/base/CloseButton'
import logo        from '/utils/logo.png'

@withTracker(() => {
  Meteor.subscribe('challenges.started')
  const startedChallenge = Meteor.collection('challenges').findOne()
  return {
    startedChallenge,
  }
})
@withRouter
export default class DisplayUniqueCode extends React.Component {
  static propTypes = {
    history:          PropTypes.object.isRequired,
    startedChallenge: PropTypes.object,
  }
  componentDidUpdate(previousProps) {
    if(!this.props.startedChallenge && previousProps.startedChallenge) {
      this.props.history.goBack()
    }
  }
  render() {
    const { startedChallenge } = this.props
    const validationCode = startedChallenge && startedChallenge.validationCode
    return (
      <View style={styles.container}>
        <CloseButton />
        <View style={styles.qrCode}>
          <QRCode
            value={validationCode}
            logo={logo}
            size={250}
            ecl="H"
            logoSize={90}
            logoBackgroundColor='transparent'
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  qrCode: {
    margin: 30,
    padding: 30,
    backgroundColor: 'white',
    alignItems: 'center',
  }
})
