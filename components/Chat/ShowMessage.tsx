import { query, collection, where, orderBy, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { IMessage } from "react-native-gifted-chat";
import { db } from "../../firebase";
import { useEnterTime } from "../../hooks/chat/useEnterTime";
import { useRecommendName } from "../../hooks/chat/useRecommendName";

export const showMessage = ( navigation: any, route: any ) => {
  const { name } = useRecommendName();
  const { addTime } = useEnterTime();
  const [messages, setMessages] = useState<IMessage[]>();
  const fetchMessages = query(
    collection(db, "messages"),
    where("roomId", "==", route.params?.roomId),
    where('createdAt', '>', addTime),
    orderBy("createdAt", "desc")
  );

  useEffect(() => {
    if (name) {
      navigation.setOptions({ title: `${name}のチャットルーム` });
    }
    const setChatMessages = onSnapshot(fetchMessages, (snap) => {
        snap.docChanges().forEach((change) => {
          if (change.type === "added") {
            console.log('addedの中de')
            const data = snap.docs.map(
              (doc) =>
                ({
                  _id: doc.data()._id,
                  createdAt: doc.data({ serverTimestamps: 'estimate' }).createdAt.toDate(),
                  text: doc.data().text,
                  user: doc.data().user,
                  image: doc.data().image,
                } as IMessage)
              )
              setMessages(data)
            }
        });
      });
  
      return () => {
        setChatMessages();
      };
  }, [name, addTime]);

  return {
    messages
  }
}
