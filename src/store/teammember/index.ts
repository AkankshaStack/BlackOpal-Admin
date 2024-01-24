import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import { axiosInstance } from 'src/utilities/configureAxios'

import BACKEND_ROUTE from 'src/common/constant'

  

  export const getTeamMember = createAsyncThunk('appTeamMember/getProject', async (param: any,thunkApi) => {
    const stateData:any = thunkApi.getState()    
    if(stateData?.teammember?.search?.length > 0){
        param.data.q = stateData?.teammember?.search
    }
    const response = await axiosInstance.get(BACKEND_ROUTE.GET_TEAM_MEMBER.replace(':id',param.partnerId),{
            params:param.data
        }
        )
        
        return response.data
  
  })

  export const fetchSingleTeamMember = createAsyncThunk('appTeamMember/fetchSingleTeamMember', async (param: any) => {
    const response = await axiosInstance.get(BACKEND_ROUTE.SINGLE_USER.replace(':id',param.id),{
      params:param.data
    })
        
        return response.data
  })

  export const getPartnerProject = createAsyncThunk('appTeamMember/getPartnerProject', async (param: any,thunkApi) => {
    const stateData:any = thunkApi.getState()    
    if(stateData?.teammember?.searchProject?.length > 0){
        param.data.q = stateData?.teammember?.searchProject
    }
    const response = await axiosInstance.get(BACKEND_ROUTE.GET_USER_PROJECT.replace(':id',param.partnerId),{
            params:param.data
        }
        )

        return response.data
  
  })

  export const appTeamMemberSlice = createSlice({
    name: 'appTeamMember',
    initialState: {
      data: [],
      pagination: {
        currentPage:0
      },
      singleTeamMemberData:{},
      search:'',
      searchProject:'',
      loading: false,
      profileLoading: false,
      projects:[],
      projectPagination: {
        currentPage:0
      },
    },
    reducers: {
        setSearch:(state, action) => {
        state.search = action.payload
        if(state?.pagination?.currentPage > 1){
            state.pagination = {
                ...state.pagination,
                currentPage:1
            }
        }
         },
        setProjectSearch:(state, action) => {
        state.searchProject = action.payload
        if(state?.projectPagination?.currentPage > 1){
            state.projectPagination = {
                ...state.projectPagination,
                currentPage:1
            }
        }
        },
    },
    extraReducers: builder => {
      builder.addCase(getTeamMember.pending, state => {
        state.loading = true
      })
      builder.addCase(getTeamMember.fulfilled, (state, action) => {
        state.loading = false
        state.data = action?.payload?.data
        state.pagination = action?.payload?.meta?.pagination
      })
      builder.addCase(getTeamMember.rejected, state => {
        state.loading = false
        state.data = []
      })
      builder.addCase(fetchSingleTeamMember.pending, state => {
        state.loading = true
      })
      builder.addCase(fetchSingleTeamMember.fulfilled, (state, action) => {
        state.loading = false
        state.singleTeamMemberData = action?.payload?.data
      })
      builder.addCase(fetchSingleTeamMember.rejected, state => {
        state.loading = false
        state.singleTeamMemberData = {}
      })
      builder.addCase(getPartnerProject.pending, state => {
        state.loading = true
        state.projects = []
      })
      builder.addCase(getPartnerProject.fulfilled, (state, action) => {
        state.loading = false
        state.projects = action?.payload?.data
        state.projectPagination = action?.payload?.meta?.pagination
      })
      builder.addCase(getPartnerProject.rejected, state => {
        state.loading = false
      })
    }
  })
  
  export const {  setSearch,setProjectSearch } = appTeamMemberSlice.actions

  export default appTeamMemberSlice.reducer