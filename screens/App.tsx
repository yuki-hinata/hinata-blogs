import React from 'react'
import { NativeBaseProvider } from 'native-base'

import { RootNavigator } from '../navigation/RootNavigator'

export default function App () {
  // わざわざこれでやらなくても、isLoadingとsetIsloadingで判断すればよいのでは。
    return (
      <NativeBaseProvider>
        <RootNavigator />
      </NativeBaseProvider>
    )
}
