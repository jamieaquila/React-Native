import React                 from 'react'
import { withRouter }        from 'react-router-native'
import PropositionModal from '/modules/challenge/PropositionModal'

@withRouter
export default class DevModeChallengeProposition extends React.Component {
  render() {
    return (
      <PropositionModal
        challengeId="aoefzieof"
        closeModal={() => this.props.history.replace('/')}
        handleBackButton={() => this.props.history.replace('/')}
        isOpen={true}
        photoStorageId="49928f7d-aaaf-4947-8e29-f4ac47b8ccd3"
        reward={70}
        time={10}
        username="Joe La Fritte"
        userDescription="CEO at My Company, muffin lover for life"
      />
    )
  }
}
