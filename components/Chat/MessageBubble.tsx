import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { Bubble } from 'react-native-gifted-chat';
import { auth } from '../../firebase';

// components
import { LoadingIndicator } from '../../ui/LoadingIndicator';

export const MessageBubble = (props: Bubble['props']) => {
  const user = auth.currentUser;
  const userId = user?.uid

  if (!props.currentMessage) {
    return <LoadingIndicator />
  }
  const currentUserId = props.currentMessage?.user._id;
  let times = props.currentMessage.createdAt as Date;
  const time = new Date(times)

  return (
    <View style={{ flex: 1 }}>
      {userId !== currentUserId && (
        <Text style={styles.userName}>
          {props.currentMessage.user.name}
        </Text>
      )}
      <Bubble 
        {...props}
        textStyle={{
          right: {
            color: 'black'
          },
          left: {
            color: 'white'
          }
        }}
        wrapperStyle={{
          right: {
            backgroundColor: 'white'
          },
          left: {
            backgroundColor: '#3CD9D9'
          }
        }}
        renderTime={() => {
          return null
        }}
        />
        {userId === currentUserId ? (
          <Text style={styles.rightTime}>{time.toLocaleTimeString()}</Text>
        ) : (
          <Text style={styles.leftTime}>{time.toLocaleTimeString()}</Text>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
  userName: {
    fontSize: 15,
    color: '#8B8BD9',
    fontWeight: 'bold'
  },
  rightTime: {
    textAlign: 'right',
    fontSize: 14,
    color: '#6B8187'
  },
  leftTime: {
    textAlign: 'left',
    fontSize: 14,
    color: '#6B8187'
  }
})
