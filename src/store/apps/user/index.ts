// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getMessaging, getToken } from 'firebase/messaging'

// ** Axios Imports
import axios from 'axios'
import BACKEND_ROUTES from 'src/common/constant'
import Router from 'next/router'
import toast from 'react-hot-toast'
import { axiosInstance } from 'src/utilities/configureAxios'
import config from 'src/configs/config'

interface DataParams {
  q: string
  role: string
  status: string
  currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

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

// ** Fetch Users
export const fetchData = createAsyncThunk('appUsers/fetchData', async (params: DataParams) => {
  const response = await axios.get('/apps/users/list', {
    params
  })

  return response.data
})

export const fetchsingleData = createAsyncThunk('appUsers/fetchsingleData123', async (params: any) => {
  const response = await axiosInstance.get(BACKEND_ROUTES.SINGLE_USER.replace(':id', params.id), {
    params: params.payload
  })

  return response.data
})

export const fetchOtpForgortPass = createAsyncThunk('appUsers/fetchOtpForgortPass', async (param: any, thunkApi) => {
  const { email } = param
  try {
    const response = await axiosInstance.post('/admin/auth/forgot-password', { email })

    return response
  } catch (e: any) {
    if (e?.response?.status === 422) {
      return thunkApi.rejectWithValue(errors(e.response.data.errors))
    }
  }
})

export const resetPassword = createAsyncThunk('appUsers/resetPassword', async (param: any, thunkApi) => {
  try {
    const response = await axiosInstance.put('/admin/auth/reset-password', param.data)

    return response.data
  } catch (e: any) {
    if (e?.response?.status === 422) {
      return thunkApi.rejectWithValue(errors(e.response.data.errors))
    }
  }
})

export const changePassword = createAsyncThunk('appUsers/changePassword', async (param: any, thunkApi) => {
  try {
    const response = await axiosInstance.post('/admin/auth/change-password', param)
    if (response.data.success) {
      toast.success('Password Updated Successfully')
      window.localStorage.removeItem('accessToken')
      window.localStorage.removeItem('user')
      window.open('/login', '_self')
    }

    return response.data
  } catch (e: any) {
    if (e?.response?.status === 422) {
      return thunkApi.rejectWithValue(errors(e.response.data.errors))
    }
  }
})

export const patchApprove = createAsyncThunk('appUsers/patchApprove', async (params: any, thunkAPI) => {
  let finalPayload: any = []
  const state: any = thunkAPI.getState()
  if (state.user.verifyProfile.length > state.user.activeStep) {
    finalPayload = [...state.user.verifyProfile]
    finalPayload[state.user.activeStep] = params.payload
  } else {
    finalPayload = params.payload
  }
  try {
    const response = await axiosInstance.patch(
      BACKEND_ROUTES.USER_APPROVED.replace(':id', state?.user?.singleData?.userDetails?.id),
      { verifyProfile: finalPayload }
    )
    if (response.data.success) {
      toast.success('Successfully Updated')
      if (params.payload[0].status === 0) {
        Router.push('/agent-approvals/pending-approvals')
      } else {
        thunkAPI.dispatch(approved(
        {     
    reset:true
        }))
        if (state.user.activeStep === 2) {
          // thunkAPI.dispatch(reset())
          Router.push('/agent-approvals/pending-approvals')
        }
      }
      if (state.user.activeStep === 2) {
        // thunkAPI.dispatch(reset())
        Router.push('/agent-approvals/pending-approvals')
      }
    }

    return response.data
  } catch (e) {}
})

export const postData = createAsyncThunk('appUsers/postData', async (params: any) => {
  const response = await axios.get('/apps/users/list', {
    params
  })

  return response.data
})

export const userData = createAsyncThunk('appUsers/postData', async (params: any) => {
  const response = await axios.patch(BACKEND_ROUTES.USER_LIST.replace(':id', 'ddd'), {
    params
  })

  return response.data
})

// ** Add User
export const addUser = createAsyncThunk(
  'appUsers/addUser',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    const response = await axios.post('/apps/users/add-user', {
      data
    })
    dispatch(fetchData(getState().user.params))

    return response.data
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete('/apps/users/delete', {
      data: id
    })
    dispatch(fetchData(getState().user.params))

    return response.data
  }
)
const step = (data: any) => {
  const orgType = data?.userDetails?.orgType
  let activeStep = 0

  if (orgType !== config.orgType.company && data?.panCertificates?.length > 0) {
    if (data?.panCertificates[0].status === 1) {
      activeStep += 1
    }
  }
  if (orgType === config.orgType.company && data?.gstCertificates?.length > 0) {
    if (data?.gstCertificates[0].status === 1) {
      activeStep += 1
    }
  }
  if (data?.reraCertificates?.length > 0) {
    if (data?.reraCertificates[0].status === 1) {
      activeStep += 1
    }
  }

  return activeStep
}
export const verifyOtpCommon = createAsyncThunk('appUsers/verifyOtpCommon', async (param: {
  email?: string,
  emailOTP?: string,
  contactMobileNumber?:string,
  mobileOTP?: string,
  purpose?:string
}, thunkApi) => {
  try {
    const response = await axiosInstance.post(BACKEND_ROUTES.VERIFY_OTP_COMMON, param)

    return response.data
  } catch (e: any) {
    if (e?.response?.status === 422) {
      return thunkApi.rejectWithValue(errors(e.response.data.errors))
    } else {
      return thunkApi.rejectWithValue('error')
    }
  }
})

