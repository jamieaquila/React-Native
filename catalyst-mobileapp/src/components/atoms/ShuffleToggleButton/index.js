import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

import { connect } from 'react-redux';

class ShuffleToggleButton extends React.Component {

	render() {
		var { shuffle, app } = this.props

		return (
			<TouchableOpacity style={styles.touchableArea} onPress={this.props.onPress}>
				<Image style={{ tintColor: shuffle ? 'white' : 'rgba(255,255,255,0.4)' }} source={require('./shuffle.png')} />
			</TouchableOpacity>
		)
	}

}

ShuffleToggleButton.propTypes = {
	shuffle: React.PropTypes.bool.isRequired,
	onPress: React.PropTypes.any.isRequired
}

var styles = StyleSheet.create({
	touchableArea: {
		alignItems: 'center',
		padding: 16,
	},
});

const mapStateToProps = state => ({ app: state.app })

export default connect(mapStateToProps)(ShuffleToggleButton)
