import { AsyncStorage } from 'react-native'

const base = '@mechaniku-'
export default class localStorage {
    static set(key, value) {
        return AsyncStorage.setItem(`${base}${key}`, value.toString())
    }

    static get(key, value) {
        return AsyncStorage.getItem(`${base}${key}`)
    }

    static remove(key){
        return AsyncStorage.removeItem(`${base}${key}`)
    }

    static clear(){
        return AsyncStorage.clear()
    }
}