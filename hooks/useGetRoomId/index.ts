import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { images } from "../../assets";
import { db } from "../../firebase/firebase"

export const useGetRoomId = (id: string | undefined) => {
  const [name, setName] = useState<string>();
  const [handleName, setHandleName] = useState<keyof typeof images.icon>();

  const roomsRef = doc(db, 'Rooms', String(id))
  const findRoomInfo = getDoc(roomsRef)
  findRoomInfo.then((info) => {
    setName(info.data()?.name)
    setHandleName(info.data()?.handleName)
  })

  return {
    name,
    handleName
  }
}
