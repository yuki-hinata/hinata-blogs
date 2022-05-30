import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { Input, Image, Button } from "native-base";
import { DefaultButton } from "../../ui/DefaultButton";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, fireStorage } from "../../firebase/firebase";
import { serverTimestamp } from "@firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { setDoc, doc } from "firebase/firestore";
import { displayActionSheet } from "../../modules/images/displayActionSheet";
import { Route } from '../../types/Route/Route'
import { createExpoPushToken } from "../../modules/CreateExpoPushToken";
import { generateUuid } from "../../modules/GenerateUuid";
import { imagePicker } from '../../modules/ImagePicker'

type Props = NativeStackScreenProps<Route, "FirstJudgements">;

export const RegisterScreen = ({ navigation }: Props) => {
  const [defaultIcon, setDefaultIcon] = useState(
    "https://wallpaperaccess.com/full/317501.jpg"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [token, setToken] = useState<any>('')
  const autoId = generateUuid()
  const userRef = ref(fireStorage, `user/${email}.jpg`);

  // メアドが使われている場合などバリデーションエラーに引っかかった場合、メアドを変更したあと再度アイコンも変えなければ、新規登録ができない。
  const pickImage = async () => {
    await imagePicker(userRef)
    await getDownloadURL(userRef)
      .then((url) => {
        console.log(url)
        setDefaultIcon(url)
      })
  };

  useEffect(() => {
    createExpoPushToken().then((token) => {
      setToken(token)
    })
  }, [])

// ここの関数も切り出し可能
  const onChangeIcon = () => displayActionSheet(pickImage)

  // resetのindexにはどの程度前のStackを消すかを設定する。
  const handleSubmit = async () => {
    try {
      // なぜここでgetDownLoadしているかというとurlがほしいから。
      await getDownloadURL(userRef)
        .then((url) => {
          createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
              // authでuidを生成しているので、この中でuidを取得しなければundefinedになる。
              const userId = auth.currentUser?.uid;
              setDoc(doc(db, "users", String(userId)), {
                nickname: nickname,
                icon: defaultIcon,
                createdAt: serverTimestamp(),
                expoPushToken: token.token
              }, { merge: true }),
              navigation.reset({
                index: 1,
                routes: [{ name: 'JudgementsNavigator' }],
              })
              navigation.navigate('JudgementsNavigator', {
                screen: 'FirstJudgements'
              })
            })
            .catch((error) => {
              console.error(error)
              switch (error.code) {
                case "auth/email-already-in-use":
                  Alert.alert(
                    "使用済みメールアドレス",
                    "入力されたメールアドレスはすでに使用されています。"
                  );
                  break;
                case "auth/invalid-email":
                  Alert.alert(
                    "無効なメールアドレス",
                    "正しい形式のメールアドレスを入力してください。"
                  );
                  break;
                case "auth/weak-password":
                  Alert.alert(
                    "無効なパスワード",
                    "６文字以上の文字列を指定してください。"
                  );
                  break;
                default:
                  Alert.alert(
                    "アカウントの作成に失敗しました。",
                    "一度アプリを閉じるか、通信状況を確認してください。"
                  );
              }
            });
        })
        .catch((error) => {
          switch (error.code) {
            case "storage/object-not-found":
              Alert.alert(
                "アイコンの保存に失敗しました",
                "再度アイコンの設定をしてください。"
              );
          }
        });
    } catch (error: any) {
      Alert.alert("予期せぬエラー", "通信環境を確認してください。");
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.text}>メールアドレス</Text>
        <Input
          w="95%"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
        <Text style={styles.text}>パスワード</Text>
        <Input
          type="password"
          w="95%"
          onChangeText={setPassword}
          value={password}
        />
        <Text style={styles.text}>ニックネーム</Text>
        <Input w="95%" onChangeText={setNickname} value={nickname} />
        <Text style={styles.text}>アイコンの登録</Text>
      </View>
      <View style={styles.subContainer}>
        {defaultIcon && (
          <Image
            size={150}
            borderRadius={100}
            source={{ uri: defaultIcon }}
            alt="Default User"
          />
        )}
      </View>
      <View style={styles.container}>
        <Button title="ChangeIcon" onPress={onChangeIcon}>
          アイコンを設定する
        </Button>
        <View style={styles.button}>
          <DefaultButton onPress={handleSubmit}>登録する</DefaultButton>
        </View>
      </View>
    </ScrollView>
  );
};

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
