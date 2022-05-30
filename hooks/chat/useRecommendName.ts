import { query, collection, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";

// collectionでなくていい。引数で該当の部屋番号を渡す
export const useRecommendName = () => {
  const user = auth.currentUser;
  const userId = user?.uid;
  const arrayRoomId: string[] = [];
  const [recommendIds, setRecommendIds] = useState<string[]>();

  useEffect(() => {
    const fetchRecommendIds = async () => {
      console.log(userId);
      const roomId = query(
        collection(db, 'YourRecommend'),
        where('userIds', 'array-contains', userId),
      )
      await getDocs(roomId).then((ids) => {
        ids.forEach((info) => {
          console.log(info.data().name)
          arrayRoomId.push(info.id)
          setRecommendIds(arrayRoomId)
        })
      })
    }
    fetchRecommendIds()
  }, [])

  return {
    recommendIds,
  }
}
