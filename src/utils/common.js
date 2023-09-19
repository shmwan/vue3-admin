/**
 * 该方法用于将有父子关系的数组转换成树形结构的数组
 * 接收一个具有父子关系的数组作为参数
 * 返回一个树形结构的数组
 */
export function translateDataToTree1(data, key) {
  //没有父节点的数据
  let parents = data.filter(
    value =>
      value.parentId == 'undefined' ||
      value.parentId == null ||
      value.parentId == 0
  )

  //有父节点的数据
  let children = data.filter(
    value =>
      value.parentId !== 'undefined' &&
      value.parentId != null &&
      value.parentId != 0
  )

  //定义转换方法的具体实现
  let translator = (parents, children) => {
    //遍历父节点数据
    parents.forEach(parent => {
      //遍历子节点数据
      children.forEach((current, index) => {
        //此时找到父节点对应的一个子节点
        if (current.parentId === parent.id) {
          //对子节点数据进行深复制，这里只支持部分类型的数据深复制，对深复制不了解的童靴可以先去了解下深复制
          let temp = JSON.parse(JSON.stringify(children))
          //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
          temp.splice(index, 1)

          //让当前子节点作为唯一的父节点，去递归查找其对应的子节点
          translator([current], temp)
          //把找到子节点放入父节点的children属性中
          typeof parent.children !== 'undefined'
            ? parent.children.push(current)
            : (parent.children = [current])
        }
      })
    })
  }
  //调用转换方法
  translator(parents, children)
  //返回最终的结果
  return parents
}

export function translateDataToTree(oldArr, parentId1) {
  if (!parentId1) {
    parentId1 = oldArr.reduce((prev, curr) => {
      return prev.parentId < curr.parentId ? prev : curr
    }).parentId
  }
  oldArr.forEach(element => {
    let parentId = element.parentId
    element.key = element.id
    //     if(parentId !== 0){

    oldArr.forEach(ele => {
      if (ele.id == parentId) {
        //当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
        if (!ele.children) {
          ele.children = []
        }
        ele.children.push(element)
      }
    })
    //     }
  })
  oldArr = oldArr.filter(ele => ele.parentId == parentId1) //这一步是过滤，按树展开，将多余的数组剔除；
  return oldArr
}
// 树形转list
export function treeToList(tree) {
  var list = [] //结果lsit
  for (var i in tree) {
    var node = tree[i]
    if (node.children) {
      if (node.children.length !== 0) {
        //遍历树的第一层,只有一个根结点
        //第一层加入到list中,因为根结点模块设置为虚拟结点,所以不用加入
        /*list.push({
                id: node.id,
                name: node.title,
                parentId:node.parentId
            });*/
        toListDF(node.children, list, node.id) //遍历子树,并加入到list中.
      }
    }
  }
  return list
}
export function getAllMenuCode(item, arr) {
  // 递归获取所有有权限菜单code
  for (let i = 0; i < item.length; i++) {
    // if(item[i].icon==='icon')arr.push(item[i].url);
    if (item[0].type == 1) {
      arr.push(item[i].requestUrl)
    }
    if (item[i].children && item[i].children.length > 0) {
      getAllMenuCode(item[i].children, arr)
    }
  }
}
// 树形转list
export function treeToList2(tree) {
  var list = [] //结果lsit
  for (var i in tree) {
    var node = tree[i]
    //  if(node.children){
    //   if (node.children.length !== 0) {  //遍历树的第一层,只有一个根结点
    //第一层加入到list中,因为根结点模块设置为虚拟结点,所以不用加入
    list.push({
      id: node.id,
      name: node.title,
      parentId: node.parentId
    })
    toListDF(node.children, list, node.id) //遍历子树,并加入到list中.
    // }
    // }
  }
  return list
}
/**
 * 深度优先遍历树
 * 一个递归方法
 * @params tree:要转换的树结构数据
 * @params list:保存结果的列表结构数据，初始传list = []
 * @params parentId:当前遍历节点的父级节点id，初始为null(因为根节点无parentId)
 **/
function toListDF(tree, list, parentId) {
  for (var i in tree) {
    //遍历最上层
    //将当前树放入list中
    var node = tree[i]
    list.push(node)
    //如果有子结点,再遍历子结点
    if (node.children) {
      toListDF(node.children, list, node.id) //递归
    }
  }
}

/**
 * 浏览器复制功能
 */

export function Copy(row, column, cell, event) {
  let content = row[column.property]
  if (!content) {
    return ''
  }
  let textarea = document.createElement('textarea')
  textarea.value = content

  textarea.readOnly = 'readOnly'

  document.body.appendChild(textarea)

  textarea.select() // 选择对象

  textarea.setSelectionRange(0, content.length) //核心

  let result = document.execCommand('Copy') // 执行浏览器复制命令

  textarea.remove()

  return result
}

