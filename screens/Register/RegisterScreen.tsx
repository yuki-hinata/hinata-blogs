import React, { useState } from 'react'
import { View, Text, StyleSheet, ActionSheetIOS, Alert } from 'react-native'
import { Input, Image, Button, FormControl } from 'native-base'
import { DefaultButton } from '../../ui/defaultButton'
import * as ImagePicker from 'expo-image-picker'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db, fireStorage } from '../../firebase'
import { collection, addDoc } from '@firebase/firestore'
import { getDownloadURL, ref, uploadBytes, uploadString } from '@firebase/storage'

export const RegisterScreen = () => {
  const [defaultIcon, setDefaultIcon] = useState('https://wallpaperaccess.com/full/317501.jpg')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true
    })
    
    // 途中でキャンセル処理が行われなかった場合、写真が更新される。
    if (!result.cancelled) {
      const response = await fetch(result.uri)
      const Blob = await response.blob();
      const Ref = ref(fireStorage, `user/${email}.jpg`)
      const upload =  uploadBytes(Ref, Blob)
      setDefaultIcon(result.uri)
    }

  }

  const onChangeIcon = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['キャンセル', '写真を選択'],
        cancelButtonIndex: 0
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          pickImage()
        }
      }
    )

  const handleSubmit = async() => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      const docRef = await addDoc(collection(db, 'users'), {
        nickname: nickname,
        icon: defaultIcon
      })
    } catch (error: any) {
      switch(error.code) {
        case 'auth/email-already-in-use':
          Alert.alert('使用済みメールアドレス', '入力されたメールアドレスはすでに使用されています。')
          break
        case 'auth/invalid-email':
          Alert.alert('無効なメールアドレス', '正しい形式のメールアドレスを入力してください。')
          break
        case 'auth/weak-password':
          Alert.alert('無効なパスワード', '６文字以上の文字列を指定してください。')
          break
        default:
          Alert.alert('アカウントの作成に失敗しました。', '一度アプリを閉じるか、通信状況を確認してください。')
      } 
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.text}>メールアドレス</Text>
          <Input w='95%' keyboardType='email-address' onChangeText={setEmail} value={email} />
        <Text style={styles.text}>パスワード</Text>
          <Input type='password' w='95%' onChangeText={setPassword} value={password} />
        <Text style={styles.text}>ニックネーム</Text>
          <Input w='95%' onChangeText={setNickname} value={nickname} />
        <Text style={styles.text}>アイコンの登録</Text>
    </View>
    <View style={styles.subContainer}>
        {defaultIcon && <Image size={150} borderRadius={100} source={{ uri: defaultIcon }} alt="Default User" />}
    </View>
    <View style={styles.container}>
      <Button title='ChangeIcon' onPress={onChangeIcon}>アイコンを設定する</Button>
    <View style={styles.button}>
      <DefaultButton onPress={handleSubmit}>登録する</DefaultButton>
    </View>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8
  },
  subContainer: {
    alignItems: 'center'
  },
  text: {
    paddingVertical: 24,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#7B8D93'
  },
  button: {
    paddingTop: 24
  }
})
