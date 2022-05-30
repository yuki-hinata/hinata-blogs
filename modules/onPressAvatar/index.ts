import { query, collection, where, getDocs } from "firebase/firestore";
import { Alert } from "react-native";
import { User } from "react-native-gifted-chat";
import { db } from "../../firebase/firebase";

// asyncはいらないかも
export const onPressAvatar = async (props: User) => {
  const avatarUserId = props._id;
  const findEqualUserId = query(collection(db, 'messages'), where('user._id', '==', avatarUserId))
  getDocs(findEqualUserId)
    .then((id) => {
      Alert.alert('メッセージ数', `今まで送ったメッセージは${id.size}です。`)})
    .catch((error) => console.error(error))
}
