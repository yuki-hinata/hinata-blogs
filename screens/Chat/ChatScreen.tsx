import {
  doc,
  query,
  collection,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useCallback } from "react";
import { Alert, Button } from "react-native";
import { Actions, GiftedChat, IMessage, User } from "react-native-gifted-chat";
import { auth, db, fireStorage } from "../../firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import "dayjs/locale/ja";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { getDownloadURL, ref } from "firebase/storage";
import { displayActionSheet } from "../../modules/images/displayActionSheet";
import { Route } from '../../types/Route/Route';

// components
import { LoadingIndicator } from "../../ui/LoadingIndicator";
import { useUserNickname } from "../../hooks/chat/useUserNickname";
import { MessageBubble } from '../../components/Chat/MessageBubble';
import { ChatSendButton } from '../../ui/ChatSendButton';
import { GenerateUuid } from '../../modules/GenerateUuid'
import { imagePicker } from "../../modules/ImagePicker";
import { showMessage } from "../../components/Chat/ShowMessage";

type Props = NativeStackScreenProps<Route, "Chat" | 'RoomList'>;

export const Chat = ({ navigation, route }: Props) => {
  /**
   * useStateをコンポーネントに書くこと自体をできるだけ減らすのがいい
   * →カスタムフック
   */

/**
 * useStateしたい状態変数と、それを取得するロジックをまとめてuseHogeに入れ込む
 * まとめてReturnされたものを、コンポーネントで受け取ってただ単に表示するなどに使う
 */
  const {
    nickname,
    icon
  } = useUserNickname()

  const user = auth.currentUser;
  const userId = user?.uid;

  // 以下の基本的な切り出しが一通り終わったらカスタムフックの切り出しについて教えます
  // 切り出し可能
  const uuid = GenerateUuid()

  const chatIconRef = ref(fireStorage, `messages/${uuid}.jpg`)

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
  
  const { messages } = showMessage(navigation, route);

  navigation.setOptions({ headerLeft: () => (
    <Button
      // eslint-disable-next-line react/prop-types
      onPress={() => {navigation.navigate('RoomList', {
        roomId: route.params?.roomId 
      })}}
      title="戻る"
      color="black"
    />
  ),
  })

  const pickImage = async () => {
    await imagePicker(chatIconRef)
    await getDownloadURL(chatIconRef)
      .then((url) => {
        addDoc(collection(db, "messages"), {
          _id: uuid,
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
  };

  const onPressActionButton = () => displayActionSheet(pickImage)

  // 下書きで書いてあるが、それを使うとメッセージが表示されないなどうまくできず。
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
