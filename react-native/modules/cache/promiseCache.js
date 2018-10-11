import { Cache }    from 'react-native-cache'

const promisify = (func, parent) => (...args) => new Promise((resolve, reject) => {
  func.bind(parent)(...args, function(err, res) {
    if(err) return reject(err)
    resolve(res)
  })
})

export default (args) => {
  const cache = new Cache(args)
  cache.addToLRU      = promisify(cache.addToLRU,      cache)
  cache.removeFromLRU = promisify(cache.removeFromLRU, cache)
  cache.refreshLRU    = promisify(cache.refreshLRU,    cache)
  cache.getLRU        = promisify(cache.getLRU,        cache)
  cache.setLRU        = promisify(cache.setLRU,        cache)
  cache.enforceLimits = promisify(cache.enforceLimits, cache)
  cache.removeItem    = promisify(cache.removeItem,    cache)
  cache.getItem       = promisify(cache.getItem,       cache)
  cache.peekItem      = promisify(cache.peekItem,      cache)
  cache.setItem       = promisify(cache.setItem,       cache)
  cache.clearAll      = promisify(cache.clearAll,      cache)
  cache.getAll        = promisify(cache.getAll,        cache)
  return cache
}
