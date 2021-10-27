import axios from '@/axios/index'

/**
 * 根据文字创建一个默认图片
 * */ 
export async function getDefaultImg(text:string):Promise<string>{
    const res = await axios.get(`${window.location.origin}/files/nickName?name=${text}`)
    return (res as any).fileName
}

export default {
    getDefaultImg
}