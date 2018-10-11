import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import { connect } from 'react-redux';

import { colors } from '../../../config';

class RepeatModeButton extends React.Component {

	static propTypes = {
		currentRepeatMode: React.PropTypes.string.isRequired,
		onPress: React.PropTypes.any.isRequired
	};

	render() {
		var { currentRepeatMode, app } = this.props

		switch(currentRepeatMode) {
			case 'none': 
				var image = require('./repeat.png');
				var style = {tintColor: 'rgba(255,255,255,.4)'};
			break;
			case 'all':
				var image = require('./repeat.png');
				var style = {tintColor: 'white'};
			break;
			case 'one':
				var image = require('./repeat.png');
				var style = {tintColor: 'white'};
				var oneBadge = true;
			break;
		}

		return (
			<TouchableOpacity style={styles.touchableArea} onPress={this.props.onPress}>
				<Image style={style} source={image} />
				{ oneBadge &&
					<View style={[styles.repeatOneCircleContainer, {backgroundColor: colors.grayDarkest} ]}>
						<View style={styles.repeatOneCircle}>
							<Text style={styles.repeatOneText}>1</Text>
						</View>
					</View>
				}
			</TouchableOpacity>
		)
	}
}

var styles = StyleSheet.create({
	touchableArea: {
		alignItems: 'center',
		padding: 16,
	},
	repeatOneCircleContainer: {
		position: 'absolute',
		top: 12,
		right: 25,
		padding: 2,
		borderRadius: 20,
	},
	repeatOneCircle: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 8,
		height: 8,
		backgroundColor: 'white',
		borderRadius: 5,
	},
	repeatOneText: {
		fontSize: 7,
		fontWeight: '800',
		backgroundColor: 'transparent',
	},
});

const mapStateToProps = state => ({ app: state.app })

export default connect(mapStateToProps)(RepeatModeButton)
