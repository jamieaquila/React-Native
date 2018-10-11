import React        from 'react'
import MainMap from '/modules/map/MainMap'

const noop = () => {}

export default class DevModeMInsideChallenge extends React.Component {
  render() {
    return (
      <MainMap
        mock={true}
        enterVenue={noop}
        fakeMode={false}
        setFakeMode={noop}
        setFakeLocation={noop}
        getVisibleVenues={noop}
        hideVenues={noop}
        challengeDestination={{coordinates: [4.8351, 45.7578]}}
        location={[4.7351, 45.8578]}
        cities={[]}
        countries={[]}
      />
    )
  }
}
