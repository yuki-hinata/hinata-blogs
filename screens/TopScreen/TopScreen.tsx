import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { DefaultButton } from "../../ui/DefaultButton";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Route } from '../../types/Route/Route'

// undefinedを指定することで、ルートがパラメータを持たないことを意味する。
// Routesみたいなオブジェクトにまとめるほうが楽

type Props = NativeStackScreenProps<Route, "Register">;

export const TopScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hinata-App</Text>
      <DefaultButton onPress={() => navigation.navigate("Register")}>
        新規登録を行う
      </DefaultButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5bbee5",
  },
  title: { fontSize: 40, paddingBottom: 40 },
});
