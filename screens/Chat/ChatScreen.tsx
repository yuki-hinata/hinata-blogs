import {
  doc,
  query,
  collection,
  where,
  getDocs,
  addDoc,
  orderBy,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useState, useCallback, useEffect } from "react";
import { Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Actions, GiftedChat, IMessage, User } from "react-native-gifted-chat";
import { auth, db, fireStorage } from "../../firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import "dayjs/locale/ja";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { displayActionSheet } from "../../modules/images/displayActionSheet";
import { Route } from '../../types/Route/Route';

// components
import { LoadingIndicator } from "../../ui/LoadingIndicator";
import { useUserNickname } from "../../hooks/chat/useUserNickname";
import { useEnterTime } from "../../hooks/chat/useEnterTime";
import { MessageBubble } from '../../components/Chat/MessageBubble';
// import { onSend } from '../../hooks/chat/useOnSend';
import { ChatSendButton } from '../../ui/ChatSendButton';
import { GenerateUuid } from '../../modules/GenerateUuid'

type Props = NativeStackScreenProps<Route, "Chat">;

export const Chat = ({ navigation, route }: Props) => {
  /**
   * useStateをコンポーネントに書くこと自体をできるだけ減らすのがいい
   * →カスタムフック
   */
  const [messages, setMessages] = useState<IMessage[]>([]);

/**
 * useStateしたい状態変数と、それを取得するロジックをまとめてuseHogeに入れ込む
 * まとめてReturnされたものを、コンポーネントで受け取ってただ単に表示するなどに使う
 */
  const {
    nickname,
    icon
  } = useUserNickname()

  const {
    addTime
  } = useEnterTime()

  const [name, setName] = useState("");
  const user = auth.currentUser;
  const userId = user?.uid;

  // 以下の基本的な切り出しが一通り終わったらカスタムフックの切り出しについて教えます
  // 切り出し可能
  const generateUuid = () => {
    const chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
      switch (chars[i]) {
        case "x":
          chars[i] = Math.floor(Math.random() * 16).toString(16);
          break;
        case "y":
          chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
          break;
      }
    }
    return chars.join("");
  };

  const chatIconRef = ref(fireStorage, `messages/${GenerateUuid}.jpg`)

  // 以下の処理はuseEffect内に入れるかな
  useEffect(() => {
    const docs = query(
      collection(db, "YourRecommend"),
      where("userIds", "array-contains", userId)
    );
    getDocs(docs).then((names) => {
      names.forEach((name) => {
        setName(name.data().name);
      });
    });
  }, [])

  // システムメッセージの表示の下地。一旦無視
  // useEffect(() => {
  //   const unsub = onSnapshot(docs, (q) => {
  //     q.docChanges().forEach((change) => {
  //       if (change.type === 'added' || 'modified') {
  //         q.docs.map((w) => {
  //           const array = w.data().userIds.slice(-1)[0];
  //           const refsUser = doc(db, 'users', String(array))
  //           const findNickName = getDoc(refsUser)
  //         })
  //       }
  //     })
  //   })

  //   return () => {
  //     unsub()
  //   }
  // }, [])
  
  // useEffect内をまとめてloadMessage()といった関数で切り出し可能
  useEffect(() => {
    if (name) {
      navigation.setOptions({ title: `${name}のチャットルーム` });
    }
    
    const fetchMessages = query(
      collection(db, "messages"),
      where("roomId", "==", route.params?.roomId),
      where('createdAt', '>', addTime),
      orderBy("createdAt", "desc")
    );

      const setChatMessages = onSnapshot(fetchMessages, (snap) => {
        snap.docChanges().forEach((change) => {
          if (change.type === "added" || "modified") {
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
  }, [name]);

  const pickImage = async () => {
    const chatImages = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0,
      allowsEditing: true,
    });
    // ここから上は切り出し可能

    if (!chatImages.cancelled) {
      // ここから下の切り出しはWant
      const fetchUri = await fetch(chatImages.uri);
      const blob = await fetchUri.blob();
      await uploadBytes(chatIconRef, blob)
      await getDownloadURL(chatIconRef)
        .then((url) => {
          addDoc(collection(db, "messages"), {
            _id: GenerateUuid,
            createdAt: serverTimestamp(),
            user: {
              _id: userId,
              avatar: icon,
              name: nickname
            },
            image: url,
            roomId: route.params?.roomId
        })
      })
    }
  };

  const onPressActionButton = () => displayActionSheet(pickImage)

  const onSend = useCallback((messages: IMessage[]) => {    
      const { _id, createdAt ,text, user } = messages[0];
      setDoc(doc(db, "messages", String(_id)), {
        _id,
        createdAt,
        text,
        user,
        roomId: route.params?.roomId,
      });
    }, []);

  const onPressAvatar = async (props: User) => {
    const avatarUserId = props._id;
    const findEqualUserId = query(collection(db, 'messages'), where('user._id', '==', avatarUserId))
    getDocs(findEqualUserId)
      .then((id) => {
        Alert.alert('メッセージ数', `今まで送ったメッセージは${id.size}です。`)})
      .catch((error) => console.error(error))
  }
  
  return (
    <GiftedChat
      messages={messages}
      placeholder='メッセージを入力'
      onSend={onSend}
      showUserAvatar={true}
      renderSend={ChatSendButton}
      renderBubble={MessageBubble}
      alwaysShowSend={true}
      renderActions={() => {
        return (
          <Actions icon={() => <Icon name='image' color='#3CD9D9' size={24} />} onPressActionButton={onPressActionButton} />
        )
      }}
      user={{
        _id: userId!,
        name: nickname,
        avatar: icon,
      }}
      locale='ja'
      renderAvatarOnTop={true}
      onPressAvatar={onPressAvatar}
      />
  );
};
