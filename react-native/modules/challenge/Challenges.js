import Meteor  from 'react-native-meteor'
import MeteorClass from 'modules/meteor/MeteorClass'
import getPhotoUrl from 'modules/user/getPhotoUrl'

export default class Challenges extends MeteorClass {
  static _name = 'challenges'
  static find(...args) {
    const list = Meteor.collection(Challenges._name).find(...args) || []
    // console.log("find", ...args, list.length)
    return list.map(item => new Challenges(item))
  }
  static findOne(query = {}, options = {}, ...args) {
    return this.find(query, {...options, limit: 1}, ...args)[0]
  }
  static subscribe(name, ...args) {
    return Meteor.subscribe(`${Challenges._name}.${name}`, ...args)
  }

  getVenue() {
    return Meteor.collection('venues').findOne(this.venueId)
  }
  getPhoto() {
    const userId = this.otherPlayerUserId()
    console.log("playerUserId", userId)
    const user = Meteor.collection('users').findOne(userId)
    return getPhotoUrl(user)
  }
  playerFromUserId(userId) {
    const idx = this.playerIdxFromUserId(userId)
    return this.players[idx]
  }
  playerIdxFromUserId(userId) {
    return this.players.findIndex((p) => p.userId === userId)
  }
  otherPlayerUser() {
    return Meteor.collection('users').findOne(
      this.otherPlayerUserId()
    )
  }
  otherPlayerUserId() {
    return this.players.find(p => p.userId != Meteor.userId()).userId
  }
}
