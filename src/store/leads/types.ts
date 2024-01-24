import { CancelTokenSource } from "axios"
import { pagination } from "src/common/types"

export interface leadPayload  {
    status?:string
    statuses?:string
    verificationStatuses?:string
    teamMemberId?:string
    partnerId?:string
    include:string
    q?:string
    perPage:number
    page:number
    sort?:string
}

export interface partnerleadPayload  {
    id:string,
    payload:leadPayload
}
export interface leadDetailsPayload  {
    id:string 
    payload?:{
        include:string
        teamMemberId?:number
    }
    data?:{
        status?: number,
        verificationStatus?:number,
        docs?: string[],
        unitSize?:number ,
        inclusivePriceInPaise?:number ,
        closeReason?:string 
    }
}

export interface intitalState  {
    formErrors: any,
    data:any,
    pagination: pagination,
    leadData: {},
    searchActiveLeads: string,
    closeLeads: any,
    verifyLoading:boolean,
    closeLeadsPagination: any,
    loading: boolean,
    closeLeadLoading: boolean,
    cancelToken: CancelTokenSource | undefined
}