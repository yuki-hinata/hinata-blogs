import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
} from "@firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, StyleSheet } from "react-native";
import { auth, db } from "../../firebase/firebase";
import { DefaultButton } from "../../ui/DefaultButton";
import { LoadingIndicator } from "../../ui/LoadingIndicator";
import { Route } from '../../types/Route/Route';
import { saveSecondJudgements } from "../../modules/SaveSecondJudgements";

type Props = NativeStackScreenProps<Route, "ThirdJudgements">;

export const SecondJudgements = ({ navigation }: Props) => {
  const [isResultFirstAnswer, setIsResultFirstAnswer] = useState<boolean>();
  const [documentId, setDocumentId] = useState("");

  // userId 取得処理
  const user = auth.currentUser;
  const userId = user?.uid;

  // １問目の回答取得
  useEffect(() => {
    const findFirstAnswer = query(
      collection(db, "judgements"),
      where("userId", "==", userId),
      limit(1)
    );
    getDocs(findFirstAnswer).then((answer) => {
      setIsResultFirstAnswer(answer.docs[0].data().firstAnswer)
      setDocumentId(answer.docs[0].id)
    });
  }, [])

  const onClickSecondHandler = (answer: boolean) => {
    saveSecondJudgements({
      secondAnswer: answer,
      navigation,
      documentId,
    })
  }

  if (isResultFirstAnswer === undefined) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>推しメン診断画面</Text>
      {isResultFirstAnswer && (
        <>
          <Text style={styles.text}>
            質問２: 学生時代運動部に入っていましたか？
          </Text>
          <DefaultButton onPress={() => onClickSecondHandler(true)}>
            はい
          </DefaultButton>
          <DefaultButton onPress={() => onClickSecondHandler(false)}>
            いいえ
          </DefaultButton>
        </>
      )}
      {!isResultFirstAnswer && (
        <>
          <Text style={styles.text}>質問2: ラーメンは好きですか？</Text>
          <DefaultButton onPress={() => onClickSecondHandler(true)}>
            はい
          </DefaultButton>
          <DefaultButton onPress={() => onClickSecondHandler(false)}>
            いいえ
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
