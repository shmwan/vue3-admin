// node 读取文件内容
import axios from "axios";
let  fs =require('fs'); 
let text = "";
let newIconfontList = [];
let url =config().linkCss || '//at.alicdn.com/t/font_3325547_wks1ttt5mj.css';
 axios.get(url).then(res => {
     text=res.data;
     let iconfontList =  text.split(`:before`);
        // 定义新的数组
    iconfontList.forEach((item)=>{
        // 判断存在
        if(item.split("icon-")[1]){

            newIconfontList.push('iconfont icon-'+item.split("icon-")[1])
        }


    })
  }).catch(error => {
    console.error(error);
})

// const text = fs.readFileSync('/iconfont.css', 'utf-8')
export function getIconList(){
    return newIconfontList
}
