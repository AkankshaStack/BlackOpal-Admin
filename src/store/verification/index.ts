// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios, { CancelTokenSource } from 'axios'
import toast from 'react-hot-toast'
import BACKEND_ROUTES from 'src/common/constant'
import { axiosInstance } from 'src/utilities/configureAxios'
import { RootState } from '..'



// ** Axios Imports
// ** Fetch Users
export const fetchData = createAsyncThunk('appVerification/fetchData', async (params:any,thunkApI) => {
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

export const postData = createAsyncThunk('appVerification/postData', async (params:any) => {
  const response = await axiosInstance.post(BACKEND_ROUTES.USER_LIST, params.payload)
 
  
return response.data
})

export const patchlisting = createAsyncThunk('appVerification/patchlisting', async (params:any) => {
  const response = await axiosInstance.patch(BACKEND_ROUTES.USER_LIST,params.payload)
  if(response?.data?.success){
    params.cb()
   }

return response
})

export const appVerification = createSlice({
  name: 'appVerification',
  initialState: {
    data: {},
    postloading:false,
    loading:false,
    cancelToken: undefined
  },
  reducers: {
    addingCancelToken: (state, action) => {
      state.cancelToken = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchData.pending, (state ) => {
      state.loading = true
      state.data = []
    })
    builder.addCase(fetchData.fulfilled, (state, action) => {
      if (action?.payload?.message !== 'Aborting') {
      state.loading = false
      state.data = action.payload
      }
    })
    builder.addCase(fetchData.rejected, (state) => {
      state.loading = false
      state.data = []
    })
    builder.addCase(patchlisting.pending, (state ) => {
      state.loading = true
    })
    builder.addCase(patchlisting.fulfilled, () => {
      toast.success('Updated Successfully')      
    })
    builder.addCase(patchlisting.rejected, (state) => {
      state.loading = false
      state.data = []
    })
    builder.addCase(postData.pending, (state) => {
      state.postloading = true
    })
    builder.addCase(postData.fulfilled, (state, action) => {
      state.postloading = false
      state.data = action.payload.data   
      toast.success('Verification Added Successfully')
    })
    builder.addCase(postData.rejected, (state) => {
      state.postloading = false
      state.data = []
    })
  }
})

export const { addingCancelToken } = appVerification.actions

export default appVerification.reducer
