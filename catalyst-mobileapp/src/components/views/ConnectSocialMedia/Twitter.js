import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';


import { connect } from 'react-redux';

import { Pop } from '../../atoms'

import { ConnectTwitterButton } from '../../molecules'

class Twitter extends React.Component {
  render() {
    const { app } = this.props

    return (
      <View style={styles.container}>
        <Image
          defaultSource={require('./waves.png')}
          source={require('./waves.png')}
          style={styles.backgroundImage}
        />
        <View style={styles.contentContainer}>
          <Image
            defaultSource={require('./twitter.png')}
            source={require('./twitter.png')}
            style={styles.socialIcon}
          />
          <Text style={styles.title}>Connect Twitter</Text>
          <Text style={styles.paragraph}>Connect your Twitter account to interact with {app.name}’s posts. We’ll never post on your behalf.</Text>
        </View>
        <View style={styles.connectButtonsContainer}>
          <ConnectTwitterButton
            showSocialIcon={false}
            textColor='#1da1f2'
            backgroundColor='white'
            text='Connect Twitter'
          />
        </View>
        <View style={{position: 'absolute', top: 16}}>
          <Pop
            iconType='x'
            style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 0 }}
            onPress={() => this.props.navigator.pop()}
          />
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1da1f2',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    tintColor: 'rgba(255,255,255,0.1)',
  },
  contentContainer: {
    flex: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: 'transparent',
  },
  socialIcon: {
    marginBottom: 32,
    tintColor: 'white',
  },
  title: {
    marginBottom: 4,
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
  },
  paragraph: {
    textAlign: 'center',
    lineHeight: 24,
    color: 'white',
  },
  connectButtonsContainer: {
    flex: 2,
    justifyContent: 'center',
    marginLeft: 24,
    marginRight: 24,
  },
})

const mapStateToProps = state => ({ app: state.app })

module.exports = connect(mapStateToProps)(Twitter);
