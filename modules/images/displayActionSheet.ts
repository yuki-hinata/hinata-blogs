import { ActionSheetIOS } from "react-native";

export const displayActionSheet = (pickImage: () => Promise<void>) =>
    ActionSheetIOS.showActionSheetWithOptions(
      { options: ["キャンセル", "写真を選択"], cancelButtonIndex: 0 },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          pickImage();
        }
      }
    );

