import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState }  from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { DefaultButton } from '../../ui/defaultButton'
import { db, auth } from '../../firebase'
import { addDoc, collection, getDoc, getDocs, limit, orderBy, query } from '@firebase/firestore'
import { doc } from 'firebase/firestore'

type SecondJudgements = {
  SecondJudgements: undefined;
}

type Props = NativeStackScreenProps<SecondJudgements, 'SecondJudgements'>

export const FirstJudgements = ({ navigation } : Props) =>{
  const [userId, setUserId] = useState('')
  const user = auth.currentUser;
  // この時点でエラーを表示
  if (user === null) {
    Alert.alert('ユーザーが存在しません。', '再度新規登録を行ってください。')
  }

  // userId取得処理
  const collectUserId = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(1))
  getDocs(collectUserId).then((answers) => {
    answers.forEach((maps) => {
      setUserId(maps.id)
    })
  })
    
  const onClickYesHandler = async () => {
    await addDoc(collection(db, 'judgements'), {
      userId: userId,
      firstAnswer: true,
    })
    .then(() => {navigation.navigate('SecondJudgements')})
  }

  const onClickNoHandler = async () => {
    await addDoc(collection(db, 'judgements'), {
      userId: userId,
      firstAnswer: false,
    })
    .then(() => {navigation.navigate('SecondJudgements')})
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>推しメン診断画面</Text>
      <Text style={styles.text}>質問１: もしあなたが一人っ子だとしたら、妹/弟は欲しいですか？</Text>
      <DefaultButton onPress={onClickYesHandler}>はい</DefaultButton>
      <DefaultButton onPress={onClickNoHandler}>いいえ</DefaultButton>
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
