import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";

type UseUserNickname = () => {
  data: undefined
  loading: true
} | {
  data: {
    icon: string
    nickname: string
  }
  loading: false
}
export const useUserNickname: UseUserNickname = () => {
  const user = auth.currentUser;
  const userId = user?.uid;
  const [nickname, setNickname] = useState<string>(); // これは消せる
  const [icon, setIcon] = useState<string>();
  const usersRef = doc(db, "users", String(userId));

  useEffect(() => {
    const findUserInfo = getDoc(usersRef);
    findUserInfo.then((user) => {
      setNickname(user.data()!.nickname); // 唯一setNickNameが呼ばれている
      setIcon(user.data()!.icon);
    }).catch((error) => {
      console.error(error);
    })
  }, [])

  if (!icon || !nickname) {
    return {
      data: undefined,
      loading: true
    }
  }

  return {
    data: {
      icon,
      nickname
    },
    loading: false
  }
}
