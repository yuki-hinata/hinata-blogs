import React, { useState } from "react";
import { query, collection, orderBy, limit, getDocs, where, doc, setDoc } from "firebase/firestore";
import { View, Text, StyleSheet } from "react-native";
import { auth, db } from "../../firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DefaultButton } from '../../ui/DefaultButton';
import { LoadingIndicator } from '../../ui/LoadingIndicator';

type YourRecommend = {
  YourRecommend: undefined
}

type Props = NativeStackScreenProps<YourRecommend, 'YourRecommend'>

export const FourthJudgements = ({ navigation }: Props) => {
  const [isResultFirstAnswer, setIsResultFirstAnswer] = useState()
  const [isResultSecondAnswer, setIsResultSecondAnswer] = useState()
  const [isResultThirdAnswer, setIsResultThirdAnswer] = useState()
  const [documentId, setDocumentId] = useState('')

  const user = auth.currentUser;
  const userId = user?.uid;

  const findUsersAnswer = query(collection(db, 'judgements'), where('userId', '==', userId), limit(1))
  getDocs(findUsersAnswer).then((answer) => {
    answer.forEach((maps) => {
      setIsResultFirstAnswer(maps.data().firstAnswer)
      setIsResultSecondAnswer(maps.data().secondAnswer)
      setIsResultThirdAnswer(maps.data().thirdAnswer)
      setDocumentId(maps.id)
    })
  })

  const onClickFourthHandler = async (fourthAnswer: boolean) => {
    const judgementsId = doc(db, 'judgements', documentId)
    await setDoc(judgementsId, {
      fourthAnswer
    }, { merge: true })
    .then(() => navigation.navigate('YourRecommend'))
  }

  if (isResultFirstAnswer === undefined) {
    return <LoadingIndicator />
  }

  if (isResultSecondAnswer === undefined) {
    return <LoadingIndicator />
  }

  if (isResultThirdAnswer === undefined) {
    return <LoadingIndicator />
  }

  return (
  <View style={styles.container}>
    <Text style={styles.title}>推しメン診断画面</Text>
    {isResultFirstAnswer && isResultSecondAnswer && isResultThirdAnswer && (
      <>
        <Text style={styles.text}>質問4: 恐竜は好きですか？</Text>
        <DefaultButton onPress={() => onClickFourthHandler(true)}>好き</DefaultButton>
        <DefaultButton onPress={() => onClickFourthHandler(false)}>嫌い</DefaultButton>
      </>
    )}
    {isResultFirstAnswer && !isResultSecondAnswer && !isResultThirdAnswer && (
      <>
        <Text style={styles.text}>質問4: 養命酒を飲んだことはありますか？</Text>
        <DefaultButton onPress={() => onClickFourthHandler(true)}>ある</DefaultButton>
        <DefaultButton onPress={() => onClickFourthHandler(false)}>ない</DefaultButton>
    </>
    )}
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
    padding: 16
  }
})
