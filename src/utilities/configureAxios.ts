import axios from 'axios'
import Router from 'next/router'
import toast from 'react-hot-toast'
import { browserSignature } from './conversions'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_HOST,
  timeout: 30000
})

const getGenericErrorMessage = (e: any) => {
  if(e?.message === 'Aborting'){
    return
  } 
  const text = e.response?.data?.errors
    ? Object.values(e.response?.data?.errors)[0]
    : e.response?.data?.message || 'Something went wrong!'
  toast.error(text)
}

axiosInstance.interceptors.request.use(request => {
  const storedToken = window.localStorage.getItem('accessToken')!
  let signature  = window.localStorage.getItem('signature')! 
  if(!signature){
    signature =  browserSignature()
    window.localStorage.setItem('signature',signature)
  }
  request.headers!['x-device-client'] = 'agent-admin-panel'
  request.headers!['x-platform-app'] = 'web'
  request.headers!['x-device-hash'] = signature
  if (storedToken) {
    request.headers!.Authorization = `Bearer ${storedToken}`
  }

  return request
})

axiosInstance.interceptors.response.use(
  res => {
    return res
  },
  error => {
    if (error?.response?.status === 401 || error?.response?.status === 402) {
      if (window.location.pathname !== '/' && window.location.pathname !== '/login/') {
        toast.error(error.response?.data?.message || 'Unauthorized Access')
        window.localStorage.removeItem('accessToken')
        window.location.replace('/login')
      }
      Router.push('/login')
    }

    if (error?.response?.status === 500) {
      toast.error('Internal Server Error')
    }
    else{
      if(error?.response?.status !== 422){
        getGenericErrorMessage(error)
      }
    }
    throw error
  }
)

export const authInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_HOST
})

authInstance.interceptors.request.use(request => {
  let signature  = window.localStorage.getItem('signature')! 
  if(!signature){
    signature =  browserSignature()
    window.localStorage.setItem('signature',signature)
  }
  request.headers!['x-device-client'] = 'agent-admin-panel'
  request.headers!['x-platform-app'] = 'web'
  request.headers!['x-device-hash'] = signature
  
  return request
})
authInstance.interceptors.response.use(
  res => {
    return res
  },
  error => {
    if (error?.response?.status === 401 || error?.response?.status === 402) {
      Router.push('/login')
    }
    if (error?.response?.status === 500) {
      toast.error('Internal Server Error')

      // Router.push('/500')
    } else {
      if (error?.response?.status !== 422) {
        getGenericErrorMessage(error)
      }
    }

    throw error
  }
)
