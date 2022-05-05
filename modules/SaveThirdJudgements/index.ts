import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Route } from '../../types/Route/Route'

type Props = {
  navigation: NativeStackScreenProps<Route, "FourthJudgements" | "YourRecommend">['navigation'];
  thirdAnswer: boolean;
  documentId: string;
}

export const saveThirdJudgements = async ({ navigation, thirdAnswer, documentId }: Props) => {
  const judgements = doc(db, "judgements", documentId);
  await setDoc(judgements, { thirdAnswer }, { merge: true }).then(() =>
    navigation.navigate("YourRecommend")
  );
};
