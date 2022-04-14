import { collection, doc, getDocs, query, where, limit } from "@firebase/firestore";
import { orderBy, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { db } from "../../firebase";
import { DefaultButton } from "../../ui/defaultButton";

export const SecondJudgements = () => {
  const [isResultFirstAnswer, setIsResultFirstAnswer] = useState()
  const [documentId, setDocumentId] = useState('')
  const [userId, setUserId] = useState('')
  const judgements = doc(db, 'judgements', documentId)

  // userId取得
  const collectUserId = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(1))
  getDocs(collectUserId).then((answers) => {
    answers.forEach((maps) => {
      setUserId(maps.id)
    })
  })

  // １問目の回答取得
  const findFirstAnswer = query(collection(db, 'judgements'), where('userId', '==', userId), limit(1))
  getDocs(findFirstAnswer).then((answer) => {
    answer.forEach((maps) => {
      setIsResultFirstAnswer(maps.data().firstAnswer)
      setDocumentId(maps.id)
    })
  })

  // これはうまくいく。ドキュメントIDを直接指定しているので。なので、参照をうまくできていなかった。なので、documentIdを指定して、第３引数に代入する
  const onClickYesHandler = async () => {
    await setDoc(judgements, {
      SecondAnswer: true
    }, {merge: true})
  }

  const onClickNoHandler = async () => {
    await setDoc(judgements, {
      SecondAnswer: false
    }, {merge: true})
  }

  const onClickYesAnotherHandler = async () => {
    await setDoc(judgements, {
      AnotherSecondAnswer: true
    }, {merge: true})
  }

  const onClickNoAnotherHandler = async () => {
    await setDoc(judgements, {
      AnotherSecondAnswer: true
    }, {merge: true})
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>推しメン診断画面</Text>
      {isResultFirstAnswer && (
        <>
        <Text style={styles.text}>質問２: 学生時代運動部に入っていましたか？</Text>
        <DefaultButton onPress={onClickYesHandler}>はい</DefaultButton>
        <DefaultButton onPress={onClickNoHandler}>いいえ</DefaultButton>
        </>
      )}
      {!isResultFirstAnswer && (
        <>
        <Text style={styles.text}>質問2: ラーメンは好きですか？</Text>
        <DefaultButton onPress={onClickYesAnotherHandler}>はい</DefaultButton>
        <DefaultButton onPress={onClickNoAnotherHandler}>いいえ</DefaultButton>
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
