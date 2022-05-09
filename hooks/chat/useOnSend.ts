import { doc, setDoc } from "firebase/firestore";
import { useCallback } from "react";
import { IMessage } from "react-native-gifted-chat";
import { db } from "../../firebase";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Route } from "../../types/Route/Route";

// hookで囲まなかった場合に異常に読み取り数が増えているような気がするので、hookで囲む。→それをonSendで使うと、hookエラーが起きる。
export const useOnSend = (messages: IMessage[]) => {
  // const route = useRoute<RouteProp<Route, 'Chat'>>()

  const { _id, createdAt ,text, user } = messages[0];
  console.log(messages[0])
  setDoc(doc(db, "messages", String(_id)), {
    _id,
    createdAt,
    text,
    user,
    roomId: 0,
  });
}
