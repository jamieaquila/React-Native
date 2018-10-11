import PropTypes    from 'prop-types'
import React        from 'react'
import {View, StyleSheet, FlatList, Text, Image, TouchableOpacity} from 'react-native'
import { Link }     from 'react-router-native'
import { moderateScale } from '/modules/scaling/scaling'
import UserPhoto         from '/modules/user/UserPhoto'
import chatIcon          from './icon_chat.png'

export default class UserList extends React.Component {
  static propTypes = {
    users:                         PropTypes.array.isRequired,
    ongoingChallengeUserId:        PropTypes.string,
    ongoingChallengeLeaveFullView: PropTypes.func,
  }
  render() {
    const {users} = this.props
    return (
      <View style={styles.container}>
        <FlatList
          data={users}
          renderItem={this._renderItem}
          renderSeparator={this._renderSeparator}
          keyExtractor={this._keyExtractor}
        />
      </View>
    )
  }
  _renderItem = ({item}) => {
    const {ongoingChallengeUserId, ongoingChallengeLeaveFullView} = this.props
    return (
      <UserListItem
        user={item}
        ongoingChallenge={item._id === ongoingChallengeUserId}
        ongoingChallengeLeaveFullView={ongoingChallengeLeaveFullView}
      />
    )
  }
  _renderSeparator = () => (
    <View style={styles.separator} />
  )
  _keyExtractor = (item) => item._id
}

class UserListItem extends React.PureComponent {
  static propTypes = {
    user:                          PropTypes.object.isRequired,
    ongoingChallenge:              PropTypes.bool,
    ongoingChallengeLeaveFullView: PropTypes.func,
  }
  render() {
    const { ongoingChallenge, ongoingChallengeLeaveFullView, user } = this.props
    const { newMessages, roomId, username } = user
    console.log(roomId)
    return (
      <View style={styles.item}>
        <View style={styles.imgProfile}>
          <UserPhoto user={user} />
        </View>
        <View style={styles.blockName}>
          <Text style={styles.nameProfile}>{username + (newMessages ? ` (${newMessages})` : '')}</Text>
        </View>
        <View style={styles.actionProfile}>
          {ongoingChallenge && (
            <TouchableOpacity onPress={ongoingChallengeLeaveFullView}>
              <Image source={chatIcon} style={{ width: 50, height: 50}} resizeMode="contain"/>
            </TouchableOpacity>
          )}
          <Link to={`/chat/${roomId}`}>
            <Image source={chatIcon} style={{ width: 50, height: 50}} resizeMode="contain"/>
          </Link>
        </View>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: '3%',
    marginBottom: 10,
  },
  imgProfile: {
    flex: 2,
    marginRight: '4%',
  },
  blockName: {
    flex: 6,
  },
  nameProfile: {
    color: '#FFD900',
    fontFamily: 'Quicksand-Bold',
    textAlign: 'left',
    fontSize: moderateScale(16, 0.4),
  },
  actionProfile: {
    flex: 4,
    flexDirection: 'row'
  },
  separator: {
    height: 1,
    width: "86%",
    backgroundColor: "#CED0CE",
    marginLeft: "14%"
  },
})
