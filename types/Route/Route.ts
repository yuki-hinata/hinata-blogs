export type Route = {
  Top: undefined;
  Register: undefined;
  FirstJudgements: undefined | { screen: string };
  SecondJudgements: undefined;
  ThirdJudgements: undefined;
  FourthJudgements: undefined;
  YourRecommend: undefined;
  ConfirmChat: undefined | { id: string | undefined};
  Chat: undefined | { roomId: string | undefined };
  RoomList: undefined | { roomId: string | undefined };
  TabNavigator: undefined | { screen: string };
  UserEditScreen: undefined;
  JudgementsNavigator: undefined | { screen: string };
  AuthNavigator: undefined | { screen: string };
  SecondYourRecommendScreen: undefined | { id: string | undefined};
}
