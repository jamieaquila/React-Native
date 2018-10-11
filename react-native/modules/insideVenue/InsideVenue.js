import PropTypes                from 'prop-types'
import React                    from 'react'
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native'
import Meteor, {ReactiveDict, withTracker} from 'react-native-meteor'
import { withRouter } from 'react-router-native'
import CloseButton       from '/modules/base/CloseButton'
import venuesCache       from '/modules/cache/venues'
import Challenges        from '/modules/challenge/Challenges'
import FindInsideVenue   from '/modules/challenge/FindInsideVenue'
import { moderateScale } from '/modules/scaling/scaling'
import UserPhoto         from '/modules/user/UserPhoto'
import UserList          from './UserList'

const mockUser = {
  profile: {
    description: "CEO at My Company, muffin lover for life",
    photo: {
      storageId: "49928f7d-aaaf-4947-8e29-f4ac47b8ccd3",
    },
  },
  username: "Joe la Fritte",
}
const mockData = {
  ambassadorMode: false,
  isAmbassador: true,
  venue: {
    properties: {
      name: "My Venue"
    },
    venueId: 'fakeVenueId',
  },
  venueId: 'fakeVenueId',
  startedChallenge: { venueId: 'fakeVenueId'},
  myReward: 70,
  otherUser: mockUser,
  users: [mockUser],
}

const permanentState = new ReactiveDict('insideVenueState')
permanentState.set('challengeFullView', true)

@withRouter
@withTracker(({ mock = false, match: {params: {venueId}}, ...props }) => {
  console.log("inside", venueId, mock, permanentState.get('challengeFullView'))
  const me  = Meteor.user()
  if(!me) return {venueId, ...props}
  if(mock) return {me, ...props, ...mockData}
  console.log(me.venueId, venueId)
  if(me.venueId === venueId) {
    Meteor.subscribe('venues.inside')
    Meteor.subscribe('users.insideVenue', venueId)
  }
  Meteor.subscribe('challenges.started')
  Meteor.subscribe('chat.myRooms')
  const startedChallenge = Challenges.findOne()
  const users = Meteor.collection('users').find({venueId, _id: {$ne: me._id}})
    .map((obj) => {
      const room = Meteor.collection('chat_rooms').findOne({
        userIds: {$all: [obj._id, me._id], $size: 2}
      })
      if(!room) return {...obj, roomId: 'new_' + obj._id}
      Meteor.subscribe('chat.messages', room._id)
      const newMessages = Meteor.collection('chat_messages').find(
        {roomId: room._id, acks: {$ne: me._id}, userId: {$ne: me._id}},
        {fields: {roomId: 1}, sort: {createdAt: -1}}
      )
      return { ...obj, newMessages: newMessages.length, roomId: room._id}
    })
  return {
    ...props,
    ambassadorMode: me.ambassadorMode,
    isAmbassador:   me.isAmbassador,
    startedChallenge,
    me,
    myReward: me && startedChallenge && startedChallenge.playerFromUserId(me._id).reward,
    otherUser: startedChallenge && startedChallenge.otherPlayerUser(),
    users,
    venueId,
  }
})
export default class InsideVenue extends React.Component {
  static propTypes = {
    history:          PropTypes.object.isRequired,
    venueId:          PropTypes.string.isRequired,
    ambassadorMode:   PropTypes.bool,
    challengePhoto:   PropTypes.string,
    isAmbassador:     PropTypes.bool,
    me:               PropTypes.object,
    myReward:         PropTypes.number,
    otherUser:        PropTypes.object,
    startedChallenge: PropTypes.object,
    users:            PropTypes.array,
    venue:            PropTypes.object,
  }
  static defaultProps = {
    ambassadorMode: false,
    isAmbassador:   false,
  }
  constructor(props) {
    super(props)
    this.state = { expectedAmbassadorMode: false }
    if(props.venue) {
      this.state.venue = props.venue
    } else {
      venuesCache.getItem(props.venueId)
        .then(venue => {
          console.log(venue)
          if(!venue) return this.leaveVenue()
          this.setState({venue})
        })
    }
  }
  render() {
    const {ambassadorMode, isAmbassador, me, myReward, otherUser, users} = this.props
    const {challengeFullView, expectedAmbassadorMode, venue} = this.state
    if(!venue || !users) return <View style={styles.container}></View>
    if(this.isInsideChallengeVenue() && !ambassadorMode && permanentState.get('challengeFullView')) return (
      <FindInsideVenue
        {...{otherUser}}
        found={this.found}
        leaveFullView={() => permanentState.set('challengeFullView', false)}
        reward={myReward}
      />
    )
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('./img/vague_top_establishment.png')} style={{ width: '100%'}} resizeMode="stretch"/>
          <View style={styles.establishment}>
            <Text style={styles.establishmentIntro}>Welcome to</Text>
            <Text style={styles.establishmentName}>{venue.properties.name}</Text>
            <Text style={styles.establishmentSubName}>{"Bar"}</Text>
          </View>
          <Image source={require('./img/vague_bottom_establishment.png')} style={{ width: '100%'}} resizeMode="stretch"/>
          <View style={{ position: 'absolute', height: '40%', width: '40%', top: 0}}>
            <UserPhoto user={me} />
          </View>
        </View>
        <View style={styles.infoChannel}>
          <Text style={styles.nbUser}>{users.length} USER{users.length > 1 ? '(S)' : ''}</Text>
        </View>
        <View style={styles.listUser}>
          <UserList
            {...{users}}
            ongoingChallengeUserId={otherUser && otherUser._id}
            ongoingChallengeLeaveFullView={() => permanentState.set('challengeFullView', true)}
          />
        </View>
        {isAmbassador && ambassadorMode &&
          <View style={styles.actionChannel}>
            {this.isInsideChallengeVenue() &&
              <TouchableOpacity style={styles.actionButton} onPress={this.found}>
                <Text style={styles.actionText}>Found!</Text>
              </TouchableOpacity>
            }
            <TouchableOpacity
              disabled={!ambassadorMode && expectedAmbassadorMode}
              style={[styles.actionButton, ambassadorMode && styles.actionButtonActive]}
              onPress={() => this.setAmbassadorMode(!ambassadorMode)}>
              <Text style={styles.actionText}>Ambassador mode</Text>
            </TouchableOpacity>
          </View>
        }
        <View style={{position: 'absolute', top: 0, left: 0, width: '100%'}}>
          <CloseButton onPress={this.leaveVenue} color={"white"}/>
        </View>

