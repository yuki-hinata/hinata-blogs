import React from 'react'
import { TopScreen } from '../screens/TopScreen/TopScreen'
import { RegisterScreen } from '../screens/Register/RegisterScreen'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RecommendScreen } from '../screens/RecommendScreen/RecommendScreen'

const Stack = createNativeStackNavigator()

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Top'>
        <Stack.Screen name='Top' component={TopScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Register' component={RegisterScreen} options={{ headerTitle: '新規登録' }}/>
        <Stack.Screen name='Recommend' component={RecommendScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
