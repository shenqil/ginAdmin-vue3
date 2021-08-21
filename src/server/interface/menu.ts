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
    showStatus: number
    status: number
    actions?: IMenuAction
    children?: Array<IMenuTree>
}