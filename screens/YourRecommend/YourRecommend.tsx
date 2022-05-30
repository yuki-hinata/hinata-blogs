import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DefaultButton } from "../../ui/DefaultButton";
import { images } from "../../assets/index";
import { Image } from "native-base";
import { arrayUnion, collection, doc, query, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { createYourRecommend } from "../../modules/CreateYourSecondRecommend/createYourRecommend";
import { LoadingIndicator } from "../../ui/LoadingIndicator";

type Props = {
  name: string;
  id: string;
  handleName: keyof typeof images.icon;
  againJudgements: () => void;
  navigateChatConfirm: (id: string) => void;
};

export const YourRecommend: React.FC<Props> = (props) => {
  const user = auth.currentUser;
  const userId = user?.uid;
  
  const {
    name,
    secondId,
    handleName
  } = createYourRecommend(Number(props.id));

  if (!name || !handleName) {
    return <LoadingIndicator />
  }

  const decideRecommendMan = async () => {
    const roomsRef = doc(db, "Rooms", String(props.id));
    const secondRoomsRef = doc(db, 'Rooms', String(secondId));
    await setDoc(
      roomsRef,
      { userIds: arrayUnion(userId), name: props.name, handleName: props.handleName },
      { merge: true }
    )
    await setDoc(
      secondRoomsRef,
      { name, handleName }, { merge: true }
    ).then(() => {
      props.navigateChatConfirm(props.id);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>推しメン診断結果</Text>
      <Image size={200} source={images.icon[props.handleName]} alt="No Image" />
      <Text style={styles.text}>あなたの推しメンは{props.name}です！</Text>
      <DefaultButton onPress={decideRecommendMan}>
        この推しメンに決定する
      </DefaultButton>
      <DefaultButton onPress={props.againJudgements}>
        再診断を行う
      </DefaultButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold", padding: 16 },
  title: { fontSize: 40, fontWeight: "bold", padding: 10, color: "#7B8D93" },
});
