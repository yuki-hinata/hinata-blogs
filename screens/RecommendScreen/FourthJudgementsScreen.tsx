import React, { useState } from "react";
import {
  query,
  collection,
  limit,
  getDocs,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import { View, Text, StyleSheet } from "react-native";
import { auth, db } from "../../firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DefaultButton } from "../../ui/DefaultButton";
import { LoadingIndicator } from "../../ui/LoadingIndicator";
import { Route } from '../../types/Route/Route';

type Props = NativeStackScreenProps<Route, "YourRecommend">;

export const FourthJudgements = ({ navigation }: Props) => {
  const [isResultFirstAnswer, setIsResultFirstAnswer] = useState();
  const [isResultSecondAnswer, setIsResultSecondAnswer] = useState();
  const [isResultThirdAnswer, setIsResultThirdAnswer] = useState();
  const [documentId, setDocumentId] = useState("");

  const user = auth.currentUser;
  const userId = user?.uid;

  const findUsersAnswer = query(
    collection(db, "judgements"),
    where("userId", "==", userId),
    limit(1)
  );
  getDocs(findUsersAnswer).then((answer) => {
    // 1つしか無いのにforEach使っているのおかしい
    // answer.forEach((maps) => {
    //   setIsResultFirstAnswer(maps.data().firstAnswer);
    //   setIsResultSecondAnswer(maps.data().secondAnswer);
    //   setIsResultThirdAnswer(maps.data().thirdAnswer);
    //   setDocumentId(maps.id);
    // });
    if (answer.empty || answer.docs.length >= 2) {
      // ここで例外を投げる？的な
      return
    }
      setIsResultFirstAnswer(answer.docs[0].data().firstAnswer);
      setIsResultSecondAnswer(answer.docs[0].data().secondAnswer);
      setIsResultThirdAnswer(answer.docs[0].data().thirdAnswer);
      setDocumentId(answer.docs[0].id);
  });

  const onClickFourthHandler = async (fourthAnswer: boolean) => {
    const judgementsId = doc(db, "judgements", documentId);
    await setDoc(judgementsId, { fourthAnswer }, { merge: true }).then(() =>
      navigation.navigate("YourRecommend")
    );
  };

// ここのif文は1つにできるはず
  if (isResultFirstAnswer === undefined) {
    return <LoadingIndicator />;
  }

  if (isResultSecondAnswer === undefined) {
    return <LoadingIndicator />;
  }

  if (isResultThirdAnswer === undefined) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>推しメン診断画面</Text>
      {isResultFirstAnswer && isResultSecondAnswer && isResultThirdAnswer && (
        <>
          <Text style={styles.text}>質問4: 恐竜は好きですか？</Text>
          <DefaultButton onPress={() => onClickFourthHandler(true)}>
            好き
          </DefaultButton>
          <DefaultButton onPress={() => onClickFourthHandler(false)}>
            嫌い
          </DefaultButton>
        </>
      )}
      {isResultFirstAnswer && !isResultSecondAnswer && !isResultThirdAnswer && (
        <>
          <Text style={styles.text}>
            質問4: 養命酒を飲んだことはありますか？
          </Text>
          <DefaultButton onPress={() => onClickFourthHandler(true)}>
            ある
          </DefaultButton>
          <DefaultButton onPress={() => onClickFourthHandler(false)}>
            ない
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
