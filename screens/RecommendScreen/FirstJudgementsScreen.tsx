import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { DefaultButton } from '../../ui/DefaultButton'
import { db, auth } from '../../firebase'
import { addDoc, collection } from '@firebase/firestore'

type SecondJudgements = {
  SecondJudgements: undefined;
}

type Props = NativeStackScreenProps<SecondJudgements, 'SecondJudgements'>

export const FirstJudgements = ({ navigation } : Props) => {
  const user = auth.currentUser;
  // この時点でエラーを表示
  if (user === null) {
    Alert.alert('ユーザーが存在しません。', '再度新規登録を行ってください。')
  }

  const onClickHandler = async (firstAnswer: boolean) => {
    const userId = user?.uid
    await addDoc(collection(db, 'judgements'), {
      userId,
      firstAnswer
    })
    .then(() => navigation.navigate('SecondJudgements'))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>推しメン診断画面</Text>
      <Text style={styles.text}>質問１: もしあなたが一人っ子だとしたら、妹/弟は欲しいですか？</Text>
      <DefaultButton onPress={() => onClickHandler(true)}>はい</DefaultButton>
      <DefaultButton onPress={() => onClickHandler(false)}>いいえ</DefaultButton>
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
