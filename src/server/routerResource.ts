import axios from '@/axios/index'
import {
    IRouterResourceQueryParam,
    IRouterResource,
    IPageData,
    IIdResult,
    IStatusResult
} from './interface/index'

const RouterResourceURL = '/api/v1/management/routerResources'

/**
 * 查询数据
 * */
async function query(params: IRouterResourceQueryParam): Promise<IPageData<IRouterResource>> {
    return await axios.get(RouterResourceURL,
        {
            params
        }) as IPageData<IRouterResource>
}

/**
 * 创建数据
 * */
async function create(item: IRouterResource): Promise<IIdResult> {
    return await axios.post(RouterResourceURL, item)
}

/**
 * 查找指定数据数据
 * */
async function get(id: string): Promise<IRouterResource> {
    return await axios.get(`${RouterResourceURL}/${id}`)
}

/**
 * 更新数据
 * */
async function update(item: IRouterResource): Promise<IIdResult> {
    return await axios.put(`${RouterResourceURL}/${item.id}`, item)
}

/**
 * 删除数据
 * */
async function remove(id: string): Promise<IStatusResult> {
    return axios.delete(`${RouterResourceURL}/${id}`)
}

/**
 * 失能
 * */
async function disable(id: string): Promise<IStatusResult> {
    return await axios.patch(`${RouterResourceURL}/${id}/disable`)
}

/**
 * 使能
 * */
async function enable(id: string): Promise<IStatusResult> {
    return await axios.patch(`${RouterResourceURL}/${id}/enable`)
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