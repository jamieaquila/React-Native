import Meteor  from 'react-native-meteor'
import MeteorClass from 'modules/meteor/MeteorClass'

export default class Venues extends MeteorClass {
  static _name = 'venues'
  static find(...args) {
    const list = Meteor.collection(Venues._name).find(...args) || []
    // console.log("find", ...args, list.length)
    return list.map(item => new Venues(item))
  }
  static findOne(query = {}, options = {}, ...args) {
    return this.find(query, {...options, limit: 1}, ...args)[0]
  }
  static subscribe(name, ...args) {
    return Meteor.subscribe(`${Venues._name}.${name}`, ...args)
  }

  getUsers() {
    return Meteor.collection('users').find({venueId: this._id})
  }
}
