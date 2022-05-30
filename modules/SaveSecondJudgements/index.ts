import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { doc, setDoc } from "firebase/firestore";
import { Route } from "../../types/Route/Route";
import { db } from "../../firebase/firebase";

type Props = {
  secondAnswer: boolean;
  navigation: NativeStackScreenProps<Route, "ThirdJudgements">['navigation'];
  documentId: string;
}

export const saveSecondJudgements = async ({ secondAnswer, navigation, documentId }: Props) => {
  const judgements = doc(db, "judgements", documentId);
  await setDoc(judgements, { secondAnswer }, { merge: true })
    .then(() => navigation.navigate("ThirdJudgements"))
    .catch((error) => console.error(error));
};
