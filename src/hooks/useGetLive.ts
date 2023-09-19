import api from '@/api/matter/matter.api.js'
export const useGetAddress = () => {
  const getData = async (channelId: string) => {
    const params = {
      channelId
    }
    const res = await api.getVideoUrl(params)
    return res.data
  }
  return {
    getData
  }
}
