import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import BACKEND_ROUTES from 'src/common/constant'

// ** Axios Imports
import { axiosInstance } from 'src/utilities/configureAxios'
import toast from 'react-hot-toast'
import { addCollectionPropertiesType, collectionProperties } from './type'

const initialState: any = {
  loading: false,
  data: [],
  formError: {},
  pagination: {
    currentPage: 0
  },
  collectionData: {},
  collectionProperties: [],
  collectionPropertiesLoading: false,
  collectionPropertiesPagination: {
    currentPage: 0
  },
  addCollectionProperties: [],
  addCollectionPropertiesLoading: false,
  addCollectionPropertiesPagination: {
    currentPage: 0
  }

  //   collectionLoading: false,
  //   collectionData:[],
  //   projectPagination: {
  //     currentPage:0
  //   },
}

export const getCollections = createAsyncThunk('appCollections/getCollections', async (param: any) => {
  const response = await axiosInstance.get(BACKEND_ROUTES.COLLECTIONS, {
    params: param.data
  })

  return response.data
})

export const addCollection = createAsyncThunk('appCollections/addCollection', async (data: any) => {
  const response = await axiosInstance.post(BACKEND_ROUTES.COLLECTIONS, data)

  return response.data
})

export const getCollectionData = createAsyncThunk('appCollections/getCollectionData', async (param: any) => {
  const response = await axiosInstance.get(BACKEND_ROUTES.COLLECTION.replace(':id', param.id), {
    params: param.data
  })

  return response.data
})

export const getCollectionProperties = createAsyncThunk(
  'appCollections/getCollectionProperties',
  async (param: collectionProperties) => {

    const response = await axiosInstance.get(BACKEND_ROUTES.COLLECTION_PROPERTIES, {
      params: param
    })

    return response.data
  }
)
export const deleteCollection = createAsyncThunk('appCollections/deleteCollection', async (param: any, thunkApi) => {
  try {
    const response = await axiosInstance.delete(BACKEND_ROUTES.COLLECTION.replace(':id', param.id))

    const stateData: any = thunkApi.getState()
    if (response?.status === 200) {
      thunkApi.dispatch(
        getCollections({ include: 'city', perPage: 10, page: stateData?.collections?.pagination?.currentPage || 1 })
      )
    }
  } catch (err) {

    toast.error('Error While removing colleciton ')
  }
})

export const updateCollection = createAsyncThunk('appCollections/updateCollection', async (param: any) => {
  const response = await axiosInstance.patch(BACKEND_ROUTES.COLLECTION.replace(':id', param.id), param.data)

  return response.data
})

export const addCollectionProperties = createAsyncThunk(
  'appCollections/addCollectionProperties',
  async (param: addCollectionPropertiesType) => {
    const response = await axiosInstance.get(BACKEND_ROUTES.ADD_COLLECTION_PROPERTIES, {
      params: param
    })

    return response.data
  }
)

export const appCollectionsSlice = createSlice({
  name: 'appCollections',
  initialState,
  reducers: {
    resetStoreState: state => {
      Object.assign(state, initialState)
    },
    setLoader: (state,action) => {
      state.loading = action.payload.loader
      state.collectionProperties = action.payload.data
    },
    resetLoadingState: state => {
      state.loading = false
    }
  },
  extraReducers: builder => {
    builder.addCase(getCollections.pending, state => {
      state.loading = true
    })
    builder.addCase(getCollections.fulfilled, (state, action) => {
      state.loading = false
      state.data = action?.payload?.data
      state.pagination = action?.payload?.meta?.pagination
    })
    builder.addCase(getCollections.rejected, state => {
      state.loading = false
      state.data = []
    })
    builder.addCase(getCollectionData.pending, state => {
      state.loading = true
    })
    builder.addCase(getCollectionData.fulfilled, (state, action) => {
      state.loading = false
      state.collectionData = action?.payload?.data
    })
    builder.addCase(getCollectionData.rejected, state => {
      state.loading = false
      state.collectionData = {}
    })
    builder.addCase(addCollection.pending, state => {
      state.loading = true
    })
    builder.addCase(addCollection.fulfilled, (state,action) => {
      if(action.payload.data.code !== 200){
        state.loading = false
      }
    })
    builder.addCase(addCollection.rejected, state => {
      state.loading = false
    })
    builder.addCase(getCollectionProperties.pending, state => {
      state.collectionPropertiesLoading = true
    })
    builder.addCase(getCollectionProperties.fulfilled, (state, action) => {
      state.collectionPropertiesLoading = false
      state.collectionProperties = action?.payload?.data
      state.collectionPropertiesPagination = action?.payload?.meta?.pagination
    })
    builder.addCase(getCollectionProperties.rejected, state => {
      state.collectionPropertiesLoading = false
      state.collectionProperties = []
    })
    builder.addCase(addCollectionProperties.pending, state => {
      state.addCollectionPropertiesLoading = true
    })
    builder.addCase(addCollectionProperties.fulfilled, (state, action) => {
      state.addCollectionPropertiesLoading = false
      state.addCollectionProperties = action?.payload?.data
      state.addCollectionPropertiesPagination = action?.payload?.meta?.pagination
    })
    builder.addCase(addCollectionProperties.rejected, state => {
      state.addCollectionPropertiesLoading = false
      state.addCollectionProperties = []
    })
    builder.addCase(updateCollection.pending, state => {
      state.loading = true
    })

    builder.addCase(updateCollection.rejected, state => {
      state.loading = false
    })
  }
})

export const { resetStoreState, resetLoadingState,setLoader } = appCollectionsSlice.actions

export default appCollectionsSlice.reducer
