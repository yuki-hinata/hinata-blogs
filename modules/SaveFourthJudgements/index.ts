import { setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Route } from '../../types/Route/Route'

type Props = {
  fourthAnswer: boolean;
  navigation: NativeStackScreenProps<Route, "YourRecommend">['navigation'];
  documentId: string;
}

export const saveFourthJudgements = async ({ navigation, fourthAnswer, documentId }: Props) => {
  const judgementsId = doc(db, "judgements", documentId);
  await setDoc(judgementsId, { fourthAnswer }, { merge: true }).then(() =>
    navigation.navigate("YourRecommend")
  );
};
