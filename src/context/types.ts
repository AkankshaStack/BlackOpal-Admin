export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  loginType:1
}

export type RegisterParams = {
  email: string
  username: string
  password: string
}

export type UserDataType = {
  id?: number
  role: string
  email?: string
  fullName?: string
  username?: string
  password?: string
  avatar?: string | null
}

export type AuthValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void
  logout: () => void
  isInitialized: boolean
  user: any
  setUser: (value: UserDataType | null) => void
  setIsInitialized: (value: boolean) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}

export interface NearbyPlaceData {
  businessType: number
  name: string
  distanceInMeters: number
  coordinates: Array<number>
  place_id: string
}