import React, { useEffect, useState } from "react";
import {
  query,
  collection,
  limit,
  getDocs,
} from "@firebase/firestore";
import { View, Text, StyleSheet } from "react-native";
import { auth, db } from "../../firebase/firebase";
import { doc, setDoc, where } from "firebase/firestore";
import { DefaultButton } from "../../ui/DefaultButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LoadingIndicator } from "../../ui/LoadingIndicator";
import { Route } from '../../types/Route/Route'
import { saveThirdJudgements } from "../../modules/SaveThirdJudgements";
import { navigateFourthJudgements } from "../../modules/NavigateFourthJudgements";

type Props = NativeStackScreenProps<
  Route,
  "FourthJudgements" | "YourRecommend"
>;

export const ThirdJudgements = ({ navigation }: Props) => {
  const [isResultFirstAnswer, setIsResultFirstAnswer] = useState();
  const [isResultSecondAnswer, setIsResultSecondAnswer] = useState();
  const [documentId, setDocumentId] = useState("");

  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    const findSecondAnswer = query(
      collection(db, "judgements"),
      where("userId", "==", userId),
      limit(1)
    );
    getDocs(findSecondAnswer)
      .then((answer) => {
        setIsResultFirstAnswer(answer.docs[0].data().firstAnswer)
        setIsResultSecondAnswer(answer.docs[0].data().secondAnswer)
        setDocumentId(answer.docs[0].id)
        // answer.forEach((maps) => {
        //   setIsResultFirstAnswer(maps.data().firstAnswer);
        //   setIsResultSecondAnswer(maps.data().secondAnswer);
        //   setDocumentId(maps.id);
        // });
      })
      .catch((error) => console.error(error));
  }, [isResultFirstAnswer, isResultSecondAnswer, documentId])

// TODO: ここ切り出せる
  const saveThirdJudgement = (answer: boolean) => {
    saveThirdJudgements({
      navigation,
      documentId,
      thirdAnswer: answer
    })
  }

// TODO: ここ切り出せる
  const navigateFourthJudgement = (answer: boolean) => {
    navigateFourthJudgements({
      navigation,
      documentId,
      thirdAnswer: answer,
    })
  }

  if (isResultFirstAnswer === undefined || isResultSecondAnswer === undefined) {
    return <LoadingIndicator />;
  }

  // 1問目の「はい」、２問目の「いいえ」に４番目の質問画面に遷移するように実装。
  return (
    <View style={styles.container}>
      <Text style={styles.title}>推しメン診断画面</Text>
      {isResultFirstAnswer && isResultSecondAnswer && (
        <>
          <Text style={styles.text}>
            質問3: 身近な人から計算高い性格だと言われたことはありますか？
          </Text>
          <DefaultButton onPress={() => navigateFourthJudgement(true)}>はい</DefaultButton>
          <DefaultButton
            onPress={() => {
              saveThirdJudgement(false);
            }}
          >
            いいえ
          </DefaultButton>
        </>
      )}
      {isResultFirstAnswer && !isResultSecondAnswer && (
        <>
          <Text style={styles.text}>
            質問3: パンダになりたいと感じたことはありますか？
          </Text>
          <DefaultButton onPress={() => saveThirdJudgement(true)}>
            はい
          </DefaultButton>
          <DefaultButton onPress={() => navigateFourthJudgement(false)}>いいえ</DefaultButton>
        </>
      )}
      {!isResultFirstAnswer && isResultSecondAnswer && (
        <>
          <Text style={styles.text}>
            質問3: カラオケで90点以上を取ったことがありますか？
          </Text>
          <DefaultButton onPress={() => saveThirdJudgement(true)}>
            はい
          </DefaultButton>
          <DefaultButton onPress={() => saveThirdJudgement(false)}>
            いいえ
          </DefaultButton>
        </>
      )}
      {!isResultFirstAnswer && !isResultSecondAnswer && (
        <>
          <Text style={styles.text}>
            質問3: 源氏物語と枕草子、読むとしたらどっち？
          </Text>
          <DefaultButton onPress={() => saveThirdJudgement(true)}>
            源氏物語
          </DefaultButton>
          <DefaultButton onPress={() => saveThirdJudgement(false)}>
            枕草子
          </DefaultButton>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 40, fontWeight: "bold", padding: 10, color: "#7B8D93" },
  text: { fontSize: 24, fontWeight: "bold", padding: 16 },
});
