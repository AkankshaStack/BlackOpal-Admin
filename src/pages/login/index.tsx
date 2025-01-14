// ** React Imports
import { useState, ReactNode } from 'react'

// ** Next Imports

// ** MUI Components
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { LoadingButton } from '@mui/lab'
import { useSelector } from 'react-redux'
import MuiLink from '@mui/material/Link'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import Link from 'next/link'

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const LoginIllustration = styled('img')(({ theme }) => ({
  maxWidth: '48rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '38rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '30rem'
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required()
})

const defaultValues = {
  password: '',
  email: ''
}

interface FormData {
  email: string
  password: string
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const loading = useSelector((state: any) => state.user.loginLoading)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    const { email, password } = data
    auth.login({ email, password, loginType: 1 }, (err: any) => {
      if (err?.response) {
        if (err?.response?.status === 422) {
          if (Object.keys(err?.response?.data?.errors).length > 0) {
            Object.entries(err?.response?.data?.errors).map(([key, val]: any) => {
              setError(key, {
                type: 'manual',
                message: val[0]
              })
            })
          }

          // setError('email', {
          //   type: 'manual',
          //   message: 'Email or Password is invalid'
          // })
        }
      }
    })
  }

  const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <LoginIllustrationWrapper>
            <LoginIllustration
              alt='login-illustration'
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </LoginIllustrationWrapper>
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
        <Box
          sx={{
            p: 7,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: 'flex',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width='173' height='36' viewBox='0 0 173 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M10.2959 19.9124C9.22344 20.9849 7.7577 21.5569 5.86296 21.5569C4.71897 21.5569 3.64648 21.3066 2.60973 20.8061C1.60874 20.3056 0.714995 19.5549 0 18.5896L1.07249 17.0166C1.71599 17.8389 2.46673 18.4466 3.28898 18.8756C4.11122 19.3046 4.96922 19.5191 5.82721 19.5191C7.07845 19.5191 8.0437 19.1616 8.72294 18.4109C9.40219 17.6601 9.72393 16.5876 9.72393 15.1934V2.35924H1.96624V0.500244H11.9047V15.3006C11.9047 17.2669 11.3684 18.8399 10.2959 19.9124Z'
                  fill='#393939'
                />
                <path
                  d='M26.4531 21.7714C25.1303 21.7714 23.9148 21.5926 22.8066 21.1994C21.6983 20.8061 20.7689 20.2341 19.9824 19.4476C19.1959 18.6969 18.5881 17.7316 18.1591 16.5876C17.7301 15.4436 17.5156 14.1567 17.5156 12.6552V0.500244H19.9466V12.5479C19.9466 14.8359 20.5186 16.5519 21.6983 17.8031C22.8423 19.0186 24.4868 19.6264 26.5603 19.6264C28.5623 19.6264 30.1353 19.0544 31.315 17.8746C32.4948 16.7306 33.0668 14.9789 33.0668 12.6909V0.500244H35.4978V12.5122C35.4978 14.0494 35.2833 15.4079 34.8543 16.5519C34.4253 17.6959 33.8175 18.6611 33.031 19.4476C32.2445 20.2341 31.2793 20.8061 30.2068 21.1994C29.0271 21.5926 27.8116 21.7714 26.4531 21.7714Z'
                  fill='#393939'
                />
                <path
                  d='M50.0135 2.71733C48.9768 2.43133 47.9758 2.28833 47.0463 2.28833C45.5806 2.28833 44.3651 2.57432 43.4713 3.14632C42.5776 3.71832 42.1128 4.50481 42.1128 5.47005C42.1128 6.32805 42.3631 7.04304 42.8636 7.57929C43.3641 8.11553 43.9718 8.54453 44.6868 8.86628C45.4018 9.18803 46.4028 9.50977 47.6541 9.90302C49.1198 10.332 50.2995 10.7253 51.1933 11.1543C52.087 11.5475 52.8378 12.1553 53.4813 12.9418C54.1248 13.7282 54.4108 14.765 54.4108 16.0162C54.4108 17.1245 54.089 18.1255 53.4455 18.9835C52.802 19.8415 51.8725 20.5207 50.7285 20.9854C49.5488 21.4502 48.2261 21.7004 46.6888 21.7004C45.1873 21.7004 43.7216 21.4144 42.2916 20.8424C40.8616 20.2705 39.6461 19.484 38.6094 18.5545L39.6104 16.8385C40.5756 17.768 41.6838 18.483 42.9708 18.9835C44.2578 19.5197 45.5091 19.77 46.7246 19.77C48.3691 19.77 49.6918 19.4482 50.657 18.8047C51.6223 18.1612 52.1228 17.2675 52.1228 16.195C52.1228 15.3012 51.8725 14.5862 51.372 14.05C50.8715 13.478 50.2638 13.049 49.5488 12.763C48.8338 12.477 47.8328 12.1195 46.5101 11.7263C45.0443 11.2973 43.8646 10.8683 43.0066 10.475C42.1128 10.0818 41.3621 9.50978 40.7544 8.72328C40.1466 7.97254 39.8249 6.9358 39.8249 5.72031C39.8249 4.64781 40.1466 3.71831 40.7544 2.93182C41.3621 2.14532 42.2201 1.53759 43.3283 1.10859C44.4366 0.679593 45.7236 0.465088 47.1893 0.465088C48.3691 0.465088 49.5488 0.643835 50.7285 0.965582C51.9083 1.28733 52.945 1.75208 53.8745 2.32408L52.945 4.07582C52.0155 3.39657 51.0503 3.00333 50.0135 2.71733Z'
                  fill='#393939'
                />
                <path
                  d='M62.597 2.68098H55.3398V0.500244H72.2852V2.68098H65.028V21.4496H62.597V2.68098V2.68098Z'
                  fill='#393939'
                />
                <path
                  d='M87.9788 0.537109H92.8408V21.4507H87.9788V13.2283H79.2917V21.4507H74.4297V0.537109H79.2917V9.2958H87.9431V0.537109H87.9788Z'
                  fill='#393939'
                />
                <path
                  d='M115.509 18.5541C113.292 20.6276 110.611 21.6644 107.358 21.6644C104.14 21.6644 101.423 20.6276 99.207 18.5541C96.9905 16.4806 95.918 13.9067 95.918 10.8322C95.918 7.75769 97.0262 5.18371 99.207 3.11022C101.423 1.03674 104.105 0 107.358 0C110.575 0 113.292 1.03674 115.509 3.11022C117.725 5.18371 118.798 7.75769 118.798 10.8322C118.798 13.9424 117.69 16.5164 115.509 18.5541ZM113.864 10.8679C113.864 9.00894 113.257 7.4002 112.005 6.07746C110.754 4.75472 109.217 4.11122 107.394 4.11122C105.57 4.11122 104.033 4.75472 102.782 6.07746C101.531 7.4002 100.923 8.97319 100.923 10.8679C100.923 12.7269 101.531 14.3356 102.782 15.6226C104.033 16.9454 105.57 17.5889 107.394 17.5889C109.217 17.5889 110.754 16.9454 112.005 15.6226C113.221 14.3356 113.864 12.7269 113.864 10.8679Z'
                  fill='#393939'
                />
                <path
                  d='M146.43 21.4494V18.2319L157.834 4.53972H146.787V0.5H164.448V3.71748L153.079 17.3381H164.626V21.4136H146.43V21.4494Z'
                  fill='#393939'
                />
                <path
                  d='M2.57398 35.9647C2.18073 35.9647 1.85899 35.8932 1.53724 35.786C1.21549 35.6787 0.965243 35.5 0.714995 35.2855C0.500497 35.071 0.321748 34.785 0.178749 34.4632C0.0714995 34.1415 0 33.7482 0 33.3192V29.7443H0.679249V33.2835C0.679249 33.9627 0.857995 34.4632 1.17974 34.8207C1.50149 35.1782 1.96624 35.357 2.57398 35.357C3.14598 35.357 3.57498 35.1782 3.93247 34.8565C4.25422 34.5347 4.43297 33.9985 4.43297 33.355V29.78H5.11222V33.2835C5.11222 33.7482 5.04072 34.1415 4.93347 34.4632C4.82622 34.785 4.64747 35.071 4.39722 35.3212C4.18272 35.5357 3.89672 35.7145 3.57498 35.8217C3.28898 35.929 2.96723 35.9647 2.57398 35.9647Z'
                  fill='black'
                />
                <path
                  d='M10.2969 29.7441H10.9404L14.8013 34.6776V29.7441H15.4806V35.8931H14.9443L10.9761 30.8524V35.8931H10.2969V29.7441Z'
                  fill='black'
                />
                <path d='M20.7344 29.7441H21.4136V35.2496H24.8813V35.8931H20.7344V29.7441V29.7441Z' fill='black' />
                <path
                  d='M32.5327 35.999C32.068 35.999 31.639 35.9275 31.2457 35.7487C30.8525 35.57 30.5307 35.3555 30.2447 35.0695C29.9587 34.7835 29.7442 34.426 29.6012 34.0685C29.4582 33.6752 29.3867 33.282 29.3867 32.853C29.3867 32.424 29.4582 32.0308 29.6012 31.6375C29.7442 31.2443 29.9587 30.9225 30.2447 30.6365C30.5307 30.3505 30.8525 30.1003 31.2457 29.9573C31.639 29.7785 32.068 29.707 32.5327 29.707C32.9975 29.707 33.4264 29.7785 33.8197 29.9573C34.2129 30.136 34.5347 30.3505 34.8207 30.6365C35.1067 30.9225 35.3212 31.28 35.4642 31.6375C35.6072 32.0308 35.6787 32.424 35.6787 32.853C35.6787 33.282 35.6072 33.6752 35.4642 34.0685C35.3212 34.4617 35.1067 34.7835 34.8207 35.0695C34.5347 35.3555 34.2129 35.6057 33.8197 35.7487C33.4264 35.8917 32.9975 35.999 32.5327 35.999ZM32.5327 35.3555C32.8902 35.3555 33.2119 35.284 33.4979 35.141C33.7839 34.998 34.0342 34.8192 34.2487 34.6047C34.4632 34.3902 34.6419 34.1043 34.7492 33.8183C34.8564 33.4965 34.9279 33.1748 34.9279 32.853C34.9279 32.4955 34.8564 32.1738 34.7492 31.852C34.6419 31.5303 34.4632 31.28 34.2487 31.0655C34.0342 30.851 33.7839 30.6723 33.4979 30.5293C33.2119 30.3863 32.8902 30.3148 32.5327 30.3148C32.1752 30.3148 31.8535 30.3863 31.5675 30.5293C31.2815 30.6723 31.0312 30.851 30.8167 31.0655C30.6022 31.28 30.4235 31.566 30.3162 31.852C30.209 32.1738 30.1375 32.4955 30.1375 32.8173C30.1375 33.1748 30.209 33.4965 30.3162 33.8183C30.4235 34.14 30.6022 34.3902 30.8167 34.6047C31.0312 34.8192 31.2815 34.998 31.5675 35.141C31.8535 35.284 32.1752 35.3555 32.5327 35.3555Z'
                  fill='black'
                />
                <path
                  d='M43.4339 35.9996C43.0049 35.9996 42.5759 35.9281 42.2184 35.7493C41.8609 35.5706 41.5034 35.3561 41.2531 35.0701C40.9671 34.7841 40.7526 34.4623 40.6096 34.0691C40.4666 33.6758 40.3594 33.2826 40.3594 32.8178C40.3594 32.3889 40.4309 31.9599 40.6096 31.6024C40.7526 31.2091 40.9671 30.8874 41.2531 30.6014C41.5391 30.3154 41.8609 30.1009 42.2184 29.9221C42.6116 29.7434 43.0049 29.6719 43.4696 29.6719C43.7556 29.6719 44.0058 29.7076 44.2203 29.7434C44.4348 29.7791 44.6493 29.8506 44.8638 29.9579C45.0426 30.0294 45.2213 30.1366 45.4001 30.2796C45.5788 30.3869 45.7218 30.5299 45.8648 30.6729L45.4001 31.1734C45.1498 30.9231 44.8638 30.7086 44.5421 30.5656C44.2561 30.4226 43.8628 30.3154 43.4696 30.3154C43.1478 30.3154 42.8261 30.3869 42.5401 30.4941C42.2541 30.6371 42.0039 30.8159 41.7894 31.0304C41.5749 31.2449 41.3961 31.5309 41.2889 31.8169C41.1816 32.1386 41.1101 32.4604 41.1101 32.8178C41.1101 33.1753 41.1816 33.4971 41.2889 33.8188C41.3961 34.1406 41.5749 34.3908 41.7894 34.6053C42.0039 34.8198 42.2541 34.9986 42.5401 35.1416C42.8261 35.2846 43.1478 35.3561 43.4696 35.3561C43.8986 35.3561 44.2561 35.2846 44.5421 35.1058C44.8638 34.9628 45.1498 34.7483 45.4358 34.4623L45.9006 34.9271C45.7576 35.1058 45.5788 35.2488 45.4001 35.3561C45.2213 35.4991 45.0426 35.6063 44.8281 35.6778C44.6136 35.7851 44.3991 35.8566 44.1846 35.8923C43.9701 35.9638 43.7199 35.9996 43.4339 35.9996Z'
                  fill='black'
                />
                <path
                  d='M50.6211 29.7428H51.3003V33.3893L54.8396 29.707H55.7333L53.0878 32.3883L55.8406 35.856H54.9826L52.6231 32.8888L51.3003 34.2115V35.856H50.6211V29.7428Z'
                  fill='black'
                />
                <path d='M60.4883 29.7443H61.1675V35.8932H60.4883V29.7443Z' fill='black' />
                <path
                  d='M66.4961 29.7441H67.1396L71.0006 34.6776V29.7441H71.6798V35.8931H71.1436L67.1753 30.8524V35.8931H66.4961V29.7441Z'
                  fill='black'
                />
                <path
                  d='M79.7932 35.9996C79.2927 35.9996 78.8637 35.9281 78.5062 35.7493C78.113 35.5706 77.7912 35.3561 77.541 35.0701C77.255 34.7841 77.0762 34.4623 76.9333 34.0691C76.7903 33.6758 76.7188 33.2826 76.7188 32.8536C76.7188 32.4246 76.7903 32.0314 76.9333 31.6381C77.0762 31.2449 77.2908 30.9231 77.5768 30.6371C77.8628 30.3511 78.1845 30.1009 78.542 29.9221C78.9352 29.7434 79.3285 29.6719 79.7932 29.6719C80.0435 29.6719 80.2937 29.6719 80.5082 29.7076C80.7227 29.7434 80.9372 29.7791 81.116 29.8506C81.2947 29.9221 81.4735 29.9936 81.6165 30.1009C81.7952 30.2081 81.9382 30.3154 82.0812 30.4584L81.6165 30.9946C81.5092 30.8874 81.3662 30.7801 81.259 30.7086C81.116 30.6371 81.0087 30.5656 80.83 30.4941C80.687 30.4226 80.5082 30.3869 80.3295 30.3511C80.1507 30.3154 79.9362 30.3154 79.7217 30.3154C79.4 30.3154 79.0782 30.3869 78.7922 30.5299C78.5062 30.6729 78.256 30.8516 78.0415 31.0661C77.827 31.2806 77.684 31.5666 77.541 31.8526C77.4338 32.1744 77.3623 32.4961 77.3623 32.8178C77.3623 33.1753 77.4338 33.5329 77.541 33.8188C77.6483 34.1406 77.827 34.3908 78.0415 34.6411C78.256 34.8556 78.5062 35.0343 78.7922 35.1773C79.0782 35.3203 79.4357 35.3561 79.7932 35.3561C80.1507 35.3561 80.4725 35.2846 80.7942 35.1773C81.116 35.0701 81.3662 34.9271 81.5807 34.7483V33.2111H79.7217V32.6033H82.26V35.0343C81.974 35.2846 81.6165 35.4991 81.1875 35.7136C80.7942 35.8923 80.3295 35.9996 79.7932 35.9996Z'
                  fill='black'
                />
                <path
                  d='M93.4844 29.7441H94.1636V32.4611H97.7028V29.7441H98.3821V35.8931H97.7028V33.1404H94.1636V35.8931H93.4844V29.7441Z'
                  fill='black'
                />
                <path
                  d='M105.926 29.707H106.569L109.358 35.8917H108.607L107.892 34.283H104.532L103.817 35.8917H103.102L105.926 29.707ZM107.642 33.6395L106.248 30.4935L104.853 33.6395H107.642Z'
                  fill='black'
                />
                <path
                  d='M114.113 29.7441H116.401C116.759 29.7441 117.045 29.7799 117.331 29.8871C117.617 29.9944 117.867 30.1016 118.046 30.2804C118.26 30.4591 118.403 30.6379 118.511 30.8881C118.618 31.1384 118.689 31.3886 118.689 31.7104C118.689 32.0321 118.618 32.3181 118.511 32.5684C118.368 32.8186 118.225 33.0331 117.974 33.2119C117.76 33.3906 117.51 33.4979 117.224 33.6051C116.938 33.6766 116.616 33.7481 116.294 33.7481H114.793V35.9289H114.113V29.7441V29.7441ZM116.33 33.1046C116.58 33.1046 116.795 33.0689 117.009 32.9974C117.224 32.9259 117.402 32.8544 117.545 32.7114C117.688 32.6041 117.796 32.4611 117.903 32.2824C117.974 32.1036 118.01 31.9249 118.01 31.7104C118.01 31.2814 117.867 30.9239 117.545 30.7094C117.259 30.4949 116.83 30.3876 116.33 30.3876H114.757V33.1046H116.33Z'
                  fill='black'
                />
                <path
                  d='M123.48 29.7441H125.768C126.126 29.7441 126.412 29.7799 126.698 29.8871C126.984 29.9944 127.234 30.1016 127.413 30.2804C127.627 30.4591 127.77 30.6379 127.878 30.8881C127.985 31.1384 128.056 31.3886 128.056 31.7104C128.056 32.0321 127.985 32.3181 127.878 32.5684C127.735 32.8186 127.592 33.0331 127.341 33.2119C127.127 33.3906 126.877 33.4979 126.591 33.6051C126.305 33.6766 125.983 33.7481 125.661 33.7481H124.16V35.9289H123.48V29.7441V29.7441ZM125.697 33.1046C125.947 33.1046 126.162 33.0689 126.376 32.9974C126.591 32.9259 126.769 32.8544 126.912 32.7114C127.055 32.6041 127.163 32.4611 127.27 32.2824C127.341 32.1036 127.377 31.9249 127.377 31.7104C127.377 31.2814 127.234 30.9239 126.912 30.7094C126.626 30.4949 126.197 30.3876 125.697 30.3876H124.124V33.1046H125.697Z'
                  fill='black'
                />
                <path d='M132.918 29.7443H133.597V35.8932H132.918V29.7443Z' fill='black' />
                <path
                  d='M138.926 29.7441H139.569L143.43 34.6776V29.7441H144.109V35.8931H143.573L139.605 30.8524V35.8931H138.926V29.7441V29.7441Z'
                  fill='black'
                />
                <path
                  d='M149.363 29.7441H153.796V30.3519H150.043V32.4611H153.403V33.0689H150.043V35.2139H153.832V35.8216H149.363V29.7441Z'
                  fill='black'
                />
                <path
                  d='M160.874 35.9644C160.374 35.9644 159.945 35.8929 159.516 35.7142C159.122 35.5354 158.729 35.3209 158.336 34.9634L158.765 34.4629C159.087 34.7489 159.408 34.9634 159.73 35.1064C160.052 35.2494 160.445 35.3209 160.874 35.3209C161.303 35.3209 161.625 35.2137 161.875 35.0349C162.125 34.8562 162.233 34.6059 162.233 34.2842C162.233 34.1412 162.197 34.0339 162.161 33.8909C162.125 33.7479 162.018 33.6764 161.911 33.5692C161.804 33.4619 161.625 33.3904 161.41 33.3189C161.196 33.2474 160.946 33.1759 160.624 33.1044C160.266 33.033 159.98 32.9257 159.694 32.8542C159.444 32.7469 159.23 32.6397 159.051 32.4967C158.872 32.3537 158.765 32.175 158.658 31.9962C158.586 31.8175 158.55 31.603 158.55 31.3527C158.55 31.1025 158.586 30.888 158.693 30.6735C158.801 30.459 158.944 30.2802 159.122 30.1372C159.301 29.9942 159.516 29.887 159.766 29.7797C160.016 29.7082 160.266 29.6367 160.588 29.6367C161.053 29.6367 161.446 29.7082 161.768 29.8155C162.09 29.9585 162.447 30.1372 162.733 30.3875L162.34 30.9237C162.054 30.6735 161.768 30.5305 161.482 30.4232C161.196 30.316 160.874 30.2802 160.588 30.2802C160.195 30.2802 159.873 30.3875 159.623 30.5662C159.373 30.745 159.265 30.9952 159.265 31.2812C159.265 31.4242 159.301 31.5672 159.337 31.6745C159.373 31.7817 159.48 31.889 159.587 31.9962C159.694 32.1035 159.873 32.1749 160.088 32.2464C160.302 32.3179 160.588 32.3894 160.91 32.4609C161.589 32.6039 162.09 32.8185 162.411 33.1044C162.733 33.3904 162.912 33.7479 162.912 34.2127C162.912 34.4629 162.876 34.7132 162.769 34.9277C162.662 35.1422 162.519 35.3209 162.34 35.4639C162.161 35.6069 161.947 35.7499 161.696 35.8214C161.446 35.9287 161.16 35.9644 160.874 35.9644Z'
                  fill='black'
                />
                <path
                  d='M169.991 35.9644C169.491 35.9644 169.062 35.8929 168.633 35.7142C168.24 35.5354 167.846 35.3209 167.453 34.9634L167.882 34.4629C168.204 34.7489 168.526 34.9634 168.847 35.1064C169.169 35.2494 169.562 35.3209 169.991 35.3209C170.42 35.3209 170.742 35.2137 170.992 35.0349C171.243 34.8562 171.35 34.6059 171.35 34.2842C171.35 34.1412 171.314 34.0339 171.278 33.8909C171.243 33.7837 171.135 33.6764 171.028 33.5692C170.921 33.4619 170.742 33.3904 170.528 33.3189C170.313 33.2474 170.063 33.1759 169.741 33.1044C169.384 33.033 169.098 32.9257 168.812 32.8542C168.561 32.7469 168.347 32.6397 168.168 32.4967C167.989 32.3537 167.882 32.175 167.775 31.9962C167.703 31.8175 167.668 31.603 167.668 31.3527C167.668 31.1025 167.703 30.888 167.811 30.6735C167.918 30.459 168.061 30.2802 168.24 30.1372C168.418 29.9942 168.633 29.887 168.883 29.7797C169.133 29.7082 169.384 29.6367 169.705 29.6367C170.17 29.6367 170.563 29.7082 170.885 29.8155C171.207 29.9585 171.564 30.1372 171.85 30.3875L171.457 30.9237C171.171 30.6735 170.885 30.5305 170.599 30.4232C170.313 30.316 169.991 30.2802 169.705 30.2802C169.312 30.2802 168.99 30.3875 168.74 30.5662C168.49 30.745 168.383 30.9952 168.383 31.2812C168.383 31.4242 168.418 31.5672 168.454 31.6745C168.49 31.7817 168.597 31.889 168.704 31.9962C168.812 32.1035 168.99 32.1749 169.205 32.2464C169.419 32.3179 169.705 32.3894 170.027 32.4609C170.706 32.6039 171.207 32.8185 171.529 33.1044C171.85 33.3904 172.029 33.7479 172.029 34.2127C172.029 34.4629 171.993 34.7132 171.886 34.9277C171.779 35.1422 171.636 35.3209 171.457 35.4639C171.278 35.6069 171.064 35.7499 170.814 35.8214C170.563 35.9287 170.313 35.9644 169.991 35.9644Z'
                  fill='black'
                />
                <path d='M132.277 10.9039L142.681 21.6645V0.107422L132.277 10.9039Z' fill='#1E83BE' />
                <path d='M132.277 10.9039L121.945 0.107422V21.6645L132.277 10.9039Z' fill='#EF4749' />
                <path
                  d='M171.958 21.0202C171.815 21.1632 171.636 21.2347 171.457 21.2347C171.278 21.2347 171.1 21.1632 170.957 21.0202C170.814 20.8772 170.742 20.7342 170.742 20.5197C170.742 20.3409 170.814 20.1622 170.957 20.0192C171.1 19.8762 171.243 19.8047 171.457 19.8047C171.672 19.8047 171.815 19.8762 171.958 20.0192C172.101 20.1622 172.172 20.3409 172.172 20.5197C172.172 20.6984 172.101 20.8772 171.958 21.0202Z'
                  fill='#393939'
                />
                <path
                  d='M172.171 16.7655C172.171 17.4805 171.921 18.0525 171.456 18.553C170.992 19.0535 170.348 19.3037 169.597 19.3037C168.847 19.3037 168.203 19.0535 167.738 18.5172C167.274 17.981 167.023 17.3375 167.023 16.5867C167.023 15.836 167.274 15.1925 167.81 14.6562L168.561 15.264C168.167 15.693 167.989 16.122 167.989 16.5867C167.989 17.0157 168.132 17.409 168.418 17.7307C168.704 18.0525 169.097 18.2312 169.562 18.2312C170.026 18.2312 170.42 18.0882 170.741 17.7665C171.063 17.4447 171.206 17.0515 171.206 16.5867C171.206 16.122 170.992 15.693 170.563 15.264L171.242 14.6562C171.85 15.264 172.171 15.979 172.171 16.7655Z'
                  fill='#393939'
                />
                <path
                  d='M171.421 10.0086C171.921 10.5091 172.171 11.1525 172.171 11.9033C172.171 12.654 171.921 13.2975 171.421 13.798C170.92 14.2985 170.312 14.5488 169.597 14.5488C168.882 14.5488 168.275 14.2985 167.774 13.798C167.274 13.2975 167.023 12.654 167.023 11.9033C167.023 11.1525 167.274 10.5091 167.774 10.0086C168.275 9.50806 168.882 9.25781 169.597 9.25781C170.312 9.25781 170.92 9.50806 171.421 10.0086ZM170.741 13.0473C171.063 12.7613 171.206 12.368 171.206 11.9033C171.206 11.4385 171.063 11.0811 170.741 10.7593C170.42 10.4733 170.026 10.2946 169.562 10.2946C169.097 10.2946 168.668 10.4376 168.382 10.7593C168.06 11.0453 167.917 11.4385 167.917 11.9033C167.917 12.368 168.06 12.7255 168.382 13.0473C168.704 13.3333 169.097 13.512 169.562 13.512C170.026 13.512 170.455 13.3333 170.741 13.0473Z'
                  fill='#393939'
                />
                <path
                  d='M169.347 7.57785H172.064V8.65034H167.059V7.57785H167.989C167.667 7.43485 167.452 7.18461 167.274 6.89861C167.095 6.57686 167.023 6.25512 167.023 5.89762C167.023 5.11113 167.345 4.57488 167.989 4.28888C167.345 3.78838 167.023 3.18063 167.023 2.42989C167.023 1.85789 167.202 1.39315 167.56 1.0714C167.917 0.713905 168.418 0.535156 169.061 0.535156H172.136V1.60765H169.383C168.453 1.60765 167.989 2.00089 167.989 2.75163C167.989 3.10913 168.096 3.43088 168.346 3.68113C168.561 3.93138 168.918 4.07438 169.347 4.11013H172.136V5.18262H169.383C168.918 5.18262 168.561 5.25412 168.346 5.43287C168.132 5.61162 168.024 5.86187 168.024 6.21937C168.024 6.57686 168.132 6.89862 168.382 7.18461C168.561 7.43486 168.882 7.57785 169.347 7.57785Z'
                  fill='#393939'
                />
              </svg>
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</TypographyStyled>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      label='Email'
                      value={value}
                      inputProps={{
                        autocomplete: 'new-password',
                        form: {
                          autocomplete: 'off'
                        }
                      }}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder='Enter your email'
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      autoComplete='off'
                      inputProps={{
                        autoComplete: 'new-password123333333',
                        form: {
                          autoComplete: 'off'
                        }
                      }}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Box
                sx={{
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between'
                }}
              >
                <Link passHref href='/forgot-password'>
                  <Typography component={MuiLink} variant='body2' sx={{ color: 'primary.main', mt: 3 }}>
                    Forgot Password?
                  </Typography>
                </Link>
              </Box>
              <div>
                <LoadingButton
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  sx={{ mb: 7, mt: 7 }}
                  loading={loading}
                >
                  Login
                </LoadingButton>
              </div>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
