// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import { axiosInstance } from 'src/utilities/configureAxios'
import BACKEND_ROUTES from 'src/common/constant'
import toast from 'react-hot-toast'
import { pagination } from 'src/common/types'

interface value {
  text: string
}

interface DataParams {
  key: string
  value?: value
}



// ** Fetch Users
export const fetchtnc = createAsyncThunk('appUsers/tnc', async (params: DataParams) => {
  const response = await axiosInstance.get(BACKEND_ROUTES.SETTING, {
    params
  })

  return response.data
})

// Post TnC
export const posttnc = createAsyncThunk('appUsers/posttnc', async (params: DataParams) => {
  const response = await axiosInstance.post(BACKEND_ROUTES.SETTING, params)

  return response.data
})

export const fetchNotification = createAsyncThunk('appTnc/fetchNotification', async (param:{page?:number,perPage?:number,singlePage?:boolean}) => {
  const response = await axiosInstance.get(BACKEND_ROUTES.NOTIFICATION,{params:param})

  return response
})
export const postNotification = createAsyncThunk('appTnc/postNotification', async (param:{id:number,status:number},thunkApi) => {
  const response = await axiosInstance.post(BACKEND_ROUTES.NOTIFICATION,param)
  if(response.status === 204){
    thunkApi.dispatch(resetnotificationDataCount())
  }

  return response.data
})


export const appTNCSlice = createSlice({
  name: 'appTNC',
  initialState: {
    data: '',
    loading: true,
    notificationData: [],
    notifiactionLoading: false,
    notifiactionPgination: {},
    unreadNotificationCount:0
  }as {
    data: any,
    notificationData: any,
    notifiactionPgination: pagination,
    notifiactionLoading: boolean,
    loading: boolean,
    unreadNotificationCount:number
  },
  reducers: {
    setnotificationData: (state,action) => {
      state.notificationData = action.payload.index
    },
    resetnotificationDataCount: (state) => {
      state.unreadNotificationCount = 0
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchtnc.pending, state => {
      state.loading = true
      state.data = ''
    })
    builder.addCase(fetchtnc.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload.data.value.text
    })
    builder.addCase(fetchtnc.rejected, state => {
      state.loading = false
      state.data = ''
    })
    builder.addCase(posttnc.pending, state => {
      state.loading = true
    })
    builder.addCase(posttnc.fulfilled, state => {
      state.loading = false
      toast.success('Successfully Updated')
    })
    builder.addCase(posttnc.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(fetchNotification.pending, state => {
      state.notifiactionLoading = true
    })
    builder.addCase(fetchNotification.fulfilled, (state, action) => {
      if(state.notifiactionPgination?.currentPage === action?.payload?.data?.meta?.pagination?.currentPage || action?.meta?.arg?.singlePage){
        state.notificationData = action?.payload?.data?.data || []
        state.notifiactionPgination = action?.payload?.data?.meta?.pagination || []
      }else{
        state.notificationData = [...state?.notificationData,...action?.payload?.data?.data] || []
        state.notifiactionPgination = action?.payload?.data?.meta?.pagination || []
      }
      state.unreadNotificationCount = action?.payload?.data?.meta?.unreadNotificationCount
      state.notifiactionLoading = false
    })
    builder.addCase(fetchNotification.rejected, (state, ) => {
      state.notifiactionLoading = false
    })
  }
})

export const {
  setnotificationData,
  resetnotificationDataCount
} = appTNCSlice.actions

export default appTNCSlice.reducer
