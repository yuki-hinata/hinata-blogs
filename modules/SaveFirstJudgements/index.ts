import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { Route } from '../../types/Route/Route'

type Props = {
  navigation: NativeStackScreenProps<Route, "SecondJudgements">['navigation'];
  firstAnswer: boolean
}

export const saveFirstJudgements = async ({ navigation, firstAnswer }: Props) => {
  const user = auth.currentUser;
  const userId = user?.uid;
  await addDoc(collection(db, "judgements"), { userId, firstAnswer }).then(
    () => navigation.navigate("SecondJudgements")
  );
};
