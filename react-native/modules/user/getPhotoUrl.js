import Config      from 'react-native-config'

const { bucket, keyPrefix, region } = JSON.parse(Config.AWS_PHOTOS)

export default ({profile}) => {
  if(!profile || !profile.photo || !profile.photo.storageId) return
  return `https://${bucket}.s3-${region}.amazonaws.com/${keyPrefix}${profile.photo.storageId}.jpg`
}
