import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Dimensions, Image } from 'react-native'
import Meteor from 'react-native-meteor'
import oauthLogin from '../oauthLogin'
import ResponsiveImage from 'react-native-responsive-image';
import { scale, moderateScale, verticalScale} from 'modules/scaling/scaling';
import StatusBar        from 'modules/base/StatusBar';

const { width } = Dimensions.get('window')

export default class SignIn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      code: '',
      submitted: false,
      waitingCode: false,
      error: null,
    }
  }
  render() {
    const { submitted, waitingCode} = this.state
    if(submitted) {
      return (
        <View></View>
      )
    }
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Connection</Text>
          <Text>{this.state.error}</Text>
        </View>
        {!waitingCode &&
          <View style={styles.main}>
            <ScrollView style={styles.inner}>
              <View style={styles.columnInput}>
                <ResponsiveImage style={styles.pictoInput} source={require('./icon_mail.png')} initWidth="80" initHeight="50"/>
                <TextInput
                  style={styles.input}
                  onChangeText={(email) => this.setState({ email: `${email}` })}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <View style={styles.social}>
                <TouchableOpacity style={styles.buttonLogin} onPress={this.oauthLoginAndSave('facebook')}>
                  <ResponsiveImage source={require('./sign_facebook.png')} initWidth="275" initHeight="55"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonLogin} onPress={this.oauthLoginAndSave('google')}>
                  <ResponsiveImage source={require('./sign_google.png')} initWidth="275" initHeight="55"/>
                </TouchableOpacity>
                {/*<TouchableOpacity style={styles.buttonLogin} onPress={this.oauthLoginAndSave('twitter')}>
                  <ResponsiveImage source={require('./sign_twitter.png')} initWidth="275" initHeight="55"/>
                </TouchableOpacity>*/}

                <TouchableOpacity style={styles.buttonStart} onPress={this.onSignIn}>
                  <Text style={styles.buttonText}>START !</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        ||
          <View style={styles.main}>
            <Text style={styles.info}>{`We just sent you an e-mail containing a 6 digits code.\nPlease write it down here:`}</Text>
            <View style={styles.columnInput}>
              <ResponsiveImage style={styles.pictoInput} source={require('./icon_mail.png')} initWidth="80" initHeight="50"/>
              <TextInput
                style={styles.input}
                onChangeText={(code) => this.setState({code})}
                placeholder="Code"
                autoCapitalize="none"
                keyboardType="numeric"
                autoCorrect={false}
                autoFocus={true}
              />
            </View>
            <TouchableOpacity style={styles.buttonStart} onPress={this.sendCode}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        }
        <View style={styles.footer}>
          <ResponsiveImage source={require('./logo_enzym_white.png')} initWidth="200" initHeight="65"/>
        </View>
      </View>
    )
  }
  isValid() {
    const { email } = this.state
    let valid = true
    if(email.length === 0) {
      this.setState({ error: 'You must enter an email address' })
      valid = false
    }
    return valid
  }
  oauthLoginAndSave = (provider) => async () => {
    const {user, credentials} = await oauthLogin(provider) || {}
    if(user && credentials) {
      Meteor._login({credentials, provider, user}, (err) => {
        err && console.warn(err)
      })
      this.setState({submitted: true})
    }
  }
  onSignIn = () => {
    const { email } = this.state
    if(this.isValid()) {
      console.log("test")
      Meteor.call('accounts-passwordless.sendVerificationCode', email, {}, {}, (err) => {
        err && console.warn(err)
      })
      this.setState({waitingCode: true})
    }
  }
  sendCode = () => {
    const {code} = this.state
    Meteor._login({code}, (err) => {
      err && console.warn(err)
    })
    this.setState({submitted: true})
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffd900',
    height: '100%'
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main:{
    marginHorizontal: '5%',
    backgroundColor: 'white',
    borderRadius: 10,
    flex: 6,
    paddingHorizontal: '2%',
    paddingVertical: '3%',
  },
  footer:{
    height:'20%',
    paddingTop: '4%',
    flex: 1,
  },
  mainTitle: {
    fontFamily: 'Quicksand-Bold',
    color: 'white',
    fontSize: moderateScale(35, 0.4),
    marginVertical: '10%'
  },
  columnInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3%'
  },
  input: {
    fontSize: 16,
    height: 40,
    color: '#69dcc7',
    width: '80%',
  },
  pictoInput: {
    width: '15%',
    height: 50,
    marginRight:'1%'
  },
  buttonLogin: {
    marginVertical: '2%',
    alignItems: 'center'
  },
  buttonStart: {
    alignItems: 'center',
    backgroundColor: '#69dcc7',
    alignSelf:'center',
    borderRadius: 10,
    paddingVertical : '5%',
    paddingHorizontal : '20%',
    marginTop: '7%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
  },
  info:{
    fontSize: moderateScale(15, 0.5),
    textAlign: 'center',
    marginBottom: '5%'
  }
})
