import React from 'react';
import { NativeBaseProvider } from 'native-base';

import useCachedResources from '../hooks/useCachedResources';
import useColorScheme from '../hooks/useColorScheme';
import { RootNavigator } from '../navigation/RootNavigator';

export default function App() {
  // わざわざこれでやらなくても、isLoadingとsetIsloadingで判断すればよいのでは。
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <NativeBaseProvider>
        <RootNavigator />
      </NativeBaseProvider>
    );
  }
}
