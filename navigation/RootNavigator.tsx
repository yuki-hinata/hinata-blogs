import React, { useState } from "react";
import { TopScreen } from "../screens/TopScreen/TopScreen";
import { RegisterScreen } from "../screens/Register/RegisterScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FirstJudgements } from "../screens/RecommendScreen/FirstJudgementsScreen";
import { SecondJudgements } from "../screens/RecommendScreen/SecondJudgementsScreen";
import { ThirdJudgements } from "../screens/RecommendScreen/ThirdJudgementsScreen";
import { FourthJudgements } from "../screens/RecommendScreen/FourthJudgementsScreen";
import { YourRecommendScreen } from "../screens/YourRecommend/YourRecommendScreen";
import { ConfirmChat } from "../screens/ConfirmChat/ConfirmChatScreen";
import { Chat } from "../screens/Chat/ChatScreen";
import { RoomList } from "../screens/RoomList/RoomList";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { RootSettingsScreen } from "../screens/Settings/RootSettingsScreen";
import { UserEditScreen } from "../screens/Settings/SettingsScreen/UserEditScreen";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { SecondYourRecommendScreen } from "../screens/SecondYourRecommend/SecondYourRecommendScreen";
import { useRoomListItem } from "../hooks/roomListItem/useRoomListItem";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
      <Tab.Navigator>
        <Tab.Screen name="RoomList" component={RoomList} options={{ headerShown: false, tabBarIcon: () => {
          return <Icon name="wechat" color={'black'} size={28} focused={true} />
        }, title: 'チャット' }} />
        <Tab.Screen name="RootSettingsScreen" component={RootSettingsScreen} options={{ headerShown: false, tabBarIcon: () => {
          return <Icon name="gear" color={'black'} size={28} focused={true} />
        }, title: '設定' }} />
      </Tab.Navigator>
    )
  }

  const AuthNavigator = () => {
    return (
      <Stack.Navigator initialRouteName="Top">
        <Stack.Screen name='Top' component={TopScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Register' component={RegisterScreen} options={{ headerTitle: '新規登録', gestureEnabled: false }} />
    </Stack.Navigator>
    )
  }

  const JudgementsNavigator = () => {
    return (
      <Stack.Navigator initialRouteName="FirstJudgements">
        <Stack.Screen name='FirstJudgements' component={FirstJudgements} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name='SecondJudgements' component={SecondJudgements} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name='ThirdJudgements' component={ThirdJudgements} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="FourthJudgements" component={FourthJudgements} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name='YourRecommend' component={YourRecommendScreen} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name='ConfirmChat' component={ConfirmChat} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="SecondYourRecommendScreen" component={SecondYourRecommendScreen} options={{ headerShown: false, gestureEnabled: false }} />
      </Stack.Navigator>
    )
  }
  
  // ここでuserが存在すればinitialRouteNameをRoomListにするみたいな感じ。
  export const RootNavigator = () => {
    // https://zenn.dev/kyo9bo/articles/ac0824a3893eb9
    // ログアウトした場合なども考慮し、useStateにuser情報を保存する。ログアウトしてnullになった場合も再レンダリングを行うためでもある。
    // エラーを握りつぶしている感じがする。
    const [user, setUser] = useState<User | null>()
    const {
      roomListItem
    } = useRoomListItem()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })
    console.log(roomListItem![0])
	return (
		<NavigationContainer>
      <Stack.Navigator>
        {
          !user && (
          <Stack.Screen name="AuthNavigator" component={AuthNavigator} options={{ headerShown: false, gestureEnabled: false }} />
          )
        }
        {
          !roomListItem![0] && (
          <Stack.Screen name="JudgementsNavigator" component={JudgementsNavigator} options={{ headerShown: false, gestureEnabled: false }} />
          )
        }
        <Stack.Screen name='TabNavigator' component={TabNavigator} options={{ headerShown: false, gestureEnabled: false, headerBackVisible: false}} />
        <Stack.Screen name='Chat' component={Chat} options={{ gestureEnabled: false }} />
        <Stack.Screen name="UserEditScreen" component={UserEditScreen} options={{ headerTitle: 'ユーザー編集' }} />
      </Stack.Navigator>
    </NavigationContainer>
	);
};
