import axios from '@/axios/index'
import {
    IRole,
    IRoleQueryParam,
    IPageData,
    IIdResult,
    IStatusResult
} from './interface/index'

const CURRENT_URL = '/api/v1/management/roles'

/**
 * 查询数据
 * */
async function query(params: IRoleQueryParam): Promise<IPageData<IRole>> {
    return await axios.get(CURRENT_URL,
        {
            params
        })
}

/**
 * 创建数据
 * */
async function create(item: IRole): Promise<IIdResult> {
    return await axios.post(CURRENT_URL, item)
}

/**
 * 查找指定数据数据
 * */
async function get(id: string): Promise<IRole> {
    return await axios.get(`${CURRENT_URL}/${id}`)
}

/**
 * 更新数据
 * */
async function update(item: IRole): Promise<IIdResult> {
    return await axios.put(`${CURRENT_URL}/${item.id}`, item)
}

/**
 * 删除数据
 * */
async function remove(id: string): Promise<IStatusResult> {
    return axios.delete(`${CURRENT_URL}/${id}`)
}

/**
 * 失能
 * */
async function disable(id: string): Promise<IStatusResult> {
    return await axios.patch(`${CURRENT_URL}/${id}/disable`)
}

/**
 * 使能
 * */
async function enable(id: string): Promise<IStatusResult> {
    return await axios.patch(`${CURRENT_URL}/${id}/enable`)
}

export default {
    query,
    create,
    get,
    update,
    remove,
    disable,
    enable
}