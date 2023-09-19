/**
 * 获取最近n个月/年
 * @param {*} type 类型month, year
 * @param {*} num 数目
 */
import DateUtils from '@/utils/dateUtils.js'
class setDateRecent {
  getRecentlyDate = (type, num) => {
    let t1 = ''
    let t2 = ''
    switch (type) {
      case 'month':
        t1 = new Date()
        t2 = t1.setMonth(t1.getMonth() - num)
        break
      case 'year':
        t1 = new Date()
        t2 = t1.setYear(t1.getFullYear() - num)
        break
    }
    t1 = new Date()
    return {
      startTime: DateUtils.format(new Date(t2), 'yyyy-MM-dd') + ' 00:00:00',
      endTime: DateUtils.format(new Date(t1), 'yyyy-MM-dd') + ' 23:59:59'

      //   start_date: dateFormat(new Date(t2), 'yyyy/MM/dd'),
      //   end_date: dateFormat(new Date(), 'yyyy/MM/dd')
    }
  }
}
export default new setDateRecent()
