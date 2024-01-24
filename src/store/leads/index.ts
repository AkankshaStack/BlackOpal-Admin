import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import BACKEND_ROUTE from 'src/common/constant'
import { axiosInstance } from 'src/utilities/configureAxios'
import axios, { CancelTokenSource } from 'axios'
import { intitalState, leadDetailsPayload, leadPayload, partnerleadPayload } from './types'
import { RootState } from '..'

export const errors = (err: any) => {
    const messages: any = {}
    Object.keys(err).forEach(key => {
      const errorMessage = err[key]
      if (!errorMessage) return ''
      messages[key] = typeof errorMessage === 'string' ? errorMessage : errorMessage.join(', ')
    })
  
    return messages
  }

  export const getLead = createAsyncThunk('appLead/getLead', async (param:partnerleadPayload, thunkApI) => {
    const state:RootState = thunkApI.getState() as RootState
    if (state.leads.cancelToken) {
      (state.leads.cancelToken as CancelTokenSource).cancel('Aborting')
    }
    const source = axios.CancelToken.source()
    thunkApI.dispatch(addingCancelToken(source))
    if (param?.payload?.q?.length === 0 && state?.leads?.cancelToken) {
      thunkApI.dispatch(addingCancelToken(undefined))
    }
    try {
      const response = await axiosInstance.get(BACKEND_ROUTE.PARTNER_LEAD.replace(':id',param?.id), {
        cancelToken: param?.payload?.q? source.token : undefined,
        params: param?.payload
      })
  
      return response.data
    } catch (e: any) {
      if (e?.message === 'Aborting') {
        return e
      }
    }
  })

  export const leadDetails = createAsyncThunk('appLead/leadDetails', async (param:leadDetailsPayload) => {
    try {
      const response = await axiosInstance.get(BACKEND_ROUTE.LEADS_DETAILS.replace(':id',param.id), {
        params: param.payload
      })
  
      return response.data
    } catch (e: any) {
        return e      
    }
  })

  export const verifyLead = createAsyncThunk('appLead/verifyLead', async (param:leadDetailsPayload) => {
    try {
      const response = await axiosInstance.put(BACKEND_ROUTE.LEADS_DETAILS.replace(':id',param.id), param.data)

      return response.data
    } catch (e: any) {
        return e      
    }
  })
  
  export const closeLead = createAsyncThunk('appLead/closeLead', async (param:leadPayload, thunkApI) => {
    const state:RootState = thunkApI.getState() as RootState
    if (state.leads.cancelToken) {
      (state.leads.cancelToken as CancelTokenSource).cancel('Aborting')
    }
    const source = axios.CancelToken.source()
    thunkApI.dispatch(addingCancelToken(source))
    if (param?.q?.length === 0 && state?.leads?.cancelToken) {
      thunkApI.dispatch(addingCancelToken(undefined))
    }
    try {
      const response = await axiosInstance.get(BACKEND_ROUTE.LEADS, {
        cancelToken: param?.q ? source.token : undefined,
        params: param
      })
  
      return response.data
    } catch (e: any) {
      if (e?.message === 'Aborting') {
        return e
      }
    }
  })

 
export const appLeadSlice = createSlice({
    name: 'appLead',
    initialState:{
      formErrors: {},
      data: [],
      pagination: {},
      leadData: {},
      searchActiveLeads: '',
      closeLeads: [],
      closeLeadsPagination: {},
      loading: false,
      verifyLoading: false,
      closeLeadLoading: false,
      cancelToken: undefined
    } as intitalState,
    reducers: {
      resetFormErrors: (state: any, action) => {
        const check = state.formErrors
        check[action.payload] = false
        state.formErrors = check
      },
      setSearchActiveLeads: (state, action: PayloadAction<string>) => {
        state.searchActiveLeads = action.payload
      },
      addingCancelToken: (state, action) => {
        state.cancelToken = action.payload
      }
    },
    extraReducers: builder => {
      builder.addCase(getLead.pending, state => {
        state.loading = true
      })
      builder.addCase(getLead.fulfilled, (state,action) => {
        if (action?.payload?.message !== 'Aborting') {
          state.data = action?.payload?.data
          state.pagination = action?.payload?.meta?.pagination
          state.loading = false
        }
      })
      builder.addCase(getLead.rejected, (state, action) => {
        state.formErrors = action.payload as Record<string, any>
        state.loading = false
      })
      builder.addCase(closeLead.pending, state => {
        state.closeLeadLoading = true
      })
      builder.addCase(closeLead.fulfilled,(state,action) => {
        if (action?.payload?.message !== 'Aborting') {
        state.closeLeads = action?.payload?.data
        state.closeLeadsPagination = action?.payload?.meta?.pagination
        state.closeLeadLoading = false
      }
      })
      builder.addCase(closeLead.rejected, (state, action) => {
        state.formErrors = action.payload as Record<string, any>
        state.closeLeadLoading = false
      })
      builder.addCase(verifyLead.pending, state => {
        state.verifyLoading = true
      })
      builder.addCase(verifyLead.fulfilled, state => {
        state.verifyLoading = false
      })
      builder.addCase(verifyLead.rejected, (state) => {
        state.verifyLoading = false
      })
      builder.addCase(leadDetails.pending, state => {
        state.loading = true
      })
      builder.addCase(leadDetails.fulfilled, (state,action) => {
        state.leadData = action?.payload?.data
        state.loading = false
      })
      builder.addCase(leadDetails.rejected, (state, action) => {
        state.loading = false
        state.formErrors = action.payload as Record<string, any>
      })
    }
  })

  export const { resetFormErrors, addingCancelToken,setSearchActiveLeads } = appLeadSlice.actions
  
  export default appLeadSlice.reducer
  