import {AsyncStorage} from 'react-native'
import promiseCache from './promiseCache'

export default promiseCache({
  namespace: "venues",
  policy: {
    maxEntries: 100,
  },
  backend: AsyncStorage,
})
