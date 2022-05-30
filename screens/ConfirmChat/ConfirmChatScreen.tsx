import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DefaultButton } from "../../ui/DefaultButton";
import { CHAT_EXPLAIN } from "./ChatExplain";
import { Route } from '../../types/Route/Route';
import { Confirm } from "../../modules/confirm";

type Props = NativeStackScreenProps<Route, 'SecondYourRecommendScreen'>;

export const ConfirmChat = ({ navigation, route }: Props) => {
  console.log('roomIdの上');
  console.log(route.params?.id);

  // roomIdを配列で取ってこれるようにした。
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>チャット部屋に入室する</Text>
        <View style={styles.explain}>
          <Text style={styles.title2}>チャット部屋とは？</Text>
          <Text style={styles.text}>{CHAT_EXPLAIN}</Text>
        </View>
        <DefaultButton
          onPress={() => {
            Confirm(),
            navigation.navigate('Chat', {
              roomId: route.params?.id
            })
          }}
        >
          チャット部屋に入室する
        </DefaultButton>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  explain: { backgroundColor: "#AD97AC" },
  title: { fontSize: 35, fontWeight: "bold", padding: 10, color: "#7B8D93" },
  title2: { fontSize: 24, fontWeight: "bold", color: "#008C8A", padding: 8 },
  text: { fontSize: 24, fontWeight: "bold", padding: 24 },
});