      </View>
    )
  }
  isInsideChallengeVenue = () => (
    this.props.startedChallenge && this.props.startedChallenge.venueId === this.props.venueId
  )
  found = () => {
    const { history, startedChallenge } = this.props
    if(!this.isInsideChallengeVenue()) return
    history.push(
      startedChallenge.validationCode ? '/show-qrcode' : '/scan'
    )
  }
  setAmbassadorMode = (mode) => {
    const previousMode = this.props.ambassadorMode
    console.log(mode)
    this.setState({expectedAmbassadorMode: mode})
    Meteor.call('users.setAmbassadorMode', {mode}, (err, res) => {
      console.log(err, res)
      if(err) {
        this.setState({expectedAmbassadorMode: previousMode})
      }
    })
  }
  leaveVenue = () => {
    this.props.history.push('/map')
    Meteor.call('users.leaveVenue')
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '1%',
    paddingTop: 10,
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    paddingTop: 40
  },
  establishment: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#69DCC7',
  },
  infoChannel: {
    flex: 1,
  },
  listUser: {
    flex: 10
  },
  establishmentIntro:{
    color: 'white',
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    fontSize: moderateScale(18, 0.4),
  },
  establishmentName: {
    color: 'white',
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    fontSize: moderateScale(24, 0.4),
  },
  establishmentSubName: {
    color: 'white',
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    fontSize: moderateScale(14, 0.4),
  },
  nbUser: {
    color: 'white',
    marginTop: '1%',
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    fontSize: moderateScale(20, 0.4),
  },
  imgProfile:{
    position: 'absolute',
    backgroundColor: '#ddd',
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'center',
    borderRadius: 500,
  },
  actionChannel: {
    flex: 3
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#69dcc7',
    alignSelf:'center',
    borderRadius: 100,
    paddingVertical : '2%',
    paddingHorizontal : '10%',
  },
  actionButtonActive: {
    backgroundColor: '#FFD900',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: moderateScale(18, 0.4),
    fontFamily: 'Quicksand-Bold',
  },
})
