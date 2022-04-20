import React  from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  Error: Error
}

export const CatchError: React.FC<Props> = ({ Error }) => {
  return(
  <View>
    <Text>エラーが発生しました</Text>
    <Text>ネットワークの状況を確認してください</Text>
  </View>
  )
}
