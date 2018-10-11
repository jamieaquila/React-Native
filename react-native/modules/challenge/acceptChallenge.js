import Meteor from 'react-native-meteor'

export default (challengeId) => {
  Meteor.call('challenges.accept', {challengeId, userId: Meteor.userId()})
}
