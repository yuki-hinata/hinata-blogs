import { doc, DocumentData, Firestore, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { allCollectionName } from "../allDocName";

type Props = {
  db: Firestore,
  path: keyof typeof allCollectionName.collection,
  pathSegments: string[]
}

export const getDocument = ({ db, path, pathSegments }: Props) => {
  const [datas, setDatas] = useState<DocumentData | undefined>()
  const docsRef = doc(db, path, ...pathSegments);

  useEffect(() => {
    const findUserInfo = getDoc(docsRef);
    findUserInfo.then((user) => {
      setDatas(user.data())
    });
  }, [])

  return {
    datas
  }
}
