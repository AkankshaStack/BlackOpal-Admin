import { paginationPayload } from "src/common/types";

export interface collectionProperties  {
    collectionId?:number,
    include:string,
    paginate:boolean,
    q?:string
}

export interface addCollectionPropertiesType extends paginationPayload {
    status:number,
    listingStatus:number,
    include:string,
    cityId:number,
    propertyTypeId?:any
}
export  interface IFormCollection {
    collectionName: string
    collectionTitle: string
    collectionDescription: string
    collectionImage: string
    collectionLocation: {
      cityId: {
        id: number
      }
      stateId: {
        id: number
      }
      countryId: {
        id: number
      }
    }
  }
export const collectionIncludes = 'address'