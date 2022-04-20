import React, { useState } from "react";
import { query, collection, orderBy, limit, getDocs } from "@firebase/firestore";
import { View, Text, StyleSheet } from 'react-native'
import { auth, db } from "../../firebase";
import { doc, setDoc, where } from "firebase/firestore";
import { DefaultButton } from "../../ui/DefaultButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LoadingIndicator } from "../../ui/LoadingIndicator";

type FourthJudgements = {
  FourthJudgements: undefined;
  YourRecommend: undefined
}

type Props =  NativeStackScreenProps<FourthJudgements, 'FourthJudgements' | 'YourRecommend'>

export const ThirdJudgements = ({ navigation }: Props) => {
  const [isResultFirstAnswer, setIsResultFirstAnswer] = useState()
  const [isResultSecondAnswer, setIsResultSecondAnswer] = useState()
  const [documentId, setDocumentId] = useState('')

  const user = auth.currentUser;
  const userId = user?.uid;
  
  const findSecondAnswer = query(collection(db, 'judgements'), where('userId', '==', userId), limit(1))
  getDocs(findSecondAnswer).then((answer) => {
    answer.forEach((maps) => {
      setIsResultFirstAnswer(maps.data().firstAnswer)
      setIsResultSecondAnswer(maps.data().secondAnswer)
      setDocumentId(maps.id)
    })
  }).catch((error) => console.error(error))

  const onClickThirdHandler = async (thirdAnswer: boolean) => {
    const judgements = doc(db, 'judgements', documentId)
    await setDoc(judgements, {
      thirdAnswer
    }, {merge: true})
    .then(() => navigation.navigate('YourRecommend'))
  }

  const onClick = async (thirdAnswer: boolean) => {
    const judgements = doc(db, 'judgements', documentId)
    await setDoc(judgements, {
      thirdAnswer
    }, {merge: true})
    .then(() => navigation.navigate('FourthJudgements'))
  }

  if (isResultFirstAnswer === undefined) {
    return <LoadingIndicator />
  }

  if (isResultSecondAnswer === undefined) {
    return <LoadingIndicator />
  }
  // 1問目の「はい」、２問目の「いいえ」に４番目の質問画面に遷移するように実装。
  return (
    <View style={styles.container}>
      <Text style={styles.title}>推しメン診断画面</Text>
      {isResultFirstAnswer && isResultSecondAnswer && (
        <>
        <Text style={styles.text}>質問3: 身近な人から計算高い性格だと言われたことはありますか？</Text>
        <DefaultButton onPress={() => onClick(true)}>はい</DefaultButton>
        <DefaultButton onPress={() => {onClickThirdHandler(false)}}>いいえ</DefaultButton>
        </>
      )}
      {isResultFirstAnswer && !isResultSecondAnswer && (
        <>
        <Text style={styles.text}>質問3: パンダになりたいと感じたことはありますか？</Text>
        <DefaultButton onPress={() => onClickThirdHandler(true)}>はい</DefaultButton>
        <DefaultButton onPress={() => onClick(false)}>いいえ</DefaultButton>
        </>
      )}
      {!isResultFirstAnswer && isResultSecondAnswer && (
        <>
        <Text style={styles.text}>質問3: カラオケで90点以上を取ったことがありますか？</Text>
        <DefaultButton onPress={() => onClickThirdHandler(true)}>はい</DefaultButton>
        <DefaultButton onPress={() => onClickThirdHandler(false)}>いいえ</DefaultButton>
        </>
      )}
      {!isResultFirstAnswer && !isResultSecondAnswer && (
        <>
        <Text style={styles.text}>質問3: 源氏物語と枕草子、読むとしたらどっち？</Text>
        <DefaultButton onPress={() => onClickThirdHandler(true)}>源氏物語</DefaultButton>
        <DefaultButton onPress={() => onClickThirdHandler(false)}>枕草子</DefaultButton>
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
