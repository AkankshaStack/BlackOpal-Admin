import {  axiosInstance } from 'src/utilities/configureAxios'
import BACKEND_ROUTE from 'src/common/constant'
import toast from 'react-hot-toast'

  
  export const fetchCity =  async (params: any) => {
    try{
    params.setCityLoading(true)
    const response = await axiosInstance.get(BACKEND_ROUTE.CITY, { params:params.data })
    if(response.data.success){
    params.setCityLoading(false)
    params.setCity(response.data.data)

    return response.data.data
      }
    }catch(e){
    toast.error('Something went wrong')
    }
  }
  
  export const fetchState = async (params: any) => {
    try{

        params.setStateLoading(true)
    const response = await axiosInstance.get(BACKEND_ROUTE.STATE, { params:params.data })
    if(response.data.success){
        params.setStateLoading(false)
        params.setState(response.data.data)

        return response.data.data
      }
}catch(e){

    toast.error('Something went wrong')
}
}