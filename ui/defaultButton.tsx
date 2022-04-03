import React from "react";
import { Button } from "native-base";
import type { IButtonProps } from 'native-base'

const ButtonProps: IButtonProps = {
  backgroundColor: '#AEDBDB',
  size: 'lg'
}

export const DefaultButton: React.FC<IButtonProps> = ({ children, ...props }) => {
  return (
  <Button {...ButtonProps} {...props}>
    {children}
  </Button>
  )
}
