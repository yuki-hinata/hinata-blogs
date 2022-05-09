import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";

export const useUserNickname = () => {
  const user = auth.currentUser;
  const userId = user?.uid;
  const [nickname, setNickname] = useState<string>(""); // これは消せる
  const [icon, setIcon] = useState<string>();
  const usersRef = doc(db, "users", String(userId));

  useEffect(() => {
    console.log('useuserNicknameの下')
    const findUserInfo = getDoc(usersRef);
    findUserInfo.then((user) => {
      setNickname(user.data()!.nickname); // 唯一setNickNameが呼ばれている
      setIcon(user.data()!.icon);
    });
  }, [])

  return {
    icon,
    nickname
  }
}
