import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { Image } from "native-base";

// components
import { DefaultButton } from "../../ui/DefaultButton"
import { Route } from '../../types/Route/Route';
import { createYourRecommend } from "../../modules/CreateYourSecondRecommend/createYourRecommend";
import { db, auth } from "../../firebase/firebase";
import { images } from "../../assets";
import { LoadingIndicator } from "../../ui/LoadingIndicator";

type Props = NativeStackScreenProps<Route, 'SecondYourRecommendScreen'>;

export const SecondYourRecommendScreen = ({ navigation, route }: Props) => {
  const [name, setName] = useState<string>();
  const [handleName, setHandleName] = useState<keyof typeof images.icon>()
  const {
    secondId
  } = createYourRecommend(Number(route.params?.id));
  const userId = auth.currentUser?.uid;
  console.log(secondId);

  const roomsRef = doc(db, 'Rooms', String(secondId))
  getDoc(roomsRef).then((name) => {
    setName(name.data()?.name)
    setHandleName(name.data()?.handleName)
  })

  console.log(name);
  console.log(handleName);

  if (!handleName) {
    return <LoadingIndicator />
  }

  const navigateChatConfirm = () => {
    navigation.navigate('ConfirmChat', {
      id: route.params?.id
    });
  }

  const onSelectSecondRecommendMan = async () => {
    await setDoc(doc(db, 'Rooms', String(secondId)), {
      userIds: arrayUnion(userId)
    }, { merge: true })
    navigateChatConfirm()
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>オススメの推しメン</Text>
      <Text style={styles.subTitle}>あなたにオススメの推しメンは{name}です！</Text>
      <Image size={200} source={images.icon[handleName]} alt="No Image" />
      <DefaultButton onPress={() => onSelectSecondRecommendMan()}>気になるメンバーにする！</DefaultButton>
      <DefaultButton onPress={() => navigateChatConfirm()}>気になるメンバーにしない！</DefaultButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: { fontSize: 35, fontWeight: "bold", padding: 10, color: "#7B8D93" },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16
  }
})
