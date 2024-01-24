// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import BACKEND_ROUTES from 'src/common/constant'
import { axiosInstance } from 'src/utilities/configureAxios'




// ** Axios Imports
// ** Fetch Users
export const fetchfaqData = createAsyncThunk('appFaq/fetchData', async (params:any) => {
  const response = await axiosInstance.get(BACKEND_ROUTES.SETTING,{params})


  return response.data
})

export const postfaqData = createAsyncThunk('appFaq/postData', async (params:any) => {
  const response = await axiosInstance.post(BACKEND_ROUTES.SETTING, params)
  
return response.data
})

export const deletefaqData = createAsyncThunk('appFaq/deleteData', async (params:any) => {
  const response = await axiosInstance.post(BACKEND_ROUTES.SETTING, params)
  
return response.data
})

export const appFaqSlice = createSlice({
  name: 'appFaq',
  initialState: {
    data: [],
    loading:false,
    postloading:false
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchfaqData.pending, (state ) => {
      state.loading = true
      state.data=[]
    })
    builder.addCase(fetchfaqData.fulfilled, (state, action) => {
      let check = []
      try{
        check = JSON.parse(action?.payload?.data?.value?.text)
      }catch(e){
        check = action?.payload?.data?.value?.text 
      }
      if(check.length > 0 ){
      check.forEach((item:any, i:number) => {
        item.id = i + 1;
      });
      }
      state.loading = false
      state.data = check
    })
    builder.addCase(fetchfaqData.rejected, (state) => {
      state.loading = false
      state.data = []
    })
    builder.addCase(postfaqData.pending, (state) => {
      state.loading = true
    })
    builder.addCase(postfaqData.fulfilled, (state, action) => {
      state.loading = false
      action.payload.data.value.text.forEach((item:any, i:number) => {
        item.id = i + 1;
      });
      state.data = action.payload.data.value.text   
      toast.success('FAQ Added Successfully')
    })
    builder.addCase(deletefaqData.pending, (state) => {
      state.loading = true
    })
    builder.addCase(deletefaqData.fulfilled, (state, action) => {
      state.loading = false
      action.payload.data.value.text.forEach((item:any, i:number) => {
        item.id = i + 1;
      });
      state.data = action.payload.data.value.text   
      toast.success('FAQ Deleted Successfully')
    })
    builder.addCase(deletefaqData.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(postfaqData.rejected, (state) => {
      state.loading = false
      state.data = []
    })
  }
})
export default appFaqSlice.reducer
