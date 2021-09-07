import { IPageParams, IPageData } from './base'
import { IRouterResource } from './routerResource'

export interface IRoleRouter {
  roleId: string,
  routerId: string
}

export interface IRole {
  createdAt?: string,
  creator?: string,
  id: string,
  memo: string,
  name: string,
  sequence: number,
  status: number,
  updatedAt?: string
  roleRouters?: Array<IRoleRouter>
}

export interface IRoleQueryParam extends IPageParams {
  queryValue?: string
  status?: number
}

/**
 * 通过角色获取的路由资源
 * */
export interface IRouterResultByRole {
  exist: Array<IRouterResource>, // 当前用户下存在的角色
  notExist: IPageData<IRouterResource>  // 当前用户下不存在的角色
}