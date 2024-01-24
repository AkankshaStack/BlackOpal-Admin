import { ReactNode } from "react"

export type imagePreview = {
  visible: boolean
  url: string
  type?:string
}
export interface paginationPayload {
  page:number,
  perPage:number,
  q?:string
}

export type propertyProp = {
  id: any
}
export type options = Array<{
  label: string
  tooltipLabel: string
  onClick: any
  icon?: ReactNode
  color?: string
}>

export interface pagination {
  currentPage:number,
  totalPages:number,
  perPage: number,
  total: number
  }
 export  interface FileProp {
    name: string
    type?: string
    size?: number
    url?: string
    slug?: string
  }
