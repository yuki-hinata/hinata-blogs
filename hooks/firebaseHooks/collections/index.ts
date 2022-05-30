import { query, collection, where, getDocs, DocumentData, Firestore, FieldPath, WhereFilterOp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { allCollectionName } from '../allDocName';

type Props = {
  db: Firestore,
  fieldPath: string | FieldPath,
  opStr: WhereFilterOp,
  value: string | undefined,
  documentName: keyof typeof allCollectionName.collection
}

export const collections = ({ db, fieldPath, opStr, value, documentName }: Props) => {
  const [data, setData] = useState<DocumentData>();
  
  useEffect(() => {
    const fetchMember = async () => {
      const roomNumber = query(
        collection(db, documentName),
        where(fieldPath, opStr, value)
      )
      await getDocs(roomNumber).then((numbers) => {
        numbers.docs.map((number) => {
          setData(number.data())
        })
      })
    }
    fetchMember()
  }, [])

  return {
    data
  }
}
