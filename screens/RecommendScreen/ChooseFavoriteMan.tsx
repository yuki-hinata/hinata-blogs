import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { DefaultButton } from '../../ui/defaultButton'
import { db, auth } from '../../firebase'
import { addDoc, collection, Timestamp　} from '@firebase/firestore'

type Second = {
  Second: undefined;
}

type Props = NativeStackScreenProps<Second, 'Second'>

export const ChooseFavoriteMan = ({ navigation } : Props) => {
  const user = auth.currentUser;
  // この時点でエラーを表示
  if (user === null) {
    Alert.alert('ユーザーが存在しません。', '再度新規登録を行ってください。')
  }
  
  const onClickYesButton = async () => {
    await addDoc(collection(db, 'answer'), {
      email: user?.email,
      firstAnswer: true,
      timestamp: Timestamp.fromDate(new Date())
    })
    .then(() => {navigation.navigate('Second')})
  }

  const onClickNoButton = async () => {
    await addDoc(collection(db, 'answer'), {
      email: user?.email,
      firstAnswer: false,
      timestamp: Timestamp.fromDate(new Date())
    })
    .then(() => {navigation.navigate('Second')})
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>推しメン診断画面</Text>
      <Text style={styles.text}>質問１: もしあなたが一人っ子だとしたら、妹/弟は欲しいですか？</Text>
      <DefaultButton onPress={onClickYesButton}>はい</DefaultButton>
      <DefaultButton onPress={onClickNoButton}>いいえ</DefaultButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    padding: 10,
    color: '#7B8D93'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 24
  }
})
