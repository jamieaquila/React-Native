import Meteor from 'react-native-meteor'

export default function handleNewRoom({ me, roomId, history }) {
  const userIds = roomId.split('_').slice(1)
  userIds.push(me._id)
  Meteor.call('chat.createRoom', {userIds}, function(err, roomId) {
    if(err) {
      console.error(err)
      return
    }
    console.log("new", roomId)
    history.replace(`/chat/${roomId}`)
  })
}
