import React, { useState } from "react";
import { query, collection, where, limit, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";

// components
import { YourRecommend } from "./YourRecommend";
import { LoadingIndicator } from "../../ui/LoadingIndicator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert } from "react-native";

type FirstJudgements = {
  FirstJudgements: undefined;
  ConfirmChat: undefined;
}

type Props = NativeStackScreenProps<FirstJudgements, 'FirstJudgements' | 'ConfirmChat'>

export const YourRecommendScreen = ({ navigation }: Props) => {
  // useState
  const [isResultFirstAnswer, setIsResultFirstAnswer] = useState<boolean>()
  const [isResultSecondAnswer, setIsResultSecondAnswer] = useState<boolean>()
  const [isResultThirdAnswer, setIsResultThirdAnswer] = useState<boolean>()
  const [isResultForthAnswer, setIsResultFourthAnswer] = useState<boolean>()

  // userId取得
  const user = auth.currentUser;
  const userId = user?.uid

  // userの解答をすべて取得。
  const findAllAnswer = query(collection(db, 'judgements'), where('userId', '==', userId), limit(1))
  getDocs(findAllAnswer).then((answer) => {
    answer.forEach((maps) => {
      setIsResultFirstAnswer(maps.data().firstAnswer)
      setIsResultSecondAnswer(maps.data().secondAnswer)
      setIsResultThirdAnswer(maps.data().thirdAnswer)
      setIsResultFourthAnswer(maps.data().fourthAnswer ??= false)
    })
  }).catch((error) => console.error(error))

  const againJudgements = () => {
    Alert.alert('再度診断を行います。', '現在の推しメンとは変わりますが、大丈夫ですか？', [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('FirstJudgements');
        },
      },
      {
        text: 'キャンセル',
        style: 'cancel'
      }
    ])
  }

  const navigateChatConfirm = () => {
    navigation.navigate('ConfirmChat')
  }

  if (isResultFirstAnswer === undefined || isResultSecondAnswer === undefined || isResultThirdAnswer === undefined || isResultForthAnswer === undefined) {
    return <LoadingIndicator />
  }

  return <YourRecommendPresentation 
          isResultFirstAnswer={isResultFirstAnswer} 
          isResultSecondAnswer={isResultSecondAnswer} 
          isResultThirdAnswer={isResultThirdAnswer} 
          isResultForthAnswer={isResultForthAnswer}
          againJudgements={againJudgements}
          navigateChatConfirm={navigateChatConfirm}
          />
}

const YourRecommendPresentation = ({
  isResultFirstAnswer,
  isResultSecondAnswer,
  isResultThirdAnswer,
  isResultForthAnswer,
  againJudgements,
  navigateChatConfirm
} : {
  isResultFirstAnswer: boolean,
  isResultSecondAnswer: boolean,
  isResultThirdAnswer: boolean,
  isResultForthAnswer: boolean,
  againJudgements: () => void
  navigateChatConfirm: () => void
}) => {
  const getRecommend = () => {
    if (!isResultFirstAnswer && isResultSecondAnswer && isResultThirdAnswer) {
        // setRecommendName('齊藤京子')
        // setRecommendNumber(0)
        // setHandleName('kyouko')
        return {
          name: '齊藤京子',
          id: 0,
          // as constを付け加えるのが味噌。４問目が空になり、undefになりloadingが永続表示される。
          handleName: 'kyouko' as const
        }
      } else if (!isResultFirstAnswer && isResultSecondAnswer && !isResultThirdAnswer) {
        return {
          name: '秋元康',
          id: 1,
          handleName: 'yasushi' as const
        }
      } else if (!isResultFirstAnswer && !isResultSecondAnswer && isResultThirdAnswer) {
        return {
          name: '宮田愛萌',
          id: 2,
          handleName: 'manamo' as const
        } 
      } else if (!isResultFirstAnswer && !isResultSecondAnswer && !isResultThirdAnswer) {
        return {
          name: '加藤史帆',
          id: 3,
          handleName: 'katoshi' as const
        }
      } else if (isResultFirstAnswer && isResultSecondAnswer && !isResultThirdAnswer) {
        return {
          name: '丹生明里',
          id: 4,
          handleName: 'nibu' as const
        }
      } else if (isResultFirstAnswer && !isResultSecondAnswer && isResultThirdAnswer) {
        return {
          name: '河田陽菜',
          id: 5,
          handleName: 'kawata' as const
        } 
      } else if (isResultFirstAnswer && isResultSecondAnswer && isResultThirdAnswer && isResultForthAnswer) {
        return {
          name: '小坂菜緒',
          id: 6,
          handleName: 'kosakana' as const
        }
      } else if (isResultFirstAnswer && isResultSecondAnswer && isResultThirdAnswer && !isResultForthAnswer) {
        return {
          name: '渡邉美穂',
          id: 7,
          handleName: 'miho' as const
        }
      } else if (isResultFirstAnswer && !isResultSecondAnswer && !isResultThirdAnswer && isResultForthAnswer) {
        return {
          name: '佐々木美玲',
          id: 8,
          handleName: 'mirei' as const
        }
      } else if (isResultFirstAnswer && !isResultSecondAnswer && !isResultThirdAnswer && !isResultForthAnswer) {
        return {
          name: '上村ひなの',
          id: 9,
          handleName: 'hinano' as const
        }
      } 
      // これがないとこの解答に該当しない場合、何も返さないので、これいる
      throw new Error('該当する推しが見つかりませんでした')
  }

  return (
    <YourRecommend 
      // {...getRecommend()}
      id={getRecommend().id}
      handleName={getRecommend().handleName}
      name={getRecommend().name}
      againJudgements={againJudgements}
      navigateChatConfirm={navigateChatConfirm}
    />
  )
}
