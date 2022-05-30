import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "native-base";
import React from "react"
import { View, StyleSheet, SafeAreaView } from "react-native"
import { ListItem } from 'react-native-elements'

// components
import { images } from "../../assets";
import { Route } from "../../types/Route/Route"
import { LoadingIndicator } from "../../ui/LoadingIndicator";
import { Header } from "../../ui/Header";
import { useRoomListItem } from "../../hooks/roomListItem/useRoomListItem";

import { auth } from "../../firebase/firebase";


type Props = NativeStackScreenProps<Route, 'Chat'>;

export const RoomList = ({ navigation }: Props) => {
  // roomListまでは表示できている。その後の切り出したnameとかを取ってくる処理で落ちている。というかファイル内を変更し、保存するとレンダリングされる
  const userId = auth.currentUser?.uid;

  const {
    roomListItem,
    loading
  } = useRoomListItem();

  const navigateChatScreen = (id: string) => {
    navigation.navigate('Chat', {
      roomId: id
    })
  }

  if (!loading) {
    return <LoadingIndicator />
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Header title="ルーム一覧" /> 
      </SafeAreaView>
      <View>
      {
        roomListItem.map((list, index) => (
          <ListItem key={index} onPress={() => navigateChatScreen(list.id)} bottomDivider>
            <Image size={70} borderRadius={100} margin={2} source={images.icon[list.handleName]} alt='No Image' />
            <ListItem.Content>
              <ListItem.Title style={styles.roomTitle}>{`${list.name}のチャットルーム (${list.memberCount})`}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          ))
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#C0C0C0',
    height: 80
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roomNumber: {
    fontSize: 18,
    paddingLeft: 16,
    paddingTop: 8
  }
})
