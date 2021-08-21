


/**
 * 分页器结构
 * */
export interface IPagination {
    current: number,
    pageSize: number,
    total: number
}

/**
 * 分页数据
 * */
export interface IPageData<T> {
    list: Array<T>
    pagination: IPagination
}