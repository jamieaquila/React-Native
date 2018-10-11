import React       from 'react'
import { ImageBackground, StyleSheet, Image, TouchableOpacity, Text, TextInput, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RNS3 }        from 'react-native-aws3'
import Config          from 'react-native-config'
import ImagePicker     from 'react-native-image-crop-picker'
import Meteor, {withTracker} from 'react-native-meteor'
import ResponsiveImage from 'react-native-responsive-image'
import { withRouter }  from 'react-router-native'
import uuidv4          from 'uuid/v4'
import { moderateScale } from 'modules/scaling/scaling'
import getPhotoUrl       from '../getPhotoUrl'
import StatusBar        from 'modules/base/StatusBar';

const { accessKey, bucket, keyPrefix, region, secretKey } = JSON.parse(Config.AWS_PHOTOS)
const imagePickerOptions = {
  width: 768,
  height: 768,
  cropping: true,
  includeBase64: true,
}
const awsConfig = {
  awsUrl: 's3-eu-west-1.amazonaws.com',
  bucket,
  keyPrefix,
  region,
  accessKey,
  secretKey,
}
@withRouter
@withTracker((props) => ({ ...props, user: Meteor.user() }))
export default class OwnProfile extends React.Component {
  constructor(props) {
    super(props)
    const { user } = props
    this.state = {
      changeImage: false,
      photo: {
        path: getPhotoUrl(user)
      },
    }
  }
  render() {
    const { changeImage, photo, usernameSaved } = this.state
    const { user } = this.props
    if(!user) return null
    const image = photo.path ? {uri: photo.path} : require('./icon_photo.png')
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <ImageBackground source={require('./blue_radient_background.png')}  style={styles.backgroundImage} style={{ flex: 1, width: '100%'}} resizeMode="cover">
          <KeyboardAwareScrollView>
            <Text style={styles.welcome}>welcome to</Text>
            <View style={styles.logo}>
              <ResponsiveImage source={require('./logo_enzym_white.png')} initWidth="250" initHeight="80"/>
            </View>
            <TouchableOpacity onPress={() => this.setState({changeImage: !changeImage})}>
              <Image source={image} resizeMode="contain" style={{alignSelf:'center', width: 150, height: 150, borderRadius: 500}}/>
            </TouchableOpacity>
            {(!photo.path || changeImage) &&
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity style={styles.button} onPress={this.openCamera}>
                  <Text style={styles.buttonText}>Appareil photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.openPicker}>
                  <Text style={styles.buttonText}>Galerie</Text>
                </TouchableOpacity>
              </View>
            }
            <Text style={styles.text}>Nickname</Text>
            <TextInput
              defaultValue={user.username}
              style={styles.input}
              onChangeText={this.updateField('username')}
              placeholder="Pseudo"
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid="white"
              placeholderTextColor="white"
            />
            <Text style={styles.text}>Description</Text>
            <TextInput
              defaultValue={user.profile.description}
              style={styles.input}
              maxLength={30}
              onChangeText={this.updateField('description')}
              placeholder="CEO at My Company, muffin lover for life"
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid="white"
              placeholderTextColor="white"
            />
            {usernameSaved && <Text style={styles.info}>saved</Text>}
          </KeyboardAwareScrollView>
          <TouchableOpacity style={styles.buttonDone} onPress={this.save}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    )
  }
  openCamera = () => {
    ImagePicker.openCamera(imagePickerOptions).then(this.saveImage)
  }
  openPicker = () => {
    ImagePicker.openPicker(imagePickerOptions).then(this.saveImage)
  }
  saveImage = async (image) => {
    console.log("image", Object.keys(image))
    this.setState({photo: image, photoSaved: false, changeImage: false})
    const storageId = uuidv4()
    const file = {
      uri:  image.path,
      type: image.mime,
      name: `${storageId}.jpg`,
    }
    await RNS3.put(file, awsConfig).progress((e) => this.setState({photoSaving: e.percent}))
      .then((response) => {
        if (response.status !== 201)
          throw new Error("Failed to upload image to S3")
        console.log(response.body)
        const {etag} = response.body.postResponse
        if(response.body.postResponse.key) {
          this.updateField('photo')({
            etag, storageId, path: file.uri,
          })
        }
      })
  }
  updateField = fieldName => value => this.setState({[fieldName]: value})
  save = () => {
    const { description, photo, username } = this.state
    const modifier = {}
    if(username && username !== this.props.user.username) modifier.username = username
    if(description && description !== this.props.user.profile.description) {
      modifier['profile.description'] = description
    }
    if(photo.etag && photo.storageId) {
      modifier['profile.photo'] = {etag: photo.etag, storageId: photo.storageId}
    }
    console.log("save", modifier)
    Meteor.collection('users').update(
      this.props.user._id,
      {$set: modifier},
      (err, res) => {
        err && console.log(err)
        this.props.history.push('/')
      }
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  welcome:{
    marginTop: '8%',
    fontFamily: 'Quicksand-Bold',
    fontSize: moderateScale(18, 0.5),
    textAlign: 'center',
    color: 'white',
    marginBottom: '2%'
  },
  logo:{
    alignSelf:'center',
  },
  text:{
    fontFamily: 'Quicksand-Bold',
    fontSize: moderateScale(18, 0.5),
    textAlign: 'center',
    color: 'white',
    marginBottom: '3%'
  },
  info:{
    fontFamily: 'Quicksand-Bold',
    fontSize: moderateScale(14, 0.5),
    textAlign: 'center',
    color: 'white',
    marginBottom: '1%'
  },
  input: {
    alignItems: 'center',
    alignSelf:'center',
    fontSize: 16,
    height: 40,
    color: 'white',
    width: '60%',
    borderColor: 'red'
  },
  button: {
    flex: 1,
    marginHorizontal: '2%',
    marginBottom: '4%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    alignSelf:'center',
    borderRadius: 10,
    paddingVertical : '5%',
    paddingHorizontal : '2%',
    marginTop: '5%',
  },
  buttonDone: {

    marginBottom: '4%',
    marginTop: '2%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    alignSelf:'center',
    borderRadius: 10,
    paddingVertical : '5%',
    paddingHorizontal : '5%',
  },
  buttonText: {
    color: '#69dcc7',
    fontSize: moderateScale(16, 0.5),
    justifyContent: 'center',
    fontFamily: 'Quicksand-Bold',
  },
})
