import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native"
import { Image, Input, Button } from "native-base";
import { DefaultButton } from "../../../ui/DefaultButton";
import { useUserNickname } from "../../../hooks/chat/useUserNickname";
import { imagePicker } from "../../../modules/ImagePicker";
import { getDownloadURL, ref } from "firebase/storage";
import { auth, db, fireStorage } from "../../../firebase/firebase";
import { generateUuid } from "../../../modules/GenerateUuid";
import { LoadingIndicator } from "../../../ui/LoadingIndicator";
import { displayActionSheet } from "../../../modules/images/displayActionSheet";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Route } from '../../../types/Route/Route';
import { useUpdateChatUser } from "../../../hooks/updateChatUser/useUpdateChatUser";

type Props = NativeStackScreenProps<Route, 'Chat'>;

export const UserEditScreen = ({ navigation }: Props) => {
  const autoId = generateUuid()
  const storageRef = ref(fireStorage, `user/${autoId}.jpg`)
  const {
    data,
    loading
  } = useUserNickname();
  const {
    messagesIds
  } = useUpdateChatUser();
  const userId = auth.currentUser?.uid;
  const messagesId = [...new Set(messagesIds)]

  // Imageのsourceには変数は入らない。なのでstateの初期値をセットすることはできない。新規登録でうまくできているのは初期値が文字列だから？
  // console.log(icon)
  const [newNickname, setNewNickname] = useState<string>();
  const [userIcon, setUserIcon] = useState<string | undefined>()
  console.log(userIcon)
  if (loading) {
    return <LoadingIndicator />
  }
  const {icon, nickname} = data

    // pickImageはuriをセットしアイコンの欄を更新したい。
  const pickImage = async () => {
    await imagePicker(storageRef)
    await getDownloadURL(storageRef)
      .then((uri) => {
        setUserIcon(uri)
      })
  }

  const onChangeIcon = () => displayActionSheet(pickImage)

  const updateUserInformation = async () => {
    await setDoc(doc(db, 'users', String(userId)), {
      nickname: newNickname,
      icon: userIcon,
      createdAt: serverTimestamp()
    }, { merge: true })
    .then(() => {
      messagesId.map((users) => {
        setDoc(doc(db, 'messages', users), {
          user:  {
            _id: userId,
            avatar: userIcon,
            name: newNickname
          }
        }, { merge: true })
        .then(() => {
          navigation.goBack()
        })
        .catch((error) => {
          console.log(error)
        })
      })
    })
    .catch(() => Alert.alert('更新失敗', 'ユーザー情報の更新に失敗しました。', [
      {
        text: 'OK',
      }
    ]))
  }

  // consoleが出ないのはuserが更新されていないから。
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>現在のニックネーム</Text>
      <Input w="95%" placeholder={nickname} onChangeText={setNewNickname} value={newNickname} />
      <Text style={styles.text}>現在のアイコン</Text>
      <View style={styles.subContainer}>
        {userIcon ? (
          <Image
          size={150}
          borderRadius={100}
          source={{ uri: userIcon }}
          alt="Default User"
        />
        ) : (
          <Image
          size={150}
          borderRadius={100}
          source={{ uri: icon }}
          alt="Default User"
        />
        )}
      </View>
      <View style={styles.button}>
        <Button onPress={onChangeIcon}>アイコンを設定する</Button>
        <View>
          <DefaultButton onPress={updateUserInformation}>更新する</DefaultButton>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 8 },
  subContainer: { alignItems: "center" },
  text: {
    paddingVertical: 24,
    fontWeight: "bold",
    fontSize: 16,
    color: "#7B8D93",
  },
  button: { paddingTop: 24 },
});
