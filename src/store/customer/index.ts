// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios, { CancelTokenSource } from 'axios'
import BACKEND_ROUTES from 'src/common/constant'
import { axiosInstance } from 'src/utilities/configureAxios'
import { RootState } from 'src/store'
import { addingCancelToken } from 'src/store/project'
import { customerParam,intitalState } from './type'


export const errors = (err: any) => {
  const messages: any = {}

  // eslint-disable-next-line consistent-return

  Object.keys(err).forEach(key => {
    const errorMessage = err[key]
    if (!errorMessage) return ''
    messages[key] = typeof errorMessage === 'string' ? errorMessage : errorMessage.join(', ')
  })

  return messages
}


// Get all customer 
export const getCustomer = createAsyncThunk('appUsers/getCustomer', async (param:customerParam,thunkApI) => {
  const state:RootState = thunkApI.getState() as RootState
  if (state.customer.cancelToken) {
    (state.customer.cancelToken as CancelTokenSource).cancel('Aborting')
  }
  const source = axios.CancelToken.source()
  thunkApI.dispatch(addingCancelToken(source))
  if (param?.q?.length === 0 && state?.customer?.cancelToken) {
    thunkApI.dispatch(addingCancelToken(undefined))
  }
  try {
    const response = await axiosInstance.get(BACKEND_ROUTES.GET_CUSTOMER, {
      cancelToken: param?.q ? source.token : undefined,
      params: param
    })

    return response.data
  } catch (e: any) {
      return e      
  }
})



export const getChampions = createAsyncThunk('customerChampian/getCCList', async (params:any,thunkApI) => {
  try{
    const state: RootState = thunkApI.getState() as RootState
    if (state.verification.cancelToken) {
      (state.verification.cancelToken as CancelTokenSource).cancel('Aborting')
    }
    const source = axios.CancelToken.source()
    thunkApI.dispatch(addingCancelToken(source))
    if (params?.q?.length === 0 && state?.verification?.cancelToken) {
      thunkApI.dispatch(addingCancelToken(undefined))
    }

    const response = await axiosInstance.get(BACKEND_ROUTES.USER_LIST,{
      cancelToken: params?.q ? source.token : undefined,
      params
    })
   
    return response.data
  }
  catch(e:any){
    if (e?.message === 'Aborting') {
      return e
    }
  }

})




export const patchCustomerStatus = createAsyncThunk(
  'appCustomer/patchCustomerStatus',
  async (param: {
    id:number,
    status:number
  }) => {
    try {
      const response = await axiosInstance.put(BACKEND_ROUTES.PATCH_CUSTOMER.replace(':id', String(param.id)), {
        status:param.status
      })

      return response
    } catch (e: any) {}
  }
)


export const appCustomerSlice = createSlice({
  name: 'appCustomer',
  initialState: {
    cancelToken: undefined,
    data:[],
    pagination:{},
    loading:false,
  } as intitalState,
  reducers: {},

  extraReducers: builder => {
    builder.addCase(getCustomer.pending, state => {
      state.loading = true
      state.data = []
    })
    builder.addCase(getCustomer.fulfilled, (state,action) => {
      state.data = action?.payload?.data
      state.pagination = action?.payload?.meta?.pagination
      state.loading = false
    })
    builder.addCase(getCustomer.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(patchCustomerStatus.pending, state => {
      state.loading = true
   
    })
    builder.addCase(patchCustomerStatus.fulfilled, (state,action:any) => {
      if(action?.payload?.status!==204){
        state.loading = false
      }
   
    })
    builder.addCase(patchCustomerStatus.rejected, (state) => {
      state.loading = false
    })
  }
})

export default appCustomerSlice.reducer
