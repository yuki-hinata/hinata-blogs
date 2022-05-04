import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Input, Image, Button } from "native-base";
import { DefaultButton } from "../../ui/DefaultButton";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, fireStorage } from "../../firebase";
import { serverTimestamp } from "@firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { setDoc, doc } from "firebase/firestore";
import { displayActionSheet } from "../../modules/images/displayActionSheet";
import { Route } from '../../types/Route/Route'

type Props = NativeStackScreenProps<Route, "FirstJudgements">;

export const RegisterScreen = ({ navigation }: Props) => {
  const [defaultIcon, setDefaultIcon] = useState(
    "https://wallpaperaccess.com/full/317501.jpg"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  // 大きな課題を孕んでいる。これではユーザーの意図していない画像が表示されてしまう可能性がある(2回目)。改善が必要。
  const userRef = ref(fireStorage, `user/${email}.jpg`);

  // メアドが使われている場合などバリデーションエラーに引っかかった場合、メアドを変更したあと再度アイコンも変えなければ、新規登録ができない。
  const pickImage = async () => {
    // ここから↓5行ほど切り出し可能
    const userIcon = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0,
      allowsEditing: true,
    });

    // 途中でキャンセル処理が行われなかった場合、写真が更新される。
    if (!userIcon.cancelled) {
      const response = await fetch(userIcon.uri);
      const Blob = await response.blob();
      await uploadBytes(userRef, Blob);
      setDefaultIcon(userIcon.uri);
    }
  };

// ここの関数も切り出し可能
  const onChangeIcon = () => displayActionSheet(pickImage)

  const handleSubmit = async () => {
    try {
      await getDownloadURL(userRef)
        .then((url) => {
          createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
              const user = auth.currentUser;
              const userId = user?.uid;
              setDoc(doc(db, "users", userId!), {
                nickname: nickname,
                icon: url,
                createdAt: serverTimestamp(),
              }),
                navigation.navigate("FirstJudgements");
            })
            .catch((error) => {
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
                "画像の保存に失敗しました",
                "再度登録を行ってください。"
              );
          }
        });
    } catch (error: any) {
      Alert.alert("予期せぬエラー", "通信環境を確認してください。");
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
    </View>
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
