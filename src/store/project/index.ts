// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import { axiosInstance } from 'src/utilities/configureAxios'

import BACKEND_ROUTE from 'src/common/constant'
import axios from 'axios'
import toast from 'react-hot-toast'



export const errors = (err: any) => {
  const messages: any = {}
  Object.keys(err).forEach(key => {
    const errorMessage = err[key]
    if (!errorMessage) return ''
    messages[key] = typeof errorMessage === 'string' ? errorMessage : errorMessage.join(', ')
  })

  return messages
}

export const getProject = createAsyncThunk('appProject/getProject', async (param: any,thunkApI) => {
  const state:any = thunkApI.getState()
  if(state.project.cancelToken){
    state.project.cancelToken.cancel("Aborting")
  }
  const source = axios.CancelToken.source()
  thunkApI.dispatch(addingCancelToken(source))
  if(param?.q?.length === 0 && state?.project?.cancelToken){
    thunkApI.dispatch(addingCancelToken(undefined))
  }
  try{
    const response = await axiosInstance.get(BACKEND_ROUTE.ADD_PROPERTY, {
      cancelToken: param?.q?.length > 0 ? source.token : undefined,
      params: param
    })
    
  
    return response.data
  }catch(e:any){
    if(e?.message === 'Aborting'){
      return e
    }} 
})

export const patchProjectStatus = createAsyncThunk('appProject/patchProject', async (param: any) => {
  try {
    const response = await axiosInstance.patch(BACKEND_ROUTE.PROPERTY.replace(':id', param.id), param.data)

    return response
  } catch (e: any) {
  }
})



export const postPropertyStatus = createAsyncThunk('appProject/postProject', async (param: any, thunkApI) => {
  const response = await axiosInstance.patch(`${BACKEND_ROUTE.ADD_PROPERTY}/${param.id}`, {
    step: 'status',
    propertyStatus: param.status
  })
  if (!response.data) {
    if(param.status === 'reject'){
      toast.success('Property declined successfully')
    }else{
      toast.success('Property approved successfully')
    }
    if(param.payload){
      thunkApI.dispatch(getProject(param.payload))
    }
  }

  return response.data
})


export const appProjectSlice = createSlice({
  name: 'appProject',
  initialState: {
    formErrors: {},
    projects: {},
    pagination: {},
    loading: false,
    cancelToken:undefined
  },
  reducers: {
    resetFormErrors: (state: any, action: any) => {
      const check = state.formErrors
      check[action.payload] = false
      state.formErrors = check
    },
    addingCancelToken: (state: any, action: any) => {
      state.cancelToken = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(getProject.pending, state => {
      state.loading = true
      state.projects = []
      state.pagination = {}
    })
    builder.addCase(getProject.fulfilled, (state, action) => {
      if(action?.payload?.message !== 'Aborting'){
        state.loading = false
        state.projects = action?.payload?.data
        state.pagination = action?.payload?.meta?.pagination
      }
    })
    builder.addCase(getProject.rejected, (state) => {
        state.loading = false
        state.projects = []
    })
    builder.addCase(patchProjectStatus.pending, state => {
      state.loading = true
    })
    builder.addCase(patchProjectStatus.fulfilled, (state,action:any) => {
      if(action?.payload?.status !== 204){
        state.loading = false
      }
    })

    builder.addCase(patchProjectStatus.rejected, state => {
      state.loading = false
    })
  }
})

export const { resetFormErrors,addingCancelToken } = appProjectSlice.actions

export default appProjectSlice.reducer
