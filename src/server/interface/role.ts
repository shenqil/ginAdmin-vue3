export interface IRole {
  createdAt: string,
  creator: string,
  id: string,
  memo: string,
  name: string,
  roleMenus: Array<IRoleMenu>,
  sequence: 0,
  status: 0,
  updatedAt: string
}

export interface IRoleMenu {
  actionId: string,
  id: string,
  menuId: string,
  roleId: string
}