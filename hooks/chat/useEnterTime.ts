import React, { useEffect, useState } from "react"
import { query, collection, where, getDocs } from "firebase/firestore"
import { auth, db } from "../../firebase/firebase"

export const useEnterTime = (id: string | undefined) => {
  const [addTime, setAddTime] = useState<Date>(new Date)
  const userId = auth.currentUser?.uid

  useEffect(() => {
    console.log('useenterTimeの下')
    const addTimer = async () => {
      const fetchEnterRoomTime = query(
        collection(db, 'enterRoomTime'),
        where('userId', '==', userId),
        where('roomId', '==', id)
      )
      await getDocs(fetchEnterRoomTime).then((times) => {
        times.forEach((time) => {
          setAddTime(time.data({ serverTimestamps: 'estimate' }).createdAt)
        })
      }).catch((error) => {
        console.log(error);
      })
    }
    addTimer()
  }, [id])

  return {
    addTime
  }
}
