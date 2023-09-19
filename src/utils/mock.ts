import axios from "axios";
export function getServerConfig (url:string) {
    try {
        return new Promise ((resolve, reject) => {
            axios.get(url).then(res => {
                resolve(res.data);
            }).catch(error => {
              reject(error)
            })
          })
    } catch (error) {
        console.error(error)
    }
  }
  export async function getServerConfigInit(url:string) {
   return await getServerConfig(url);
  }
