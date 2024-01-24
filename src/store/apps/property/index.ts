// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import BACKEND_ROUTES from 'src/common/constant'
import { axiosInstance } from 'src/utilities/configureAxios'

export interface placeWaliApiKaResponse {
  placeTypes?: any
  coordinate?: any
  placeId?: any
  placeName?: any
}

// ** Axios Imports
export const errors = (err: any) => {
  const messages: any = {}
  Object.keys(err).forEach(key => {
    const errorMessage = err[key]
    if (!errorMessage) return ''
    messages[key] = typeof errorMessage === 'string' ? errorMessage : errorMessage.join(', ')
  })

  return messages
}

export const fetchCountry = createAsyncThunk('appProperty/fetchCountry', async () => {
  const response = await axiosInstance.get(BACKEND_ROUTES.COUNTRY)

  return response.data
})

export const postBulkUpload = createAsyncThunk('appProperty/postBulkUpload', async (param:{key:string}) => {
  const response = await axiosInstance.post(BACKEND_ROUTES.BULK_UPLOAD,param)

  return response.data
})

export const downloadSampleCSV = createAsyncThunk('appProperty/downloadSampleCSV', async (params:{key:string}) => {
  const response = await axiosInstance.get(BACKEND_ROUTES.SETTING,{
    params
  })

  return response.data
})

export const fetchLocatlities = createAsyncThunk('appProperty/fetchLocatlities', async (param:{cityId:string}) => {
  const response = await axiosInstance.get(BACKEND_ROUTES.GET_LOCALITIES,{
    params:param
  })

  return response.data
})

export const fetchPropertyDetails = createAsyncThunk('appProperty/fetchPropertyDetails', async (param: any) => {
  const response = await axiosInstance.get(BACKEND_ROUTES.PROPERTY.replace(':id', param.id), {
    params: param.params
  })

  return response.data
})


export const fetchCategory = createAsyncThunk('appProperty/fetchCategory', async () => {
  const response = await axiosInstance.get(BACKEND_ROUTES.SETTING, {
    params: { key: 'rera-specification-categories' }
  })

  return response.data
})

export const patchPropertyDetails = createAsyncThunk(
  'appProperty/patchPropertyDetails',
  async (param: any, thunkApi) => {
    try {
      const response = await axiosInstance.patch(BACKEND_ROUTES.PROPERTY.replace(':id', param.id), param.params)
      if (response.status === 204) {
        toast.success('Details Saved Successfully')
        thunkApi.dispatch(
          fetchPropertyDetails({
            id: param.id,
            params: {
              include:
                'localities,tags,address,reraAnalytics,propertyInventory,homeloanPartners,developer,statusUpdatedByUser,listingStatusUpdatedByUser,amenities,createdByUser,details,nearbyBusiness'
            }
          })
        )
      }

      return response.data
    } catch (e: any) {
      if (e?.response?.status === 422) {
        return thunkApi.rejectWithValue(errors(e?.response?.data?.errors))
      } else {

        return new Error('something went wrong')
      }
    }
  }
)

export const deleteConfiguration = createAsyncThunk('appProject/deleteConfiguration', async (param: {
  id:string
  propertyId:number
},thunkApi) => {
  try {
    const response = await axiosInstance.delete(BACKEND_ROUTES.DELETE_CONFIGURATION.replace(':id', param.id))
    if(response?.status === 204){
      thunkApi.dispatch(
        fetchPropertyDetails({
          id: param.propertyId,
          params: {
            include:
              'localities,tags,address,reraAnalytics,propertyInventory,homeloanPartners,developer,statusUpdatedByUser,listingStatusUpdatedByUser,amenities,createdByUser,details,nearbyBusiness'
          }
        })
      )
    }
    
    return response
  } catch (e: any) {
  }
})
export const fetchAmenities = createAsyncThunk('appProperty/fetchAmenities', async () => {
  const response = await axiosInstance.get(BACKEND_ROUTES.AMENITIES)

  // const temp = await axiosInstance.get(
  //   'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/js?key=AIzaSyDEGBqjdVrWjRtl7SD3Nk_BJAVA5gWjq-c&libraries=geometry,drawing,places&v=weekly',
  //   {
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  //     }
  //   }
  // )

  return response.data
})

export const fetchTags = createAsyncThunk('appProperty/fetchTags', async () => {
  const response = await axiosInstance.get(BACKEND_ROUTES.TAGS)

  return response.data
})

