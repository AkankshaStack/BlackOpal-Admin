import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import BACKEND_ROUTES from 'src/common/constant'
import axios, { AxiosResponse, CancelTokenSource } from 'axios'
import { axiosInstance } from 'src/utilities/configureAxios'
import { RootState } from '..'
import { pagination } from 'src/common/types'

interface buyingGuideDataPayload {
  id: number
  data: {
    title: string
    subtitle: string
    body: any
    videoLink: string
    imageSlug: string
    status: number
  }
}

export const getBuyingGuide = createAsyncThunk(
  'appBuyingGuide/getBuyingGuide',
  async (
    param: {
      q?: string
      perPage: number
      page: number
    },
    thunkApI
  ) => {
    try {
      const state: RootState = thunkApI.getState() as RootState
      if (state.buyingGuide.cancelToken) {
        ;(state.buyingGuide.cancelToken as CancelTokenSource).cancel('Aborting')
      }
      const source = axios.CancelToken.source()
      thunkApI.dispatch(addingCancelToken(source))
      if (param?.q?.length === 0 && state?.buyingGuide?.cancelToken) {
        thunkApI.dispatch(addingCancelToken(undefined))
      }

      const response = await axiosInstance.get(BACKEND_ROUTES.BUYING_GUIDE, {
        cancelToken: param?.q ? source.token : undefined,
        params: param
      })

      return response.data
    } catch (e: any) {
      if (e?.message === 'Aborting') {
        return e
      }
    }
  }
)

export const getSingleBuyingGuide = createAsyncThunk(
  'appBuyingGuide/getSingleBuyingGuide',
  async (param: { id: number }) => {
    const response = await axiosInstance.get(BACKEND_ROUTES.SINGLE_BUYING_GUIDE.replace(':id', String(param.id)))

    return response.data
  }
)

export const updateBuyingGuide = createAsyncThunk(
  'appBuyingGuide/updateBuyingGuide',
  async (param: buyingGuideDataPayload) => {
    const response = await axiosInstance.patch(
      BACKEND_ROUTES.SINGLE_BUYING_GUIDE.replace(':id', String(param.id)),
      param.data
    )
    if (response.data.status === 204) {
      toast.success('Collection updated successfully')
    }

    return response
  }
)

export const createBuyingGuide = createAsyncThunk(
  'appBuyingGuide/createBuyingGuide',
  async (param: buyingGuideDataPayload['data']) => {
    const response = await axiosInstance.post(BACKEND_ROUTES.BUYING_GUIDE, param)
    if (response.data.status === 200) {
      toast.success('Collection created successfully')
    }

    return response.data
  }
)

export const appBuyingGuideSlice = createSlice({
  name: 'appBuyingGuide',
  initialState: {
    loading: false,
    data: [],
    formError: {},
    pagination: {
      currentPage: 0
    },
    buyingGuideData: {},
    cancelToken: undefined
  } as {
    loading: boolean
    data: any
    formError: { [key: string]: string }
    cancelToken: CancelTokenSource | undefined
    pagination: pagination
    buyingGuideData: any
  },
  reducers: {
    addingCancelToken: (state, action) => {
      state.cancelToken = action.payload
    },
    resetGuideData: state => {
      state.buyingGuideData = {}
    }
  },
  extraReducers: builder => {
    builder.addCase(getBuyingGuide.pending, state => {
      state.loading = true
    })
    builder.addCase(getBuyingGuide.fulfilled, (state, action) => {
      if (action?.payload?.message !== 'Aborting') {
      state.loading = false
      state.data = action?.payload?.data
      state.pagination = action?.payload?.meta?.pagination}
    })
    builder.addCase(getBuyingGuide.rejected, state => {
      state.loading = false
      state.data = []
    })
    builder.addCase(getSingleBuyingGuide.pending, state => {
      state.loading = true
    })
    builder.addCase(getSingleBuyingGuide.fulfilled, (state, action) => {
      state.loading = false
      state.buyingGuideData = action?.payload?.data
    })
    builder.addCase(getSingleBuyingGuide.rejected, state => {
      state.loading = false
      state.buyingGuideData = {}
    })
    builder.addCase(updateBuyingGuide.pending, state => {
      state.loading = true
    })
    builder.addCase(updateBuyingGuide.fulfilled, (state, action: PayloadAction<AxiosResponse>) => {
      if (action?.payload?.status !== 204) {
        state.loading = false
      }
    })
    builder.addCase(updateBuyingGuide.rejected, state => {
      state.loading = false
      state.buyingGuideData = {}
    })
  }
})

export const { addingCancelToken, resetGuideData } = appBuyingGuideSlice.actions

export default appBuyingGuideSlice.reducer
