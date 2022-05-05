import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "@firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { auth, db } from "../../firebase";
import { DefaultButton } from "../../ui/DefaultButton";
import { CHAT_EXPLAIN } from "./ChatExplain";
import { Route } from '../../types/Route/Route';

type Props = NativeStackScreenProps<Route, "Chat">;

export const ConfirmChat = ({ navigation }: Props) => {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const roomsDocIdRef = query(
      collection(db, "Rooms"),
      where("userIds", "array-contains", String(auth.currentUser?.uid))
    );
  // TODO: ここ切り出せる
    getDocs(roomsDocIdRef).then((documentId) => {
      documentId.docs.map((doc) => {
        setId(doc.id);
      });
    });
  }, [id])

  // ここは今後userが推しメンを複数持てるようになっても、対応可能だと思う。
  const enterRoomTime = async () => {
    await addDoc(collection(db, 'enterRoomTime'), {
      userId: auth.currentUser?.uid,
      roomId: id,
      createdAt: serverTimestamp(),
    })
  }

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
            enterRoomTime(),
            navigation.navigate("Chat", {
              roomId: id,
            });
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