export const fetchHomeloan = createAsyncThunk('appProperty/fetchHomeloan', async () => {
  const response = await axiosInstance.get(BACKEND_ROUTES.HOME_LOAN)

  return response.data
})

export const fetchDeveloper = createAsyncThunk('appProperty/fetchDeveloper', async () => {
  const response = await axiosInstance.get(BACKEND_ROUTES.DEVELOPER)

  return response.data
})

export const appPropertySlice = createSlice({
  name: 'appProperty',
  initialState: {
    amenities: [],
    data: {},
    tags: [],
    homeloan: [],
    developer: [],
    country: [],
    state: [],
    city: [],
    localities:[],
    district: [],
    category: [],
    formErrors: {},
    downloadLoading:false,
    downloadMappingLoading:false,
    bulkLoading:false,
    loading: false,
    postloading: false,
    disabled: false
  },
  reducers: {
    resetFormErors: (state: any, action: any) => {
      const check = state.formErrors
      check[action.payload] = false
      state.formErrors = check
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchPropertyDetails.pending, state => {
      state.loading = true
      state.data = []
    })
    builder.addCase(fetchPropertyDetails.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload.data
    })
    builder.addCase(fetchPropertyDetails.rejected, state => {
      state.loading = false
    })

    builder.addCase(fetchLocatlities.fulfilled, (state, action) => {
      state.localities = action.payload.data
    })
    builder.addCase(fetchLocatlities.rejected, (state) => {
      state.localities = []
    })
    builder.addCase(patchPropertyDetails.pending, state => {
      state.loading = true
    })
    builder.addCase(patchPropertyDetails.fulfilled, state => {
      state.disabled = false
    })
    builder.addCase(patchPropertyDetails.rejected, (state, action) => {
      state.loading = false
      state.formErrors = action.payload as Record<string, any>
    })
    builder.addCase(deleteConfiguration.pending, state => {
      state.loading = true
    })
    builder.addCase(deleteConfiguration.fulfilled, state => {
      state.disabled = false
    })
    builder.addCase(deleteConfiguration.rejected, (state, action) => {
      state.loading = false
      state.formErrors = action.payload as Record<string, any>
    })
    builder.addCase(downloadSampleCSV.pending, (state,action) => {
      if(action.meta.arg?.key === 'properties-bulk-import-sample'){ 
      state.downloadLoading = true
    }else{
        state.downloadMappingLoading = true
      }
    })
    builder.addCase(downloadSampleCSV.fulfilled, (state,action) => {
      if(action.meta.arg?.key === 'properties-bulk-import-sample'){
        state.downloadLoading = false
      }else{
        state.downloadMappingLoading = false
      }
    })
    builder.addCase(downloadSampleCSV.rejected, (state,action) => {
      if(action.meta.arg?.key === 'properties-bulk-import-sample'){
      state.downloadLoading = false 
    }else{
        state.downloadMappingLoading = false

      }
    })
    builder.addCase(postBulkUpload.pending, state => {
      state.bulkLoading = true
    })
    builder.addCase(postBulkUpload.fulfilled, state => {
      state.bulkLoading = false
    })
    builder.addCase(postBulkUpload.rejected, (state) => {
      state.bulkLoading = false
    })
    builder.addCase(fetchAmenities.pending, () => {
      // state.loading = true
    })
    builder.addCase(fetchAmenities.fulfilled, (state, action) => {
      // state.loading = false
      state.amenities = action.payload.data
    })
    builder.addCase(fetchAmenities.rejected, () => {
      // state.loading = false
    })
    builder.addCase(fetchTags.pending, () => {
      // state.loading = true
    })
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      // state.loading = false
      state.tags = action.payload.data
    })
    builder.addCase(fetchTags.rejected, () => {
      // state.loading = false
    })
    builder.addCase(fetchHomeloan.fulfilled, (state, action) => {
      state.homeloan = action.payload.data
    })
    builder.addCase(fetchDeveloper.fulfilled, (state, action) => {
      state.developer = action.payload.data
    })
    builder.addCase(fetchCountry.fulfilled, (state, action) => {
      state.country = action?.payload?.data
    })
    builder.addCase(fetchCategory.fulfilled, (state, action) => {
      state.category = action.payload.data.value
    })
  }
})

export const { resetFormErors } = appPropertySlice.actions

export default appPropertySlice.reducer
