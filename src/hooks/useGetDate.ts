export const useGetDate = () => {
  const fillZero = (str: any) => {
    let realNum
    if (str < 10) {
      realNum = '0' + str
    } else {
      realNum = str
    }
    return realNum
  }
  const getDataNow = () => {
    const myDate = new Date()
    const myYear = myDate.getFullYear() //获取完整的年份(4位,1970-????)
    const myMonth = myDate.getMonth() + 1 //获取当前月份(0-11,0代表1月)
    const myToday = myDate.getDate() //获取当前日(1-31)
    const myDay = myDate.getDay() //获取当前星期X(0-6,0代表星期天)
    const myHour = myDate.getHours() //获取当前小时数(0-23)
    const myMinute = myDate.getMinutes() //获取当前分钟数(0-59)
    const mySecond = myDate.getSeconds() //获取当前秒数(0-59)
    const week = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六'
    ]
    const year = myYear + '.' + fillZero(myMonth) + '.' + fillZero(myToday)
    const weeks = week[myDay]
    const time =
      fillZero(myHour) + ':' + fillZero(myMinute) + ':' + fillZero(mySecond)
    return {
      year,
      weeks,
      time
    }
  }
  return {
    getDataNow
  }
}
export default useGetDate
