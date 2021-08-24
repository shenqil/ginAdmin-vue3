import { IPageParams, EStatus, EShowStatus } from './base'
export interface IMenuResource {
    actionId: string,
    id: string
    method: string
    path: string
}

export interface IMenuAction {
    code: string,
    id: string,
    menuId: string,
    name: string
    resources?: Array<IMenuResource>
}
export interface IMenuTree {
    id: string
    icon: string
    name: string
    parentId: string
    parentPath: string
    router: string
    sequence: number
    showStatus: EShowStatus
    status: EStatus
    actions?: Array<IMenuAction>
    children?: Array<IMenuTree>
}

export interface IQueryMenuParams extends IPageParams {
    queryValue?: string
    status?: EStatus
    showStatus?: EShowStatus
    parentID?: string
}

export interface IMenuItem {
    createdAt: string,
    creator: string,
    icon: string,
    id: string,
    memo: string,
    name: string,
    parentId: string,
    parentPath: string,
    router: string,
    sequence: number,
    showStatus: EShowStatus,
    status: EStatus,
    updatedAt: string,
    actions?: Array<IMenuAction>
}