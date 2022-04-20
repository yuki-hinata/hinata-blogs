import React from 'react'
import { TopScreen } from '../screens/TopScreen/TopScreen'
import { RegisterScreen } from '../screens/Register/RegisterScreen'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { FirstJudgements } from '../screens/RecommendScreen/FirstJudgementsScreen'
import { SecondJudgements } from '../screens/RecommendScreen/SecondJudgementsScreen'
import { ThirdJudgements } from '../screens/RecommendScreen/ThirdJudgementsScreen'
import { FourthJudgements } from '../screens/RecommendScreen/FourthJudgementsScreen'
import { YourRecommendScreen } from '../screens/YourRecommend/YourRecommendScreen'
import { ConfirmChat } from '../screens/ConfirmChat/ConfirmChatScreen'

const Stack = createNativeStackNavigator()

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Top'>
        <Stack.Screen name='Top' component={TopScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Register' component={RegisterScreen} options={{ headerTitle: '新規登録', gestureEnabled: false }}/>
        <Stack.Screen name='FirstJudgements' component={FirstJudgements} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name='SecondJudgements' component={SecondJudgements} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name='ThirdJudgements' component={ThirdJudgements} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="FourthJudgements" component={FourthJudgements} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name='YourRecommend' component={YourRecommendScreen} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name='ConfirmChat' component={ConfirmChat} options={{ headerShown: false, gestureEnabled: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
