import { query, collection, where, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import { images } from "../../assets"
import { db, auth } from "../../firebase/firebase"

type RoomInformation = 
  {
    name: string,
    id: string,
    memberCount: number | undefined,
    handleName: keyof typeof images.icon,
  }

type RoomListItem = () => {
  roomListItem: undefined
  loading: false
} | {
  roomListItem: RoomInformation[]
  loading: true
}

export const useRoomListItem: RoomListItem = () => {
  const [roomListItem, setRoomListItem] = useState<RoomInformation[]>([]);
  const user = auth.currentUser;
  const userId = user?.uid;
  console.log(userId)

  useEffect(() => {
    setRoomListItem([])
    const roomListItem = async () => {
      if (!userId) {
        return
      }
      const collectUserBelongsRoom = query(collection(db, 'Rooms'), where('userIds', 'array-contains', userId))
        await getDocs(collectUserBelongsRoom).then((belongsRoom) => {
        belongsRoom.docs.map((roomInformation) => {
          setRoomListItem(item => [...item, {
            name: roomInformation.data().name,
            id: roomInformation.id,
            memberCount: roomInformation.data().userIds.length,
            handleName: roomInformation.data().handleName,
          }])
        })
      })
    }
    roomListItem()
  }, [userId]);

    if (!roomListItem) {
      return {
        roomListItem: undefined,
        loading: false
      }
    }

    return {
      roomListItem,
      loading: true
    }
}
