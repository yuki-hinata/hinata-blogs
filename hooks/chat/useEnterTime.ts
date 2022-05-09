import React, { useEffect, useState } from "react"
import { query, collection, where, getDocs } from "firebase/firestore"
import { auth, db } from "../../firebase"

export const useEnterTime = () => {
  const [addTime, setAddTime] = useState<Date>(new Date)
  const userId = auth.currentUser?.uid

  useEffect(() => {
    console.log('useenterTimeの下')
    const addTimer = async () => {
      const fetchEnterRoomTime = query(
        collection(db, 'enterRoomTime'),
        where('userId', '==', userId)
      )
      await getDocs(fetchEnterRoomTime).then((times) => {
        times.forEach((time) => {
          setAddTime(time.data({ serverTimestamps: 'estimate' }).createdAt)
        })
      })
    }
    addTimer()
  }, [])

  return {
    addTime
  }
}
