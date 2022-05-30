import { query, collection, where, orderBy, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { IMessage } from "react-native-gifted-chat";
import { db } from "../../firebase/firebase";
import { useEnterTime } from "../../hooks/chat/useEnterTime";
import { useGetRoomId } from "../../hooks/useGetRoomId";

export const showMessage = ( navigation: any, route: any ) => {
  // roomIdとかはnavigationのparamsを使用する。
  const { name } = useGetRoomId(route.params?.roomId)
  // こいつはwhereの条件を追加すればいい。
  const { addTime } = useEnterTime(route.params?.roomId);
  console.log(route.params?.roomId)
  const [messages, setMessages] = useState<IMessage[]>();
  
  useEffect(() => {
    setMessages([])
    const fetchMessages = query(
      collection(db, "messages"),
      where("roomId", "==", route.params?.roomId),
      where('createdAt', '>', addTime),
      orderBy("createdAt", "desc")
    );
    if (name) {
      navigation.setOptions({ title: `${name}のチャットルーム` });
    }
    const createMessages = onSnapshot(fetchMessages, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" || "modified") {
            console.log('message追加')
            const data = snapshot.docs.map(
              (doc) =>
                ({
                  _id: doc.data()._id,
                  createdAt: doc.data({ serverTimestamps: 'estimate' }).createdAt.toDate(),
                  image: doc.data().image,
                  text: !doc.data().image ? doc.data().text : "",
                  user: doc.data().user,
                } as IMessage)
              )
              setMessages(data)
            }
        });
      });
  
      return () => {
        createMessages();
      };
  }, [name, addTime]);

  return {
    messages
  }
}
