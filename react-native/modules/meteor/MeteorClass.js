export default class MeteorClass {
  constructor(props) {
    Object.keys(props).map(key => this[key] = props[key])
  }
}
