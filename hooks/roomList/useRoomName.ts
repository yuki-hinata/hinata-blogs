import { getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { images } from "../../assets";
import { db } from "../../firebase";

export const useRoomName = (roomId: string | undefined) => {
  const [name, setName] = useState<string>('');
  const [handleName, setHandleName] = useState<keyof typeof images.icon>();

  useEffect(() => {
    const recomenRef = doc(db, 'YourRecommend', String(roomId))
    const fetchRecomen = getDoc(recomenRef)
    fetchRecomen.then((name) => {
      setName(name.data()!.name);
      setHandleName(name.data()!.handleName);
    })
  }, [])

  return {
    name,
    handleName
  }
}
