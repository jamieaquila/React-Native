import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  TextInput 
} from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';

import { connect } from 'react-redux';

import { push as pushModal } from '../../../actions/ModalActions';

import { MessageThreadComposer } from '../../views'

import { UserInfo } from '../../molecules';

var deviceWidth = Dimensions.get('window').width;

var NavigationBar = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    onBackPress: React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      showBackButton: true,
      showUserInfo: true,
      showSettingsGear: false,
    }
  },

  onBackPress: function() {
    if (this.props.onBackPress) this.props.onBackPress();
    else this.props.navigator.jumpBack();
  }, 

  render: function() {
    var { user, onPressSettings, showUserInfo, txt, showSettingsGear, title, showMessageButton, auth, app } = this.props;

    return (
      <View style={[styles.navbarContainer, this.props.style]}>
        <View style={styles.navbarInnerContainer}>
          <View style={styles.leftActionButtonContainer}>
            {this.props.showBackButton && <TouchableOpacity
              style={styles.backButtonContainer}
              onPress={() => this.onBackPress()}
            >
              <Image style={{ tintColor: 'white' }} source={require('./chevron.png')} />
            </TouchableOpacity>}           
          </View>
          <View style={styles.titleContainer}>
          {
            this.props.editable ?
            <TextInput 
              style={[styles.title, {color: this.props.titleColor ? this.props.titleColor : 'white', width:'100%', height:35, textAlign:'center'}]}
              underlineColorAndroid={'transparent'}
              onChangeText={(text) => {
                this.props.onChangeText(text)
              }}
              value={this.props.title}
              />    
            :
            <Text numberOfLines={1} style={[styles.title, {color: this.props.titleColor ? this.props.titleColor : 'white'}]}>{(title) ? title.toUpperCase() : ''}</Text>
          }
            
          </View>
          {
            this.props.hideRight ?
              <View style={styles.rightActionButtonContainer} />
            : txt ?
              <View style={styles.rightActionButtonContainer}>
                <TouchableOpacity
                  style={{ paddingRight: 16 }}
                  onPress={() => {
                    this.props.onRightBtnPress()
                  }}>
                  <Text style={{color:'#fff', fontSize:14}}>{txt}</Text>
                </TouchableOpacity>
              </View>
            :
              <View style={styles.rightActionButtonContainer}>

                {user.currentUser && showUserInfo && <UserInfo user={user} />}
                {showSettingsGear && <TouchableOpacity
                  style={{ paddingRight: 16 }}
                  onPress={onPressSettings}>
                  <Image style={styles.settingsIcon} source={require('./settings.png')} />
                </TouchableOpacity>}
              </View>              
          }
          
        </View>
        <View style={styles.navBarBorderBottom} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  navbarContainer: {
    paddingTop: 20,
    backgroundColor: 'black',
    height: 64,
  },
  navBarBorderBottom: {
    position: 'absolute',
    bottom: -0.5,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  navbarInnerContainer: {
    flex: 1,
    flexDirection:'row',
  },
  leftActionButtonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 2.0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.1,
  },
  rightActionButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backButtonContainer: {
    width: 48,
    padding: 8,
    paddingLeft: 5 + 16,
  },
  settingsIcon: {
    opacity: 0.64,
  },
});

var mapStateToProps = state => ({ user: state.user, auth: state.auth, app: state.app });

export default connect(mapStateToProps)(NavigationBar);