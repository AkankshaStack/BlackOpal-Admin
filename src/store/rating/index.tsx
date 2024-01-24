// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import { axiosInstance } from 'src/utilities/configureAxios'

import BACKEND_ROUTE from 'src/common/constant'

export const getPropertyRating = createAsyncThunk('appRating/patchProject', async (param: { id: string }) => {
  try {
    const response = await axiosInstance.get(BACKEND_ROUTE.RATING.replace(':id', param.id))

    return response.data
  } catch (e: any) {}
})

export const appRatingSlice = createSlice({
  name: 'appRating',
  initialState: {
    formErrors: {},
    data: [],
    pagination: {},
    loading: false,
    ratingData: [],
    ratingLoading: false,
    cancelToken: undefined
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getPropertyRating.pending, state => {
      state.ratingLoading = true
    })
    builder.addCase(getPropertyRating.fulfilled, (state, action: any) => {
      state.ratingLoading = false
      state.ratingData = action?.payload?.data || []
    })
    builder.addCase(getPropertyRating.rejected, state => {
      state.ratingLoading = false
    })
  }
})

export default appRatingSlice.reducer
