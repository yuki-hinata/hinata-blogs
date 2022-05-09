import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "native-base";
import React from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { images } from "../../assets";
import { useRoomInfo } from "../../hooks/roomLsit/useRoomInfo";
import { useRoomName } from "../../hooks/roomLsit/useRoomName";
import { GenerateUuid } from "../../modules/GenerateUuid";

// components
import { Route } from "../../types/Route/Route"
import { LoadingIndicator } from "../../ui/LoadingIndicator";

type Props = NativeStackScreenProps<Route, 'RoomList' | 'Chat'>;

type List = {
  name: string,
  id: string,
  groupNumber: string
} 
export const RoomList = ({ route, navigation }: Props) => {
  const roomId = route.params?.roomId;
  const autoId = GenerateUuid()
  console.log(roomId)

  const {
    name,
    handleName
  } = useRoomName(roomId)

  const {
    groupNumber
  } = useRoomInfo(roomId)

    const list: List[] = [
      {
        id: autoId,
        name,
        groupNumber
      }
    ]

    const onPress = () => {
      navigation.navigate('Chat', {
        roomId: route.params?.roomId
      })
    }

    if (!handleName || !groupNumber) {
      return <LoadingIndicator />
    }

    const roomList = ({ item }: { item: List }) => {
      return (
        <TouchableOpacity onPress={onPress} style={styles.item}>
          <Image size={60} borderRadius={100} margin={2} source={images.icon[handleName]} alt='No Image' />
          <Text style={styles.roomTitle}>{`${item.name}のルーム`}</Text>
          <Text style={styles.roomNumber}>{`（${item.groupNumber}）`}</Text>
        </TouchableOpacity>
      )
    }

  return (
    <View style={styles.container}>
      <FlatList data={list} renderItem={roomList} keyExtractor={items => items.id} />
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
    paddingLeft: 16,
    paddingTop: 8
  },
  roomNumber: {
    fontSize: 18,
    paddingLeft: 16,
    paddingTop: 8
  }
})