export const initializeNotifiation = createAsyncThunk('appUsers/initializeNotifiation', async () => {
  const messaging = getMessaging()
  await getToken(messaging, {
    vapidKey: 'BDoCtgCyjrTnmwsJ-XVwU95LoftLVkzHbofH1RJkdnImNex78EM0JtY1D8H050-kA3de9K9dQ4q2t8WAoRTpju0',
    serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: process.env.NEXT_PUBLIC_WEBSITE_URL
    })
  })
    .then(async currentToken => {
      if (currentToken) {

        // Send the token to your server and update the UI if necessary
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await axiosInstance.post(BACKEND_ROUTES.DEVICES, {
          fcmToken: `${currentToken}`
        })
      } else {
        // Show permission request UI

        return
      }
    })
    .catch(err => {
      return err
    })
})

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: {},
    total: 1,
    params: {},
    allData: [],
    activeStep: 0,
    maxVerifiedStep: 0,
    verifyProfile: [],
    declined: false,
    singleData: {},
    stepNotes: [],
    loading: false,
    loginLoading: false,
    resetForm: false,
    formErrors: {},
    resetLoading:false,
    emailLoading:false,
    emailOtp:false
  },
  reducers: {
    approved: (state: any,action) => {
      if(!action.payload.reset){
        state.stepNotes[state.activeStep] = action.payload.notes
      }else{
        state.stepNotes[state.activeStep] = []
      }
      
      if (state.maxVerifiedStep > state.activeStep) {
        state.activeStep += 1
      } else if (state.maxVerifiedStep === state.activeStep) {
        state.activeStep += 1
        state.maxVerifiedStep += 1
      }
    },
    reset: (state: any) => {
      state.activeStep = 0
      state.maxVerifiedStep = 0
      state.stepNotes = []
    },
    removeOtpLoaders: (state,action) => {
      if(action.payload.verificationType === 1){
        state.emailOtp = false
        state.emailLoading = false
      }
  },
    setActiveStep: (state, action: any) => {
      state.activeStep = action.payload
    },
    setLoader: state => {
      state.loginLoading = true
    },
    removeLoader: state => {
      state.loginLoading = false
    },
    resetFormErors: (state: any, action: any) => {
      const check = state.formErrors
      if(check.hasOwnProperty(action.payload)){
        delete check[action.payload]
        state.formErrors = check
      }
    },
    resetForm1: state => {
      state.resetForm = false
      state.formErrors = {}
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.users
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    }),
      builder.addCase(fetchsingleData.pending, state => {
        state.loading = true
      }),
      builder.addCase(fetchsingleData.fulfilled, (state, action) => {
        state.loading = false
        const checkStep = step(action.payload.data)
        state.activeStep = checkStep
        state.maxVerifiedStep = checkStep
        state.singleData = action.payload.data
      }),
      builder.addCase(fetchsingleData.rejected, state => {
        state.loading = false
        state.data = {}
      })
    builder.addCase(patchApprove.pending, state => {
      state.loading = true
    }),
      builder.addCase(patchApprove.fulfilled, state => {
        state.loading = false
        
      }),
      builder.addCase(fetchOtpForgortPass.pending, state => {
        state.emailLoading = true
      }),
      builder.addCase(fetchOtpForgortPass.fulfilled, state => {
        state.resetForm = true
        state.emailLoading = false
      }),
      builder.addCase(fetchOtpForgortPass.rejected, (state, action) => {
        state.formErrors = action.payload as Record<string, any>
        state.emailLoading = false
      }),
      builder.addCase(patchApprove.rejected, state => {
        state.loading = false
      }),
      builder.addCase(resetPassword.fulfilled, () => {
        window.open('/login', '_self')
      }),
      builder.addCase(resetPassword.rejected, (state, action) => {
        state.formErrors = action.payload as Record<string, any>
      }),
      builder.addCase(changePassword.pending, state => {
        state.loading = true
      })
    builder.addCase(changePassword.fulfilled, state => {
      state.loading = false
    })
    builder.addCase(changePassword.rejected, (state,action) => {
      state.loading = false
      state.formErrors = action.payload as Record<string, any>
    })
    builder.addCase(verifyOtpCommon.pending, (state) => {
      state.emailOtp = false
      state.emailLoading = true
  })
  builder.addCase(verifyOtpCommon.fulfilled, (state) => {
    state.emailLoading = false
    state.emailOtp = true
  })
  builder.addCase(verifyOtpCommon.rejected, (state, action) => {
    state.emailOtp = false
    state.emailLoading = false
    state.formErrors = action.payload as Record<string, any>
  })
  }
})

export const { approved, reset, setLoader, removeLoader, setActiveStep, resetFormErors, resetForm1,removeOtpLoaders } =
  appUsersSlice.actions

export default appUsersSlice.reducer
