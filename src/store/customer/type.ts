import { CancelTokenSource } from "axios"
import { pagination } from "src/common/types"

export interface customerParam{
    page:number,
    perPage:number,
    q?: string,
    sort?:string,
    status?:string | number
}


export interface intitalState {
    data: any,
    pagination: pagination,
    loading: boolean,
    cancelToken: CancelTokenSource | undefined
}
