import React from "react";
import { StyleSheet } from "react-native";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { Send } from "react-native-gifted-chat";


export const ChatSendButton = (props: any) => {
  return (
    <Send {...props}>
      <Icon name="send" size={24} style={styles.sendButton} />
    </Send>
  )
}

const styles = StyleSheet.create({
  sendButton: {
    marginBottom: 10,
    marginRight: 8,
    color: '#3CD9D9'
  }
})