export function hasPermission(roles, route) {
  if (route) {
    return roles.some(role => route.includes(role))
  } else {
    return true
  }
}
// 获取到全局的功能点
export function allPremissArr(store) {
  const privilegeCodes = treeToList(store.state.common.privilegeCodes)
  const permissions = privilegeCodes.filter(ele => ele.type === 2)
  const permissionsArr = []
  permissions.forEach(i => {
    permissionsArr.push(i.requestUrl)
  })
  return permissionsArr
}

export function dicFilte(Arr, code) {
  const permissions = Arr.filter(ele => ele.groupCode == code)
  return permissions
}

export function fileUnit(size) {
  if (size < 0.1 * 1024) {
    //小于0.1KB，则转化成B
    size = size.toFixed(2) + 'B'
  } else if (size < 0.1 * 1024 * 1024) {
    // 小于0.1MB，则转化成KB
    size = (size / 1024).toFixed(2) + 'KB'
  } else if (size < 0.1 * 1024 * 1024 * 1024) {
    // 小于0.1GB，则转化成MB
    size = (size / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    // 其他转化成GB
    size = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }

  // 转成字符串
  let sizeStr = size + '',
    // 获取小数点处的索引
    index = sizeStr.indexOf('.'),
    // 获取小数点后两位的值
    dou = sizeStr.substr(index + 1, 2)

  // 判断后两位是否为00，如果是则删除00
  if (dou == '00')
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)

  return size
}

export function getListById(id, list, arr) {
  for (var i in list) {
    if (id == list[i].id) {
      arr.push({
        parentId: list[i].id,
        name: list[i].fileShowName,
        parentIds: list[i].parentIds
      })
      if (list[i].parentId != 0 && list[i].parentId) {
        getListById(list[i].parentId, list, arr)
      }
    }
  }
  arr.sort((a, b) => {
    return a.parentId - b.parentId
  }) //升序
  return arr
}

export function getFileName(response) {
  // 需要响应设置此header暴露给外部，才能获取到
  let fileName = ''
  let contentDisposition = response.headers['content-disposition']
  if (contentDisposition) {
    // 正则获取filename的值
    let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
    let matches = filenameRegex.exec(contentDisposition)
    if (matches != null && matches[1]) {
      fileName = matches[1].replace(/['"]/g, '')
    }
    // 通过 URLEncoder.encode(pFileName, StandardCharsets.UTF_8.name()) 加密编码的, 使用decodeURI(fileName) 解密
    fileName = decodeURI(fileName)
    // 通过 new String(pFileName.getBytes(), StandardCharsets.ISO_8859_1) 加密编码的, 使用decodeURI(escape(fileName)) 解密
    // fileName = decodeURI(escape(fileName))
  }
  return fileName
}

export function randomPwd(num) {
  let arr = ''
  for (let i = 0; i < num; i++) {
    //随机数 Math.random 0-1 的随机值
    let n = Math.random()
    if (n < 0.25) {
      //随机数字
      var s = Math.floor(Math.random() * 10)
      arr += s
    }
    //随机大写字母 //65-91
    else if (n >= 0.25 && n < 0.5) {
      var s = String.fromCharCode(Math.floor(Math.random() * 26 + 65))
      arr += s
    }
    //随机小写字母 97-123
    else if (n >= 0.5 && n < 0.75) {
      var s = String.fromCharCode(Math.floor(Math.random() * 26 + 97))
      arr += s
    }
    //随机特殊符号
    else {
      var letter = '~!@#$%^&*'
      var s = letter.charAt(Math.floor(Math.random() * letter.length))
      arr += s
    }
  }
  return arr
}

// 加密方式
export function encryptByDES(message, key) {
  const keyHex = CryptoJS.enc.Utf8.parse(key)
  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

export function fileView(url) {
  let origin = window.location.origin
  let baseApi = config().fileLookBase || '/api'
  window.open(
    origin +
      baseApi +
      '/preview-file/onlinePreview?url=' +
      encodeURIComponent(Base64.encode(url))
  )
}

// import DateUtils from "@/utils/dateUtils.js";

export function YHNo(val) {
  let time = DateUtils.format(new Date(), 'yyMMddhhmmssS')
  return val + time
}
//要将秒时间格式化为小时、分钟和秒，

export function formatTime(seconds) {
  let hours = Math.floor(seconds / 3600)
  let minutes = Math.floor((seconds % 3600) / 60)
  let remainingSeconds = seconds % 60

  if (hours > 0 && minutes > 0) {
    return `${hours}时 ${minutes}分${remainingSeconds}秒`
  } else if (hours > 0) {
    return `${hours}时${remainingSeconds}秒`
  } else if (minutes > 0) {
    return `${minutes}分${remainingSeconds}秒`
  } else {
    return `${remainingSeconds}秒`
  }
}

export function getMax(arr) {
  let max = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i]
    }
  }
  return max
}
