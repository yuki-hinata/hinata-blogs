import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { DefaultButton } from '../../ui/defaultButton'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5bbee5'
  },
  title: {
    fontSize: 40,
    paddingBottom: 40
  }
})
export const TopScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hinata-App</Text>
      <DefaultButton onPress={() => console.log('push')}>新規登録を行う</DefaultButton>
    </View>
  )
}
