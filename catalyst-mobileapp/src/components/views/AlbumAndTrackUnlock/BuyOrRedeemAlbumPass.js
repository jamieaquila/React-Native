import React from 'react';
import { View, Text, Image, Dimensions, Linking, TouchableOpacity, StyleSheet, InteractionManager, Animated, Easing, NativeModules, Platform, Alert } from 'react-native';
import { connect } from 'react-redux';

import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import InAppBilling from 'react-native-billing';
import { InAppUtils } from 'NativeModules';
import { LogInOrSignUp } from '../../views';
import { Pop } from '../../atoms';
import Auth from '../../views/RedeemCode/Auth';
import Camera from '../../views/RedeemCode/Camera';

import { pop as popModal } from '../../../actions/ModalActions';
import { purchase, purchaseTrack, modalDismissed, setAlbumToRedeem, setTrackToRedeem } from '../../../actions/RedemptionCodeActions';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class BuyOrRedeemAlbumPass extends React.Component {

  lockIconTopVal = new Animated.Value(16);
  albumOverlayOpacityVal = new Animated.Value(0.8);
  lockIconAnimationSequence = Animated.sequence([
    Animated.parallel([
      Animated.timing(this.lockIconTopVal, {
        toValue: 8,
        duration: 500,
        easing: Easing.bezier(0.645, 0.045, 0.355, 1),
        delay: 200
      }),
      Animated.timing(this.albumOverlayOpacityVal, {
        toValue: 0,
        duration: 500,
        easing: Easing.bezier(0.645, 0.045, 0.355, 1),
        delay: 200
      }),
    ]),
    Animated.parallel([
      Animated.timing(this.lockIconTopVal, {
        toValue: 16,
        duration: 500,
        easing: Easing.bezier(0.645, 0.045, 0.355, 1),
        delay: 1500
      }),
      Animated.timing(this.albumOverlayOpacityVal, {
        toValue: 0.8,
        duration: 500,
        easing: Easing.bezier(0.645, 0.045, 0.355, 1),
        delay: 1500
      }),
    ])
  ]);

  state = {
    releaseCountdown: ''
  }

  componentWillMount() {
    const { dispatch, album, track, user, modalNavigator } = this.props;

    dispatch(setAlbumToRedeem(album));
    this.willPurchaseTrack = false;
    if (track) {
      dispatch(setTrackToRedeem(track));
      this.willPurchaseTrack = true;
    }

    if (!user.currentUser) setTimeout(() => modalNavigator.push({ component: Auth, passProps: { album, modalNavigator }, authRoute: true }), 0); // makes the pushanimation run

    this.modalNavigatorListener = modalNavigator.navigationContext.addListener('didfocus', (e) => {
      if (e.target.currentRoute.component.displayName === 'Connect(AlbumAndTrackUnlock)' && this.props.user.currentUser === null) modalNavigator.pop();
    });
  }

  componentDidMount() {
    const { album, user, modalNavigator } = this.props;
    this.getCountDownVal();
    this.countDownValTimer = setInterval(this.getCountDownVal.bind(this), 1000);

    InteractionManager.runAfterInteractions(() => this.lockIconAnimationSequence.start());
  }

  componentWillUnmount() {
    clearTimeout(this.countDownValTimer);
    this.modalNavigatorListener.remove();
  }

  getCountDownVal() {
    const { album } = this.props;

    this.setState({ releaseCountdown: new Date(album.releaseDate) > Date.now() ? moment(album.releaseDate).fromNow() : 'now' });
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;

    if (nextProps.shouldDismissModal) {
      this.props.dispatch(pop());
      this.props.dispatch(modalDismissed());
    }
  }

  onPurchase() {
    const { album, dispatch, isPerformingAPIRequest } = this.props;

    if (isPerformingAPIRequest) return false;

    const productId = album.iapProductId;
    if (productId == null || productId.length == 0) {
      Alert.alert("No product identifier available!");
      return false;
    }
    if (Platform.OS == 'ios') {
      var products = [
        productId
      ];
      InAppUtils.loadProducts(products, (error, products) => {
        InAppUtils.purchaseProduct(productId, (error, response) => {
          // NOTE for v3.0: User can cancel the payment which will be availble as error object here.
          console.log('IAP error: ');
          console.log(error);
          console.log('IAP response: ');
          console.log(response);
          if(response && response.productIdentifier) {
            dispatch(purchase());
          }
        });
      });
    } else {
      InAppBilling.open()
      .then(() => InAppBilling.purchase(productId))
      .then((details) => {
        console.log("You purchased: ", details);
        dispatch(purchase());
        return InAppBilling.close();
      })
      .catch((err) => {
        console.log(err);
        return InAppBilling.close();
      });
    }

  }

  onPurchaseTrack() {
    const { track, dispatch, isPerformingAPIRequest } = this.props;

    if (isPerformingAPIRequest) return false;

    const productId = track.iapProductId;
    if (productId == null || productId.length == 0) {
      Alert.alert("No product identifier available!");
      return false;
    }
    if (Platform.OS == 'ios') {
      var products = [
        productId
      ];
      InAppUtils.loadProducts(products, (error, products) => {
        InAppUtils.purchaseProduct(productId, (error, response) => {
          // NOTE for v3.0: User can cancel the payment which will be availble as error object here.
          console.log('IAP error: ');
          console.log(error);
          console.log('IAP response: ');
          console.log(response);
          if(response && response.productIdentifier) {
            dispatch(purchaseTrack());
          }
        });
      });
    } else {
      InAppBilling.open()
      .then(() => InAppBilling.purchase(productId))
      .then((details) => {
        console.log("You purchased: ", details);
        dispatch(purchaseTrack());
        return InAppBilling.close();
      })
      .catch((err) => {
        console.log(err);
        return InAppBilling.close();
      });
    }
  }

  render() {
    const { app, dispatch, album, user } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <Image
          blurRadius={80}
          style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, }}
          source={{ uri: album.imageUrl }}
        />
        <LinearGradient
          style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, }}
          colors={[ 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.6)' ]}
        />
        <View style={{ flex: 4, justifyContent: 'center', paddingTop: 48, backgroundColor: 'transparent' }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 20 }}>
            <Image
              style={{ width: 72, height: 72, borderRadius: 36 }}
              source={ user.currentUser ? { uri: user.currentUser.profileImageUrl } : require('./defaultProfileImage.png')}
            />
            <View style={{ top: -24, alignItems: 'center', marginHorizontal: 32 }}>
              <Animated.Image style={{ top: this.lockIconTopVal, tintColor: 'white' }} source={require('./lockTopHalf.png')} />
              <Image style={{ tintColor: 'white' }} source={require('./lockBottomHalf.png')} />
            </View>
            <View>
              <Image
                style={{ overflow: 'visible', width: 70, height: 70 }}
                source={{ uri: album.imageUrl }}
              />
              <Animated.View style={{ opacity: this.albumOverlayOpacityVal, position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: 'black' }} />
            </View>
          </View>
          <View style={{ marginBottom: 4, alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: '700', letterSpacing: -1.2, color: 'white' }}>Unlock this Album!</Text>
          </View>
          <View style={{ marginHorizontal: 16 }}>
            { Date.parse(album.releaseDate) > Date.now() &&
              <Text style={styles.bodyCopy}>
                Use your Album Pass to unlock this album. You’ll get a few tracks now and access to the full album
                <Text style={[ styles.bodyCopy, { fontWeight: '600', } ]}> {this.state.releaseCountdown}</Text>!
              </Text>
            }
            <Text style={styles.bodyCopy}>
              Once you unlock this album you’ll receive a download link to <Text style={[ styles.bodyCopy, { fontStyle: 'italic' } ]}>{user.currentUser ? user.currentUser.email : 'your email address'}</Text> so you can listen to this album anywhere.
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          {/*<View style={{ flexDirection: 'row' }}>
            { this.willPurchaseTrack ?
              <TouchableOpacity
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 48, marginBottom: 24, marginHorizontal: 8, backgroundColor: 'white', borderRadius: 6 }}
                onPress={() => this.onPurchaseTrack()}
              >
                <Text style={{ fontSize: 18, fontWeight: '600', letterSpacing: -0.5, color: '#111', }}>Purchase Track</Text>
              </TouchableOpacity>
            :
              <TouchableOpacity
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 48, marginBottom: 24, marginHorizontal: 8, backgroundColor: 'white', borderRadius: 6 }}
                onPress={() => this.onPurchase()}
              >
                <Text style={{ fontSize: 18, fontWeight: '600', letterSpacing: -0.5, color: '#111', }}>Purchase Album</Text>
              </TouchableOpacity>
            }
          </View>*/}
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center', height: 48, marginBottom: 24, marginHorizontal: 8, backgroundColor: 'white', borderRadius: 6 }}
            onPress={() => this.props.navigator.push({
              component: Camera, passProps: { album }
            })}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', letterSpacing: -0.5, color: '#111'}}>Redeem Album Pass</Text>
          </TouchableOpacity>
        </View>
        <View style={{ position: 'absolute', top: 0 }}>
          <Pop
            onPress={() => dispatch(popModal())}
            iconType='x'
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bodyCopy: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.32,
    lineHeight: 21,
    textAlign: 'center',
    color: 'white',
    marginBottom: 16
  },
})

const mapStateToProps = state => ({ app: state.app, user: state.user, isPerformingAPIRequest: state.redemptionCode.isPerformingAPIRequest })

module.exports = connect(mapStateToProps)(BuyOrRedeemAlbumPass);
