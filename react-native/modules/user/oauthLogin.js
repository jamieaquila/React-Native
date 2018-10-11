import Config from 'react-native-config'
import * as providers from 'react-native-simple-auth'

const PROVIDERS_CONFIG = {
  facebook: {
    appId: Config.FACEBOOK_APP_ID,
    callback: `fb${Config.FACEBOOK_APP_ID}://authorize`,
    //scope:
    //fields:
  },
  google: {
    appId:    Config.GOOGLE_OAUTH_APP_ID,
    callback: 'com.enzym-proto:/oauth2redirect'
  },
  twitter: {
    appId:     Config.TWITTER_CONSUMER_KEY,
    appSecret: Config.TWITTER_SECRET_KEY,
    callback:  'com.enzym_proto://authorize'
  }
}

export default async function oauthLogin(providerName) {
  const provider = providers[providerName]
  console.log(providers)
  if(!provider) throw new Error(`Oauth provider does not exist (${providerName})`)
  const config = PROVIDERS_CONFIG[providerName]
  if(!config) throw new Error(`Oauth provider is not configured (${providerName})`)
  try {
    const info = await provider(config)
    console.log(info)
    return info
  } catch(error) {
    console.log(error)
  }
}
