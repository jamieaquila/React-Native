import {AsyncStorage} from 'react-native'
import promiseCache from './promiseCache'

export default promiseCache({
  namespace: "cities",
  policy: {
    maxEntries: 100,
  },
  backend: AsyncStorage,
})
