import React from 'react';

import AuthNavigator from './AuthNavigator'

import { connect } from 'react-redux';

import Platform from 'Platform';

import { app, api } from '../config';

class Messages extends React.Component {

 componentDidMount() {

 }


  render() {
	return <AuthNavigator />;
  }

}

export default connect()(Messages);