import { getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export const useRoomInfo = (roomId: string | undefined) => {
  const [groupNumber, setGroupNumber] = useState<string>('');

  useEffect(() => {
    const roomsRef = doc(db, 'Rooms', String(roomId))
    const fetchRooms = getDoc(roomsRef)
    fetchRooms.then((rooms) => {
      const roomsMemberlength = rooms.data()!.userIds;
      setGroupNumber(roomsMemberlength.length)
    })
  }, [])

  return {
    groupNumber
  }
}
