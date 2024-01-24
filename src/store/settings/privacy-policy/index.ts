// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import { axiosInstance } from 'src/utilities/configureAxios'
import BACKEND_ROUTES from 'src/common/constant'
import toast from 'react-hot-toast'

interface value {
  text: string
}

interface DataParams {
  key: string
  value?: value
}

// ** Fetch Users
export const fetchprivacy = createAsyncThunk('appUsers/fetchprivacy', async (params: DataParams) => {
  const response = await axiosInstance.get(BACKEND_ROUTES.SETTING, {
    params
  })

  return response.data
})

// Post privacy
export const postprivacy = createAsyncThunk('appUsers/postprivacy', async (params: DataParams) => {
  const response = await axiosInstance.post(BACKEND_ROUTES.SETTING, params)

  return response.data
})

export const appPrivacySlice = createSlice({
  name: 'appPrivacy',
  initialState: {
    data: '',
    loading: true
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchprivacy.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchprivacy.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload.data.value.text
    })
    builder.addCase(fetchprivacy.rejected, state => {
      state.loading = false
      state.data = ''
    })
    builder.addCase(postprivacy.pending, state => {
      state.loading = true
    })
    builder.addCase(postprivacy.fulfilled, state => {
      state.loading = false
      toast.success('Successfully Updated')
    })
    builder.addCase(postprivacy.rejected, state => {
      state.loading = false
    })
  }
})

export default appPrivacySlice.reducer
