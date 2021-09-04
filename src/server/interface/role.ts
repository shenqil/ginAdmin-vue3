import { IPageParams } from './base'

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