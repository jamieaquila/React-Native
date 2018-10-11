import React from 'react';
import { Text } from 'react-native';


import { timeAgo } from '../../../helpers/'

class TimeSince extends React.Component {

  render () {

    return (
      <Text
        style={this.props.style}>
        {timeAgo(this.props.date)}
      </Text>
    );
  }

}

export default TimeSince;
