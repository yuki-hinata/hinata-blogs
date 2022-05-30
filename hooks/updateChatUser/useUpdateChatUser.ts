import { query, collection, where, documentId, onSnapshot, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db, auth } from "../../firebase/firebase"

export const useUpdateChatUser = () => {
  const userId = auth.currentUser?.uid;
  const [messagesIds, setMessagesIds] = useState<string[]>([])

  useEffect(() => {
    const collectUser = query(collection(db, 'users'), where(documentId(), '==', String(userId)))
    const updateChatUser = onSnapshot(collectUser, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          const collectMessages = query(collection(db, 'messages'), where('user._id', '==', userId))
          getDocs(collectMessages).then((info) => {
          info.docs.map((i) => {
            setMessagesIds(id => [...id, i.data()._id])
          })
        })
      }
    })
  })

    return () => {
      updateChatUser()
    }
  }, [])

  return {
    messagesIds
  }
}
