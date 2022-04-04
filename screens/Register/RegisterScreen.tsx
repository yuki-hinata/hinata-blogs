import React, { useState } from 'react'
import { View, Text, StyleSheet, ActionSheetIOS } from 'react-native'
import { Input, Image, Button } from 'native-base'
import { DefaultButton } from '../../ui/defaultButton'
import * as ImagePicker from 'expo-image-picker'

export const RegisterScreen = () => {
  const [defaultIcon, setDefaultIcon] = useState('https://wallpaperaccess.com/full/317501.jpg')

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true
    })

    if (!result.cancelled) {
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

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.text}>メールアドレス</Text>
          <Input w='95%' keyboardType='email-address' />
        <Text style={styles.text}>パスワード</Text>
          <Input type='password' w='95%' />
        <Text style={styles.text}>ニックネーム</Text>
          <Input w='95%' />
        <Text style={styles.text}>アイコンの登録</Text>
    </View>
    <View style={styles.subContainer}>
        {defaultIcon && <Image size={150} borderRadius={100} source={{ uri: defaultIcon }} alt="Default User" />}
    </View>
    <View style={styles.container}>
      <Button title='ChangeIcon' onPress={onChangeIcon}>画像を変更する</Button>
    <View style={styles.button}>
      <DefaultButton>登録する</DefaultButton>
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
    paddingVertical: 24
  }, 
  button: {
    paddingTop: 24
  }
})
