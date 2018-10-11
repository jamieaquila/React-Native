import PropTypes      from 'prop-types'
import React          from 'react'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { StyleSheet, Text, View } from 'react-native'
import Meteor, {withTracker} from 'react-native-meteor'
import CloseButton       from '/modules/base/CloseButton'
import { moderateScale } from '/modules/scaling/scaling'
import ChatRooms                  from './ChatRooms'
import handleNewRoom              from './handleNewRoom'
import parseMessagesForGiftedChat from './parseMessagesForGiftedChat'

const CHAT_ZYM_COST = 2

@withTracker(({history, match: {params: {roomId}}}) => {
  Meteor.subscribe('chat.myRooms')
  const me = Meteor.user()
  if(!me) return {}
  if(roomId.substr(0, 4) === 'new_') {
    handleNewRoom({ me, roomId, history })
    return {}
  }
  Meteor.subscribe('chat.messages', roomId)
  const room = ChatRooms.findOne(roomId)
  console.log(room)
  return {
    messages:  parseMessagesForGiftedChat({ me, roomId }),
    otherUser: room && room.otherUser(),
    me,
    roomId,
  }
})
export default class Chat extends React.PureComponent {
  static propTypes = {
    messages:  PropTypes.array,
    otherUser: PropTypes.object,
    roomId:    PropTypes.string,
    me:        PropTypes.object,
  }

  render() {
    const { messages, me, otherUser, roomId } = this.props
    if(!me || !roomId || !otherUser) {
      return <View></View>
    }
    this.ack()
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <CloseButton />
          <Text style={styles.title}>Chat With{'\n'}{otherUser.username}</Text>
        </View>
        <GiftedChat
          messages={messages}
          renderAvatarOnTop={true}
          renderBubble={this.renderBubble}
          onSend={messages => this.onSend(messages)}
          renderComposer={
            me.zyms >= CHAT_ZYM_COST ?
              null :
              (() => <Text style={styles.missingZymsText}>You don't have enough ZYM</Text>)
          }
          user={{_id: me._id}}
        />
      </View>
    )
  }
  ack() {
    const { messages } = this.props
    messages
      .filter(({toAck}) => toAck)
      .map(({_id, text}) => {
        console.log("ack", text)
        Meteor.call('chat.ack', {messageId: _id})
      })
  }
  renderBubble(props) {
    return (
      <Bubble {...props}
        textStyle={{
          right: {
            color: '#E63B97',
          },
          left: {
            color: 'white',
          }
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#69DCC7'
          },
          right: {
            backgroundColor: 'white'
          }
        }} />)}
  onSend(messages = []) {
    messages.forEach(({text, user, _id}) => {
      Meteor.call('chat.send', {
        text,
        roomId: this.props.roomId,
        userId: user._id,
        _id,
      })
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  missingZymsText: {
    color: '#000'
  },
  header:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  title:{
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Quicksand-Bold',
    fontSize: moderateScale(18, 0.4),
    flex: 5,
  }
})
