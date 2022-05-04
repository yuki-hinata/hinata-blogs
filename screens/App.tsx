import React from "react";
import { NativeBaseProvider } from "native-base";

import { RootNavigator } from "../navigation/RootNavigator";

export default function App() {
	return (
		<NativeBaseProvider>
      <RootNavigator />
    </NativeBaseProvider>
	);
}
