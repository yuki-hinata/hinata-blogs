import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { signOut } from "firebase/auth"
import React from "react"
import { View, StyleSheet, SafeAreaView } from "react-native"
import { ListItem } from "react-native-elements"
import { auth } from "../../firebase/firebase"
import { Route } from "../../types/Route/Route"
import { Header } from "../../ui/Header"

type SettingsList = {
  name: string,
  id: string,
  onPress: () => void
}

type Props = NativeStackScreenProps<Route, 'UserEditScreen'>;

export const RootSettingsScreen = ({ navigation }: Props) => {
  console.log('list')
  const list: SettingsList[] = [
    {
      name: 'ユーザー編集',
      id: '1',
      onPress: () => navigation.navigate('UserEditScreen')
    },
    {
      name: 'ログアウト',
      id: '2',
      onPress: () => {
        signOut(auth).then(() => {
          navigation.navigate('AuthNavigator', {
            screen: 'Top',
          })
        })
      }
    }
  ]

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Header title="設定" /> 
        </SafeAreaView>
      <View>
      {
        list.map((list) => (
          <ListItem key={list.id} onPress={() => list.onPress()} bottomDivider>
            <ListItem.Content>
              <ListItem.Title style={list.id === '2' ? styles.logoutTitle : styles.userEditTitle}>{list.name}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))
      }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#C0C0C0',
    height: 60
  },
  userEditTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutTitle: {
    color: 'red'
  }
})
