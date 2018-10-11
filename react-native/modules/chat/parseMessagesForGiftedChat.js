import Meteor from 'react-native-meteor'
import getPhotoUrl from '/modules/user/getPhotoUrl'

export default function parseMessagesForGiftedChat({ me, roomId }) {
  const notAcked = Meteor.collection('chat_messages').find(
    {roomId, acks: {$ne: me._id}, userId: {$ne: me._id}}, {fields: {}}
  )
  const users = {}
  return Meteor.collection('chat_messages').find(
    {roomId},
    {sort: {createdAt: -1}, limit: Math.max(50, notAcked.length)}
  ).map(({_id, acks, text, createdAt, userId}) => {
    const user = users[userId] || Meteor.collection('users').findOne(userId)
    users[userId] = user
    return {
      _id,
      toAck: userId !== me._id && acks.indexOf(me._id) === -1,
      text,
      createdAt,
      user: (() => {
        return {
          _id: userId,
          name: userId === me._id ? 'Me' : user.username,
          avatar: getPhotoUrl(userId === me._id ? me : user),
        }
      })(),
    }
  })
}
