import Meteor from 'react-native-meteor'

export default (challengeId) => {
  Meteor.call('challenges.decline', {challengeId, userId: Meteor.userId()})
}
