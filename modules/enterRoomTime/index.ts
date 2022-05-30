import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db, auth } from "../../firebase/firebase"

export const enterRoomTime = async (id: string | undefined) => {
  await addDoc(collection(db, 'enterRoomTime'), {
    userId: auth.currentUser?.uid,
    roomId: id,
    createdAt: serverTimestamp(),
  })
}
