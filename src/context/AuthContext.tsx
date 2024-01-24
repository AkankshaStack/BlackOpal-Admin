// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'
import { axiosInstance } from 'src/utilities/configureAxios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType } from './types'
import { initializeNotifiation, removeLoader, setLoader } from 'src/store/apps/user'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import BACKEND_ROUTES from 'src/common/constant'
import { browserSignature } from 'src/utilities/conversions'
import { initializer } from 'src/configs/firebase'
import { fetchNotification } from 'src/store/settings/tnc'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<any>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)
  const dispatch = useDispatch<AppDispatch>()

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setIsInitialized(true)
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const isServiceWorkerRegister = await navigator.serviceWorker.getRegistrations()
      await initializer()

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userTokenData: any = window.localStorage.getItem(authConfig.storagedataKeyName)!

      if (storedToken) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        axiosInstance
          .get(BACKEND_ROUTES.GET_PROFILE, {
            params: {
              include: 'roles'
            }
          })
          .then(res => {
            if (res.data.success) {
              dispatch(
                fetchNotification({
                  page: 1,
                  perPage: 15,
                  singlePage: true
                })
              )
              setUser({ ...res.data.data, role: 'admin' })
              if (window.location.href.includes('login')) {
                router.push('/')
              }
              setLoading(false)
            }
          })
          .catch(() => {
            setLoading(false)
          })
      } else {
        setLoading(false)
        router.push('/login')
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //Allowlogin:- check kr lunga
  // Popup for muyltiple login for freelancer

  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    dispatch(setLoader())

    const signature = window.localStorage.getItem('signature')
    if (!signature) {
      const signature123 = browserSignature()
      window.localStorage.setItem('signature', signature123)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isServiceWorkerRegister = await navigator.serviceWorker.getRegistrations()
    await initializer()
    await dispatch(initializeNotifiation())

    axiosInstance
      .post(authConfig.loginEndpoint, params)
      .then(async res => {
        if (res.data.success) {
          window.localStorage.setItem(authConfig.storageTokenKeyName, res.data.data.token)
          axiosInstance
            .get(BACKEND_ROUTES.GET_PROFILE, {
              headers: { Authorization: `Bearer ${res.data.data.token}` },
              params: {
                include: 'roles'
              }
            })
            .then(res => {
              dispatch(removeLoader())
              if (res.data.success) {
                setUser({ ...res.data.data, role: 'admin' })
                router.push('/')
                setLoading(false)
              }
            })
            .catch(() => {
              setLoading(false)
              dispatch(removeLoader())
            })

          // window.localStorage.setItem(
          //   authConfig.storagedataKeyName,
          //   JSON.stringify({ ...res.data.data, role: 'admin' })
          // )
          // setUser({ ...res.data.data, role: 'admin' })
          // router.push('/')
        }
      })
      .catch(err => {
        dispatch(removeLoader())
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    setIsInitialized(false)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then(function (registrations) {
          for (const registration of registrations) {
            registration.unregister()
          }
        })
        .catch(function (err) {
          console.log('Service Worker registration failed: ', err)
        })
    }
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({
            email: params.email,
            password: params.password,
            loginType: 1
          })
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
