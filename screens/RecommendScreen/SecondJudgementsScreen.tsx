import React, { useState } from "react";
import { collection, doc, getDocs, query, where, limit } from "@firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { orderBy, setDoc } from "firebase/firestore";
import { View, Text, StyleSheet } from "react-native";
import { auth, db } from "../../firebase";
import { DefaultButton } from "../../ui/DefaultButton";
import { LoadingIndicator } from "../../ui/LoadingIndicator";

type ThirdJudgements = {
  ThirdJudgements: undefined
}

type Props = NativeStackScreenProps<ThirdJudgements, 'ThirdJudgements'>

export const SecondJudgements = ({ navigation }: Props) => {
  const [isResultFirstAnswer, setIsResultFirstAnswer] = useState()
  const [documentId, setDocumentId] = useState('')

  // userId 取得処理
  const user = auth.currentUser;
  const userId = user?.uid;

  // １問目の回答取得
  const findFirstAnswer = query(collection(db, 'judgements'), where('userId', '==', userId), limit(1))
  getDocs(findFirstAnswer).then((answer) => {
    answer.forEach((maps) => {
      setIsResultFirstAnswer(maps.data().firstAnswer)
      setDocumentId(maps.id)
    })
  })

  const onClickSecondHandler = async (secondAnswer: boolean) => {
    const judgements = doc(db, 'judgements', documentId)
    await setDoc(judgements, {
      secondAnswer
    }, {merge: true})
    .then(() => navigation.navigate('ThirdJudgements')).catch((error) => console.error(error))
  }

  if (isResultFirstAnswer === undefined) {
    return <LoadingIndicator />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>推しメン診断画面</Text>
      {isResultFirstAnswer && (
        <>
        <Text style={styles.text}>質問２: 学生時代運動部に入っていましたか？</Text>
        <DefaultButton onPress={() => onClickSecondHandler(true)}>はい</DefaultButton>
        <DefaultButton onPress={() => onClickSecondHandler(false)}>いいえ</DefaultButton>
        </>
      )}
      {!isResultFirstAnswer && (
        <>
        <Text style={styles.text}>質問2: ラーメンは好きですか？</Text>
        <DefaultButton onPress={() => onClickSecondHandler(true)}>はい</DefaultButton>
        <DefaultButton onPress={() => onClickSecondHandler(false)}>いいえ</DefaultButton>
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
