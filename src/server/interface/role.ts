import { IPageParams } from './base'
export interface IRole {
  createdAt?: string,
  creator?: string,
  id: string,
  memo: string,
  name: string,
  sequence: number,
  status: number,
  updatedAt?: string
}

export interface IRoleQueryParam extends IPageParams {
  queryValue?: string
  status?: number
}