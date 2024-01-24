import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import BACKEND_ROUTE from 'src/common/constant'
import { axiosInstance } from 'src/utilities/configureAxios'
import axios, { CancelTokenSource } from 'axios'
import { RootState } from '..'
import { intitalState, patchRefundParam, refundParam, transactionParam } from './type'



export const errors = (err: any) => {
    const messages: any = {}
    Object.keys(err).forEach(key => {
      const errorMessage = err[key]
      if (!errorMessage) return ''
      messages[key] = typeof errorMessage === 'string' ? errorMessage : errorMessage.join(', ')
    })
     
    return messages
  }

  export const getTransactions = createAsyncThunk('appTransaction/getTransactions', async (param:transactionParam,thunkApI) => {
    const state:RootState = thunkApI.getState() as RootState
    if (state.transaction.cancelToken) {
      (state.transaction.cancelToken as CancelTokenSource).cancel('Aborting')
    }
    const source = axios.CancelToken.source()
    thunkApI.dispatch(addingCancelToken(source))
    if (param?.q?.length === 0 && state?.transaction?.cancelToken) {
      thunkApI.dispatch(addingCancelToken(undefined))
    }
    try {
      const response = await axiosInstance.get(BACKEND_ROUTE.GET_TRANSACTION, {
        cancelToken: param?.q ? source.token : undefined,
        params: param
      })
  
      return response.data
    } catch (e: any) {
        return e      
    }
  })

  export const getRefundRequests = createAsyncThunk('appTransaction/getRefundRequests', async (param:refundParam,thunkApI) => {
    const state:RootState = thunkApI.getState() as RootState
    if (state.transaction.cancelToken) {
      (state.transaction.cancelToken as CancelTokenSource).cancel('Aborting')
    }
    const source = axios.CancelToken.source()
    thunkApI.dispatch(addingCancelToken(source))
    if (param?.q?.length === 0 && state?.transaction?.cancelToken) {
      thunkApI.dispatch(addingCancelToken(undefined))
    }
    try {
      const response = await axiosInstance.get(BACKEND_ROUTE.REFUND_REQUEST, {
        cancelToken: param?.q ? source.token : undefined,
        params: param
      })
  
      return response.data
    } catch (e: any) {
        return e      
    }
  })

  export const patchRefundRequest = createAsyncThunk('appTransaction/patchRefundRequest', async (param:patchRefundParam) => {

    try {
      const response = await axiosInstance.patch(BACKEND_ROUTE.REFUND_REQUEST,param)
  
      return response
    } catch (e: any) {
        return e      
    }
  })

  export const getPayments = createAsyncThunk('appTransaction/getPayments', async (param:transactionParam,thunkApI) => {
    const state:RootState = thunkApI.getState() as RootState
    if (state.transaction.cancelToken) {
      (state.transaction.cancelToken as CancelTokenSource).cancel('Aborting')
    }
    const source = axios.CancelToken.source()
    thunkApI.dispatch(addingCancelToken(source))
    if (param?.q?.length === 0 && state?.transaction?.cancelToken) {
      thunkApI.dispatch(addingCancelToken(undefined))
    }
    try {
      const response = await axiosInstance.get(BACKEND_ROUTE.GET_PAYMENTS, {
        cancelToken: param?.q ? source.token : undefined,
        params: param
      })
  
      return response.data
    } catch (e: any) {
        return e      
    }
  })


export const appTransactionSlice = createSlice({
    name: 'appTransaction',
    initialState:{
      formErrors: {},
      data: [],
      pagination: {},
      loading: false,
      cancelToken: undefined,
      paymentLoader:false,
      paymentLoading:false,
      paymentData:[],
      paymentPagination:{},
      refundLoading:false,
      refundData:[],
      refundPagination:{},
    } as intitalState,
    reducers: {
      resetFormErrors: (state: any, action) => {
        const check = state.formErrors
        check[action.payload] = false
        state.formErrors = check
      },
      addingCancelToken: (state, action) => {
        state.cancelToken = action.payload
      },

    },
    extraReducers: builder => {
      builder.addCase(getTransactions.pending, state => {
        state.loading = true
        state.data = []
      })
      builder.addCase(getTransactions.fulfilled, (state,action) => {
        state.data = action?.payload?.data
        state.pagination = action?.payload?.meta?.pagination
        state.loading = false
      })
      builder.addCase(getTransactions.rejected, (state, action) => {
        state.formErrors = action.payload as Record<string, any>
        state.loading = false
      })
      builder.addCase(getRefundRequests.pending, state => {
        state.refundLoading = true,
        state.refundData=[]
      })
      builder.addCase(getRefundRequests.fulfilled, (state,action) => {
        state.refundLoading = false
        state.data = action?.payload?.data || []
        state.pagination = action?.payload?.meta?.pagination || {}
      })
      builder.addCase(getRefundRequests.rejected, (state, action) => {
        state.formErrors = action.payload as Record<string, any>
        state.refundLoading = false
      })
      builder.addCase(patchRefundRequest.pending, state => {
        state.refundLoading = true
      })
      builder.addCase(patchRefundRequest.fulfilled, (state,action) => {
        if(action?.payload?.status !== 200){
          state.refundLoading = false
        }
      })
      builder.addCase(patchRefundRequest.rejected, (state, action) => {
        state.formErrors = action.payload as Record<string, any>
        state.refundLoading = false
      })
      builder.addCase(getPayments.pending, state => {
        state.paymentLoading = true
        state.paymentData = []
      })
      builder.addCase(getPayments.fulfilled, (state,action) => {
        state.paymentData = action?.payload?.data
        state.paymentPagination = action?.payload?.meta?.pagination
        state.paymentLoading = false
      })
      builder.addCase(getPayments.rejected, (state) => {
        state.paymentLoading = false
      })
    }
  })

  export const { resetFormErrors,addingCancelToken} = appTransactionSlice.actions
  
  export default appTransactionSlice.reducer
  