import { collection, getDoc, getDocs, onSnapshot, orderBy, query, where } from "@firebase/firestore";
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { auth, db } from "../../firebase";
import { DefaultButton } from "../../ui/defaultButton";

type Props = {
  questionNumber: boolean
}

// はいできた場合、true(どこでconsoleしても)。
// async/awaitはだめ
export const SecondRecommend = () => {
  const answers: any = []
  const [isResultFirstAnswer, setIsResultFirstAnswer] = useState()
  const user = auth.currentUser;
  const email = String(user?.email)
  const getFirstQuestionAnswer = query(collection(db, 'answer'), where('email', '==', email), orderBy('timestamp', 'desc'))
  // onSnapshotを使うと、出力される配列が多すぎて、useStateに値をセットできなかった。firestoreのデータを取ってくるだけでいいので、getDocsで十分。
  getDocs(getFirstQuestionAnswer).then((answer) => {
    answer.forEach((maps) => {
      answers.push(maps.data().firstAnswer)
      setIsResultFirstAnswer(answers[0])
    })
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>推しメン診断画面</Text>
      {isResultFirstAnswer && (
        <>
        <Text style={styles.text}>質問２: 学生時代運動部に入っていましたか？</Text>
        <DefaultButton>はい</DefaultButton>
        <DefaultButton>いいえ</DefaultButton>
        </>
      )}
      {!isResultFirstAnswer && (
        <>
        <Text style={styles.text}>質問2: ラーメンは好きですか？</Text>
        <DefaultButton>はい</DefaultButton>
        <DefaultButton>いいえ</DefaultButton>
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
