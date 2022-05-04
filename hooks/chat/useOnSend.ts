import { doc, setDoc } from "firebase/firestore";
import { useCallback } from "react";
import { IMessage } from "react-native-gifted-chat";
import { db } from "../../firebase";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Route } from "../../types/Route/Route";

export const useOnSend = useCallback((messages: IMessage[]) => {
  const route = useRoute<RouteProp<Route, 'Chat'>>()

  const { _id, createdAt ,text, user } = messages[0];
  setDoc(doc(db, "messages", String(_id)), {
    _id,
    createdAt,
    text,
    user,
    roomId: route.params?.roomId,
  });
}, []);
