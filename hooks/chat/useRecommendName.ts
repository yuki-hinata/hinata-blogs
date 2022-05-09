import { query, collection, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";

export const useRecommendName = () => {
  const user = auth.currentUser;
  const userId = user?.uid;
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const docs = query(
      collection(db, "YourRecommend"),
      where("userIds", "array-contains", userId)
    );
    getDocs(docs).then((names) => {
      names.forEach((name) => {
        setName(name.data().name);
      });
    });
  }, [])

  return {
    name
  }
}
