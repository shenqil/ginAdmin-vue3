import axios from '../axios/index'
import { IPageData, IMenuTree, IQueryMenuParams, IMenuItem, EStatus } from './interface/index'


const MenuURL = '/api/v1/menus'
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
async function getList(params: IQueryMenuParams): Promise<IPageData<IMenuItem>> {
    return await axios.get(MenuURL,
        {
            params
        }
    ) as IPageData<IMenuItem>
}

/**
 * 创建一个菜单
 * */
async function create(menu: IMenuItem): Promise<{ id: string }> {
    return await axios.post(MenuURL, menu)
}

/**
 * 查找指定数据
 * */
async function query(menuID: string): Promise<IMenuItem> {
    return await axios.get(`${MenuURL}/${menuID}`)
}

/**
 * 更新指定菜单
 * */
async function update(menu: IMenuItem): Promise<{ id: string }> {
    return await axios.put(`${MenuURL}/${menu.id}`, menu)
}

/**
 * 删除指定菜单
 * */
async function remove(menuID: string): Promise<{ status: string }> {
    return await axios.delete(`${MenuURL}/${menuID}`)
}

/**
 * 启用菜单菜单
 * */
async function disable(menuID: string): Promise<{ status: string }> {
    return await axios.patch(`${MenuURL}/${menuID}/disable`)
}

/**
 * 禁用菜单
 * */
async function enable(menuID: string): Promise<{ status: string }> {
    return await axios.patch(`${MenuURL}/${menuID}/enable`)
}

export default {
    getTree,
    getList,
    create,
    query,
    update,
    remove,
    disable,
    enable
}