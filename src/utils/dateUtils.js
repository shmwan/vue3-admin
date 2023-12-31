class DateUtils {
  format(date, format) {
    let o = {
      "M+": date.getMonth() + 1, //month 
      "d+": date.getDate(), //day 
      "h+": date.getHours(), //hour 
      "m+": date.getMinutes(), //minute 
      "s+": date.getSeconds(), //second 
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter 
      "S": date.getMilliseconds() //millisecond 
    };

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (let k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return format;
  }

  convert(date, unit = 's') {
    date = typeof date === 'string' ? new Date(date) : date;
    if (unit === 'ms') {
      return date.getTime();
    } else {
      return Math.ceil(date.getTime() / 1000);
    }
  }
}

export default new DateUtils();