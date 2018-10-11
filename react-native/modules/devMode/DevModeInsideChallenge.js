import React        from 'react'
import InsideVenue from '/modules/insideVenue/InsideVenue'


export default class DevModeMOutsideChallenge extends React.Component {
  render() {
    return (
      <InsideVenue mock={true} />
    )
  }
}
