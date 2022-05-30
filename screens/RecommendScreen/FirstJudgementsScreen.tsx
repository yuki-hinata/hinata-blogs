import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { DefaultButton } from "../../ui/DefaultButton";
import { auth } from "../../firebase/firebase";
import { saveFirstJudgements } from "../../modules/SaveFirstJudgements";
import { Route } from '../../types/Route/Route'

type Props = NativeStackScreenProps<Route, "SecondJudgements">;

export const FirstJudgements = ({ navigation }: Props) => {
  const user = auth.currentUser;
  // この時点でエラーを表示
  if (user === null) {
    Alert.alert("ユーザーが存在しません。", "再度新規登録を行ってください。");
  }

  const onClickHandler = (answer: boolean) => {
    saveFirstJudgements({
      firstAnswer: answer,
      navigation
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>推しメン診断画面</Text>
      <Text style={styles.text}>
        質問１: もしあなたが一人っ子だとしたら、妹/弟は欲しいですか？
      </Text>
      <DefaultButton onPress={() => onClickHandler(true)}>はい</DefaultButton>
      <DefaultButton onPress={() => onClickHandler(false)}>
        いいえ
      </DefaultButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 40, fontWeight: "bold", padding: 10, color: "#7B8D93" },
  text: { fontSize: 24, fontWeight: "bold", padding: 24 },
});
