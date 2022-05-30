import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase"
import { enterRoomTime } from "../enterRoomTime";

export const Confirm = () => {
  const user = auth.currentUser;
  const userId = user?.uid;

  const roomId = query(
    collection(db, 'Rooms'),
    where('userIds', 'array-contains', userId),
  )
  getDocs(roomId).then((ids) => {
    ids.forEach((info) => {
      enterRoomTime(String(info.id))
    })
  })
}
