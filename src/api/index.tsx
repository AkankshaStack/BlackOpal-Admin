import { axiosInstance } from 'src/utilities/configureAxios'

export const fetchAnalyticsCustomer = async (data: any) => {
  const response = await axiosInstance.post('/analytics/admin/customer', data)

  return response
}

export const fetchAnalyticsGraphCustomer = async (data: any) => {
  const response = await axiosInstance.post('/analytics/admin/customer/graph/', data)

  return response.data
}
export const fetchAnalyticsAgent = async (data: any) => {
  const response = await axiosInstance.post('/analytics/admin/agent', data)

  return response
}

export const fetchAnalyticsGraphAgent = async (data: any) => {
  const response = await axiosInstance.post('/analytics/admin/agent/graph/', data)

  return response.data
}

export const cityData = async (data: any) => {
  const response = await axiosInstance.get('/customer/location/cities', {
    params: { q: data.searchValue }
  })

  return response.data
}

export const Subscription = async (data: any) => {
  const response = await axiosInstance.get('/partner/subscription-plans/', { params: { ...data } })

  return response.data
}

export const AddSubscription = async (data: any) => {
  console.log(data, '=====daat')
  const response = await axiosInstance.post('/admin/subscription-plans/addPlan', data)

  return response.data
}
export const UpdateSubscription = async (data: any) => {
  console.log(data, '=====daat')
  const response = await axiosInstance.patch('/admin/subscription-plans/updateStatus', data)

  return response.data
}

export const CustomerChampionData = async (data: any) => {
  console.log(data, '++++++data++++++')
  const response = await axiosInstance.get(`customerChampian/getCCList`, { params: { ...data } })

  return response.data
}

export const GetCustomerChampion = async (data: any) => {
  const response = await axiosInstance.get(`customerChampian/cCProjectinfo?id=${data}`)

  return response.data
}

export const GetCustomerChampionData = async (data: any) => {
  console.log(data, '++++++data++++++')
  const response = await axiosInstance.get(`customerChampian/getCCList?id=${data}`)

  return response.data
}

export const UpdateCCStatus = async (data: any) => {
  const response = await axiosInstance.patch(`customerChampian/updateStatus`, data)

  return response.data
}

export const BroadcastNotificationData = async (data: any) => {
  const response = await axiosInstance.get(`admin/notifications/broadcastNotificationList?${data}`)

  return response.data
}

export const BroadcastNotifications = async (data: any) => {
  const response = await axiosInstance.post('/admin/notifications/notifyAll', data)

  return response.data
}
export const CloseImage = async (data: any, userId: any) => {
  const response = await axiosInstance.patch(`customerChampian/removeMediaCCData/${userId}`, data)

  return response.data
}

export const FetchTransaction = async () => {
  const response = await axiosInstance.get(`/partner/users/transactions/`,
  {
    params: {
      page: 1,
      perPage: 10,
      include: 'order'
    }
  })

  return response?.data
}
