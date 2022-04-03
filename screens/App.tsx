import React from 'react'
import { NativeBaseProvider } from 'native-base'

import useCachedResources from '../hooks/useCachedResources'
import { RootNavigator } from '../navigation/RootNavigator'

export default function App () {
  // わざわざこれでやらなくても、isLoadingとsetIsloadingで判断すればよいのでは。
  const isLoadingComplete = useCachedResources()

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <NativeBaseProvider>
        <RootNavigator />
      </NativeBaseProvider>
    )
  }
}
