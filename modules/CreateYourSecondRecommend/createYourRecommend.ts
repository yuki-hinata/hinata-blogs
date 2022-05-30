export const createYourRecommend = (id: number | undefined) => {  
    const secondId = id! % 2 === 0 ? id! + 1 : id! - 1;
    console.log(secondId);
    const judge = () => {
      if (secondId === 0) {
        return {
          name: "齊藤京子",
          handleName: 'kyouko' as const
        }
      } else if (secondId === 1) {
        return {
          name: "秋元康",
          handleName: 'yasushi' as const
        }
      } else if (secondId === 2) {
        return {
          name: "宮田愛萌",
          handleName: 'manamo' as const
        }
      } else if (secondId === 3) {
        return {
          name: '加藤史帆',
          handleName: 'katoshi' as const
        }
      } else if (secondId === 4) {
        return {
          name: '丹生明里',
          handleName: 'nibu' as const
        }
      } else if (secondId === 5) {
        return {
          name: '河田陽菜',
          handleName: 'kawata' as const
        }
      } else if (secondId === 6) {
        return {
          name: '小坂菜緒',
          handleName: 'kosakana' as const
        }
      } else if (secondId === 7) {
        return {
          name: '渡邉美穂',
          handleName: 'miho' as const
        }
      } else if (secondId === 8) {
        return {
          name: '佐々木美玲',
          handleName: 'mirei' as const
        }
      } else if (secondId === 9) {
        return {
          name: '上村ひなの',
          handleName: 'hinano' as const
        }
      }
    }

  return {
    name: judge()?.name,
    secondId,
    handleName: judge()?.handleName
  }
}
