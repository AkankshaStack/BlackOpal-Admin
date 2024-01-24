import { CancelTokenSource } from "axios"
import { pagination } from "src/common/types"

interface commonTransactionInterface {
    include: string,
    status?: number | string,
    page:number,
    perPage:number,
    q?: string,
}
export interface transactionParam extends commonTransactionInterface{
    type?: number,
    transactionFor?:number | string,
    userId?:string | number,
    sort?:string
}

export interface refundParam  extends commonTransactionInterface{
  sort?:string
}
export interface patchRefundParam {
    refundId?: number,
    cancelReason?: string,
    userId?: number
    status?:number
}


export interface intitalState {
    formErrors: {[key:string]:string},
    data: any,
    pagination: pagination,
    paymentLoader:boolean,
    loading: boolean,
    cancelToken: CancelTokenSource | undefined,
    paymentLoading:boolean,
    paymentData:any,
    paymentPagination:pagination,
    refundData:any,
    refundPagination:pagination,
    refundLoading:boolean
}
export interface paymentTransaction {
    orderId: string,
}