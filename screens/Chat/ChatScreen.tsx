/* eslint-disable react/prop-types */
import {
  doc,
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useCallback } from "react";
import { Button } from "react-native";
import { Actions, GiftedChat, IMessage } from "react-native-gifted-chat";
import { auth, db, fireStorage } from "../../firebase/firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { getDownloadURL, ref } from "firebase/storage";
import { displayActionSheet } from "../../modules/images/displayActionSheet";
import { Route } from '../../types/Route/Route';

// components
import { useUserNickname } from "../../hooks/chat/useUserNickname";
import { MessageBubble } from '../../components/Chat/MessageBubble';
import { ChatSendButton } from '../../ui/ChatSendButton';
import { generateUuid } from '../../modules/GenerateUuid'
import { imagePicker } from "../../modules/ImagePicker";
import { showMessage } from "../../components/Chat/ShowMessage";
import { onPressAvatar } from '../../modules/onPressAvatar';
import { LoadingIndicator } from "../../ui/LoadingIndicator";

type Props = NativeStackScreenProps<Route, 'RoomList'>;

export const Chat = ({ navigation, route }: Props) => {
  /**
   * useStateをコンポーネントに書くこと自体をできるだけ減らすのがいい
   * →カスタムフック
   */

/**
 * useStateしたい状態変数と、それを取得するロジックをまとめてuseHogeに入れ込む
 * まとめてReturnされたものを、コンポーネントで受け取ってただ単に表示するなどに使う
 */
  

const user = auth.currentUser;
const userId = user?.uid;

const uuid = generateUuid();

const chatIconRef = ref(fireStorage, `messages/${uuid}.jpg`)

const { messages } = showMessage(navigation, route);

navigation.setOptions({ headerLeft: () => (
  <Button
  // eslint-disable-next-line react/prop-types
  onPress={() => {navigation.navigate('TabNavigator')}}
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
      text: "画像が送信されました。",
      image: url,
      roomId: route.params?.roomId
    })
  })
};

const onPressActionButton = () => displayActionSheet(pickImage)

// 下書きで書いてあるが、それを使うとメッセージが表示されないなどうまくできず。
const onSend = useCallback((messages: IMessage[]) => {
  const { _id, createdAt, text, user } = messages[0];
  setDoc(doc(db, "messages", String(_id)), {
    _id,
    createdAt,
    text,
    user,
    roomId: route.params?.roomId,
  });
}, [route.params?.roomId]);

const {
  data,
  loading
} = useUserNickname();
if (loading) {
  return <LoadingIndicator />
}
const {icon, nickname} = data;
console.log(icon)
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
