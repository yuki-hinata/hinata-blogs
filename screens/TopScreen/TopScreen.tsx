import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { DefaultButton } from "../../ui/defaultButton";

export const TopScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hinata-App</Text>
      <DefaultButton>新規登録を行う</DefaultButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5bbee5',
  },
  title: {
    fontSize: 40,
  }
})
