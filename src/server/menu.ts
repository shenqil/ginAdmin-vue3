import axios from '@/axios/index'
import { IPageData, IMenuTree, IQueryMenuParams, IMenuItem, IIdResult, IStatusResult } from './interface/index'


const MenuURL = '/api/v1/management/menus'
/**
 * 查询菜单树
 * */
async function getTree(parentID: string | undefined): Promise<Array<IMenuTree>> {
    const res = await axios.get(`${MenuURL}.tree`,
        {
            params: {
                parentID
            }
        }
    ) as any

    return res.list as Array<IMenuTree>
}

/**
 * 查询菜单列表
 * */
async function query(params: IQueryMenuParams): Promise<IPageData<IMenuItem>> {
    return await axios.get(MenuURL,
        {
            params
        }
    ) as IPageData<IMenuItem>
}

/**
 * 创建一个菜单
 * */
async function create(menu: IMenuItem): Promise<IIdResult> {
    return await axios.post(MenuURL, menu)
}

/**
 * 查找指定数据
 * */
async function get(menuID: string): Promise<IMenuItem> {
    return await axios.get(`${MenuURL}/${menuID}`)
}

/**
 * 更新指定菜单
 * */
async function update(menu: IMenuItem): Promise<IIdResult> {
    return await axios.put(`${MenuURL}/${menu.id}`, menu)
}

/**
 * 删除指定菜单
 * */
async function remove(menuID: string): Promise<IStatusResult> {
    return await axios.delete(`${MenuURL}/${menuID}`)
}

/**
 * 禁用菜单
 * */
async function disable(menuID: string): Promise<IStatusResult> {
    return await axios.patch(`${MenuURL}/${menuID}/disable`)
}

/**
 * 启用菜单菜单
 * */
async function enable(menuID: string): Promise<IStatusResult> {
    return await axios.patch(`${MenuURL}/${menuID}/enable`)
}

export default {
    getTree,
    get,
    create,
    query,
    update,
    remove,
    disable,
    enable
}