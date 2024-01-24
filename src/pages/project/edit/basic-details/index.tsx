import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { useState, useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import {
  Grid,
  FormControl,
  FormHelperText,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  createFilterOptions,
  IconButton
} from '@mui/material'
import { imagePreview } from 'src/common/types'
import { CheckboxBlankOutline, CheckboxMarked, Close, FileDocumentOutline } from 'mdi-material-ui'
import FileUploaderRestrictions from 'src/views/forms/form-elements/file-uploader/FileUploaderRestrictions'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import { DatePicker, LoadingButton, LocalizationProvider } from '@mui/lab'
import MyGoogleMap from 'src/views/googlemap/components/MyGoogleMap'
import UploadMultipleImageService from 'src/services/uploadMultipleImages'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { useSelector } from 'react-redux'
import { propertyProp } from 'src/common/types'
import config from 'src/configs/config'
import InputAdornment from '@mui/material/InputAdornment'
import ImagePreview from 'src/views/image-perview'
import { patchPropertyDetails, fetchHomeloan, fetchCountry, resetFormErors } from 'src/store/apps/property'
import LocationCard1 from 'src/pages/components/locationCard1'
import toast from 'react-hot-toast'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

interface location {
  lat: number | null
  lng: number | null
}
interface location1 {
  id: number
  name: string
}
interface address {
  countryId: location1
  stateId: location1
  cityId: location1
  pincode: number | undefined
  address: string
}

interface FormInputs1 {
  projectCode: string
  projectName: string
  isReraRegistered: boolean
  isParkingIncluded: boolean
  hasShoppingComplex: boolean
  landArea: number | undefined
  untis: number | undefined
  flat: number | undefined
  constructionType: number | undefined
  description: string
  address?: address
  maxLaunchPrice: number | undefined
  maxCurrentPrice: number | undefined
  marketRateInPaise: number | undefined
  unitsPerFloor: string | undefined
  flooring: number | undefined
  homeLoanPartners: FilmOptionType[]
  lat: number | null
  lng: number | null
  isImageUploaded?: any
  noOfSecurityTiers: number | undefined
  noOfTowers: number
  availabilityStatus?: number | undefined
  mediaLinkWalkthrough?: string
  mediaLinkConstructionUpdate?: string
  mediaLinkInterior?: string
  dataAsOn: Date
  priceOnDate: Date
}

interface FilmOptionType {
  id?: number
  name: string
  meta?: any
  createdAt?: string
  updatedAt?: string
  inputValue?: string
}

interface FileProp {
  name: string
  type: string
  size: number
}

const BasicDetails = (prop: propertyProp) => {
  const dispatch = useDispatch<AppDispatch>()

  const store = useSelector((state: any) => state.property)
  const formErrors = useSelector((state: any) => state.property.formErrors)

  // Additional loader for the property api call

  useEffect(() => {
    dispatch(fetchCountry())
    dispatch(fetchHomeloan())
    setLocation({
      lat: store?.data?.coordinates?.length ? store?.data?.coordinates[0] : null,
      lng: store?.data?.coordinates?.length ? store?.data?.coordinates[1] : null
    })
    if (store?.data?.images?.length > 0) {
      setFiles(store?.data?.images)
    }
    if (store?.data?.images?.length > 0) {
      setFiles(store?.data?.images)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [open, setOpen] = useState<imagePreview>({
    visible: false,
    url: ''
  })
  const [location, setLocation] = useState<location>({
    lat: null, //28.636126434109226,
    lng: null //77.28693167126478
  })
  const [files, setFiles] = useState<File[]>([])

  // setFiles(details?.images)

  const renderFilePreview: any = (file: FileProp | any) => {
    if (file?.type?.startsWith('image')) {
      return (
        <img
          width={38}
          height={38}
          alt={file?.name}
          className='upload-image'
          src={URL.createObjectURL(file as any)}
          onClick={() =>
            setOpen({
              visible: true,
              url: URL.createObjectURL(file as any)
            })
          }
        />
      )
    } else if (typeof file === 'string' && file?.includes('images')) {
      return (
        <img
          width={38}
          height={38}
          alt=''
          className='upload-image'
          src={process.env.NEXT_PUBLIC_IMAGE_URL + file}
          onClick={() =>
            setOpen({
              visible: true,
              url: process.env.NEXT_PUBLIC_IMAGE_URL + file
            })
          }
        />
      )
    } else {
      return <FileDocumentOutline />
    }
  }
  const common = yup.object().shape({
    name: yup.string().required(),
    inputValue: yup.string().notRequired()
  })
  const detailsSchema = yup.object().shape({
    projectName: yup
      .string()
      .strict(false)
      .trim()
      .max(250, 'Property name cannot be greater than 250 characters')
      .required('Please enter property name'),
    isReraRegistered: yup.boolean().required('Please select RERA registered'),
    isParkingIncluded: yup.boolean().required('Please select parking included'),
    landArea: yup
      .number()
      .moreThan(0, 'Land area should be more than 0')
      .typeError('Land area must be a number')
      .nullable()
      .max(1000, 'Land area must be between 0 to 1000'),
    untis: yup
      .number()
      .typeError('Units must be a number')
      .nullable()
      .min(0, 'Untis should be greater than 0')
      .integer('Please enter total no. of units'),
    flat: yup
      .number()
      .typeError('No. of parking/flat must be a number')
      .nullable()
      .min(0, 'No. of parking/flat must be between 0 to 8')
      .max(8, 'No. of parking/flat must be between 0 to 8'),
    constructionType: yup.number().moreThan(0, 'Please select construction type').nullable(),
    description: yup.string().strict(false).trim().required('Please enter property description'),
    maxLaunchPrice: yup
      .number()
      .typeError('Indicative launch price must be a number')
      .max(10000000000, 'Indicative launch price should be less than 10000000000')
      .moreThan(0, 'Price should be more than 0')
      .nullable(),
    maxCurrentPrice: yup
      .number()
      .typeError('Indicative current price must be a number')
      .max(10000000000, 'Indicative current price should be less than 10000000000')
      .moreThan(0, 'Price should be more than 0')
      .nullable(),
    marketRateInPaise: yup
      .number()
      .typeError('Market rate must be a number')
      .moreThan(0, 'Market rate should be more than 0')
      .max(10000000000, 'Market rate should be less than 10000000000')
      .required('Please enter Market rate'),
    unitsPerFloor: yup
      .string()
      .trim()
      .matches(/^(\s*-?\d+(\.\d+)?)(\s*,\s*-?\d+(\.\d+)?)*$/, {
        message: 'Please enter comma serated decimal values',
        excludeEmptyString: true
      })
      .nullable()
      .optional()
      .notRequired(),
    flooring: yup.number().typeError('Flooring must be a number').moreThan(0, 'Please select flooring type').nullable(),
    address: yup.object().shape({
      cityId: yup.object().shape({
        id: yup.number().required('Please select city').moreThan(0, 'Please select city')
      }),
      stateId: yup.object().shape({
        id: yup.number().required('Please select state').moreThan(0, 'Please select state')
      }),
      countryId: yup.object().shape({
        id: yup.number().required('Please select country').moreThan(0, 'Please select country')
      }),
      address: yup.string().strict(false).trim().required('Please enter property address'),
      pincode: yup
        .string()
        .required('Please enter pincode')
        .matches(/^[1-9]\d{5}$/, 'Enter valid pincode')
        .min(6, 'Pincode must be exactly 6 digits')
        .max(6, 'Pincode must be exactly 6 digits')
    }),
    homeLoanPartners: yup.array(common).notRequired(),
    lat: yup.number().typeError('Latitude must be a number').required('Please select location'),
    lng: yup.number().typeError('Longitude must be a number').required('Please select location'),
    availabilityStatus: yup.number().integer('Please select Availabililty').required('Please select Availabililty'),
    noOfSecurityTiers: yup
      .number()
      .typeError('No of tower must be a number')
      .nullable()
      .integer('Please select Security tiers'),
    noOfTowers: yup.number().typeError('No of tower must be a number').nullable().integer('Please enter no of tower'),
    dataAsOn: yup.date().typeError('Please select data as on').required('Please select data as on'),
    priceOnDate: yup.date().typeError('Please select price on date').nullable().notRequired(),
    mediaLinkWalkthrough: yup
      .string()
      .strict(false)
      .trim()
      .matches(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/, {
        message: 'Please enter valid url',
        excludeEmptyString: true
      })
      .optional()
      .nullable()
      .notRequired(),
    mediaLinkConstructionUpdate: yup
      .string()
      .strict(false)
      .trim()
      .matches(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/, {
        message: 'Please enter valid url',
        excludeEmptyString: true
      })
      .optional()
      .nullable()
      .notRequired(),
    mediaLinkInterior: yup
      .string()
      .strict(false)
      .trim()
      .matches(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/, {
        message: 'Please enter valid url',
        excludeEmptyString: true
      })
      .optional()
      .nullable()
      .notRequired()
  })
  const handleRemoveFile = (file: FileProp | string | any) => {
    if (file?.name?.includes('/partner')) {
      const uploadedFiles = files
      const filtered = uploadedFiles.filter((i: any) => i !== file)
      setFiles([...filtered])

      return
    }
    if (typeof file === 'string') {
      const uploadedFiles = files
      const filtered = uploadedFiles.filter((i: FileProp | string) => {
        if (typeof i === 'string' && i !== file) {
          return i
        } else if (typeof i !== 'string') {
          return i
        }
      })
      setFiles([...filtered])

      return
    }
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const defaultValues: FormInputs1 = {
    projectCode: store?.data?.code || '',
    projectName: store?.data?.name || '',
    isReraRegistered: store?.data?.isReraRegisterd || false,
    hasShoppingComplex: store?.data?.hasShoppingComplex || false,
    isParkingIncluded: store?.data?.details?.isParkingIncluded || false,
    landArea: Number((store?.data?.details?.landAreaInSqft / 43560).toFixed(2)) || undefined,
    untis: store?.data?.details?.noOfUnits || undefined,
    flat: store?.data?.details?.noOfParkingPerFlat || undefined,
    constructionType: store?.data?.details?.constructionType || '',
    description: store?.data?.description || '',
    maxLaunchPrice: store?.data?.maxLaunchPriceInPaise / 100 || undefined,
    maxCurrentPrice: store?.data?.maxCurrentPriceInPaise / 100 || undefined,
    marketRateInPaise: store?.data?.marketRateInPaise / 100 || undefined,
    unitsPerFloor: store?.data?.details?.noOfUnitsPerFloor?.toString() || '',
    flooring: store?.data?.details?.flooringType || '',
    homeLoanPartners: store?.data?.homeloanPartners || [],
    lat: store?.data?.coordinates?.length ? store?.data?.coordinates[0] : null,
    lng: store?.data?.coordinates?.length ? store?.data?.coordinates[1] : null,
    noOfSecurityTiers: store?.data?.details?.noOfSecurityTiers || '',
    noOfTowers: store?.data?.noOfTowers >= 0 ? store?.data?.noOfTowers : null,
    availabilityStatus: store?.data?.availabilityStatus || '',
    dataAsOn: store?.data?.dataAsOn || new Date(),
    priceOnDate: store?.data?.priceOnDate || null,
    address: {
      cityId: store?.data.address?.city || {
        id: 0,
        name: ''
      },
      stateId: store?.data.address?.state || {
        id: 0,
        name: ''
      },
      countryId: store?.data.address?.country || {
        id: 0,
        name: ''
      },
      address: store?.data.address?.address || '',
      pincode: store?.data.address?.pincode || undefined
    },
    mediaLinkWalkthrough: store?.data?.mediaLinkWalkthrough || '',
    mediaLinkConstructionUpdate: store?.data?.mediaLinkConstructionUpdate || '',
    mediaLinkInterior: store?.data?.mediaLinkInterior || ''
  }

  useEffect(() => {
    if (Object.keys(store?.data)?.length > 0) {
      reset(defaultValues)
      setLocation({
        lat: store?.data?.coordinates?.length ? store?.data?.coordinates[0] : null,
        lng: store?.data?.coordinates?.length ? store?.data?.coordinates[1] : null
      })
      if (store?.data?.images?.length > 0) {
        setFiles(store?.data?.images)
      }
      if (store?.data?.images?.length > 0) {
        setFiles(store?.data?.images)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store?.data])

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isDirty, isValid },
    clearErrors
  } = useForm<FormInputs1>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(detailsSchema)
  })
  const addMarker = (lat: number, lng: number) => {
    if (location.lat !== lat) {
      clearErrors('lat')
    }
    if (location.lng !== lng) {
      clearErrors('lng')
    }
    setLocation({ lat, lng })
    setValue('lat', lat, { shouldDirty: true })
    setValue('lng', lng, { shouldDirty: true })
  }

  const [loader, setLoader] = useState<boolean>(false)
  const spacing = 6

  const onSubmit = async (data: any) => {
    if (files.length === 0) {
      toast.error('Please upload property images')

      return
    }
    const {
      projectName,
      description,
      constructionType,
      landArea,
      untis,
      unitsPerFloor,
      flooring,
      isReraRegistered,
      isParkingIncluded,
      flat,
      lat,
      lng,
      maxCurrentPrice,
      maxLaunchPrice,
      homeLoanPartners,
      address,
      noOfTowers,
      noOfSecurityTiers,
      availabilityStatus,
      hasShoppingComplex,
      marketRateInPaise,
      dataAsOn,
      mediaLinkWalkthrough,
      mediaLinkConstructionUpdate,
      mediaLinkInterior,
      priceOnDate
    } = data

    // Need to add new feilds
    const leftOut =
      files?.filter(i => {
        if (typeof i === 'string') {
          return i
        }
      }) || []

    const upload = files?.filter(i => {
      if (typeof i !== 'string') {
        return i
      }
    })

    const imagePayload: any = {
      files: upload,
      path: 'property/images'
    }

    setLoader(true)

    const images: any = await UploadMultipleImageService(imagePayload, setLoader)

    const payload = {
      step: 'basic-details',
      name: projectName,
      hasShoppingComplex,
      description: description,
      constructionType: constructionType,
      isReraRegisterd: isReraRegistered,
      isParkingIncluded: isParkingIncluded,
      landAreaInSqft: landArea * 43560 || 0,
      noOfUnits: Number(untis),
      noOfUnitsPerFloor: unitsPerFloor.split(','),
      flooringType: flooring,
      noOfParkingPerFlat: flat,
      coordinates: [Number(lat), Number(lng)],
      maxCurrentPriceInPaise: Number(maxCurrentPrice) * 100,
      maxLaunchPriceInPaise: Number(maxLaunchPrice) * 100,
      marketRateInPaise: Number(marketRateInPaise) * 100,
      images: [...leftOut, ...images],
      homeLoanPartners: homeLoanPartners?.map((val: any) => val?.name),
      address: {
        address: address?.address,
        pincode: address?.pincode,
        countryId: address?.countryId?.id,
        stateId: address?.stateId?.id,
        cityId: address?.cityId?.id
      },
      availabilityStatus,
      noOfTowers,
      noOfSecurityTiers,
      dataAsOn,
      priceOnDate,
      mediaLinkWalkthrough,
      mediaLinkConstructionUpdate,
      mediaLinkInterior
    }
    dispatch(
      patchPropertyDetails({
        id: prop.id,
        params: payload
      })
    ).then((res: any) => {
      if (res?.error?.message !== 'Rejected') {
        reset(data)
      }
    })

    setLoader(false)
  }

  const values = getValues()
  const icon = <CheckboxBlankOutline fontSize='small' />
  const checkedIcon = <CheckboxMarked fontSize='small' />
  const optionsData: FilmOptionType[] = store?.homeloan
  const filter = createFilterOptions<FilmOptionType>()

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '30px' }} noValidate>
        <Grid container sx={{ mb: spacing }} spacing={spacing}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='projectCode'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    disabled
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.projectCode)}
                    label='Project code'
                  />
                )}
              />
              {errors.projectCode && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors.projectCode.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='projectName'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={e => {
                      field.onChange(e)
                      dispatch(resetFormErors('name'))
                    }}
                    required
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      inputProps: {
                        maxLength: 250
                      }
                    }}
                    error={Boolean(errors.projectName || formErrors?.name)}
                    label='Property name'
                  />
                )}
              />
              {(errors.projectName || formErrors?.name) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.projectName?.message || formErrors?.name}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='landArea'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={e => {
                      if (
                        (e.target.value[0] === '0' && e.target.value.length === 2 && !e.target.value.includes('.')) ||
                        e.target.value.split('.')[1]?.length > 2
                      ) {
                        return
                      }
                      if (!e.target.value?.length) {
                        field.onChange(undefined)

                        return
                      }
                      field.onChange(e)
                      dispatch(resetFormErors('landAreaInSqft'))
                    }}
                    type='number'
                    InputProps={{
                      inputProps: { min: 0, max: 1000 }
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.landArea || formErrors?.landAreaInSqft)}
                    label='Land area(in acres)'
                  />
                )}
              />
              {(errors.landArea || formErrors?.landAreaInSqft) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.landArea?.message || formErrors?.landAreaInSqft}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='noOfTowers'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={e => {
                      if (
                        (e.target.value[0] === '0' && e.target.value.length === 2 && !e.target.value.includes('.')) ||
                        e.target.value.split('.')[1]?.length > 2
                      ) {
                        return
                      }
                      if (e.target.value?.length === 0) {
                        field.onChange(undefined)

                        return
                      }

                      field.onChange(e)

                      // dispatch(resetFormErors('landAreaInSqft'))
                    }}
                    type='number'
                    InputProps={{
                      inputProps: { min: 0, max: 1000 }
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.noOfTowers || formErrors?.noOfTowers)}
                    label='No of towers'
                  />
                )}
              />
              {/* // required={Number(watch('projectType')) === 2 || Number(watch('projectType')) === 4 ? false : true} */}
              {(errors.noOfTowers || formErrors?.noOfTowers) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.noOfTowers?.message || formErrors?.noOfTowers}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='untis'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={e => {
                      if (
                        (e.target.value[0] === '0' && e.target.value.length === 2 && !e.target.value.includes('.')) ||
                        e.target.value.split('.')[1]?.length > 2
                      ) {
                        return
                      }
                      if (e.target.value?.length === 0) {
                        field.onChange(undefined)

                        return
                      }
                      field.onChange(e)
                      dispatch(resetFormErors('noOfUnits'))
                    }}
                    type='number'
                    InputProps={{ inputProps: { min: 0, max: 1000 } }}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.untis || formErrors?.noOfUnits)}
                    label='Total number of units'
                  />
                )}
              />
              {(errors.untis || formErrors?.noOfUnits) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.untis?.message || formErrors?.noOfUnits}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='unitsPerFloor'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={e => {
                      if (
                        (e.target.value[0] === '0' && e.target.value.length === 2 && !e.target.value.includes('.')) ||
                        e.target.value.split('.')[1]?.length > 2
                      ) {
                        return
                      }
                      field.onChange(e)
                      dispatch(resetFormErors('unitsPerFloor'))
                    }}
                    type='string'
                    InputProps={{ inputProps: { min: 1, max: 50 } }}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.unitsPerFloor || formErrors?.unitsPerFloor)}
                    label='Average no. of units per floor'
                  />
                )}
              />
              {(errors.unitsPerFloor || formErrors?.unitsPerFloor) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.unitsPerFloor?.message || formErrors?.unitsPerFloor}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='flat'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={e => {
                      if (
                        (e.target.value[0] === '0' && e.target.value.length === 2 && !e.target.value.includes('.')) ||
                        e.target.value.split('.')[1]?.length > 2
                      ) {
                        return
                      }
                      if (!e.target.value.length) {
                        field.onChange(undefined)

                        return
                      }
                      field.onChange(e)
                      dispatch(resetFormErors('noOfParkingPerFlat'))
                    }}
                    type='number'
                    InputProps={{ inputProps: { min: 0, max: 4 } }}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.flat || formErrors?.noOfParkingPerFlat)}
                    label='No. of parking / flat'
                  />
                )}
              />
              {(errors.flat || formErrors?.noOfParkingPerFlat) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.flat?.message || formErrors?.noOfParkingPerFlat}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='maxLaunchPrice'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type='number'
                    onChange={e => {
                      if (e.target.value.includes('.')) {
                        return
                      }
                      if (!e.target.value.length) {
                        field.onChange(undefined)

                        return
                      }
                      field.onChange(e)
                      if (formErrors?.maxLaunchPriceInPaise) {
                        dispatch(resetFormErors('maxLaunchPriceInPaise'))
                      }
                    }}
                    InputProps={{
                      inputProps: { min: 1, max: 10000000000 },
                      endAdornment: <InputAdornment position='end'>INR/Sqft</InputAdornment>
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.maxLaunchPrice || formErrors?.maxLaunchPriceInPaise)}
                    label='Indicative launch price on saleable'
                  />
                )}
              />
              {(errors.maxLaunchPrice || formErrors?.maxLaunchPriceInPaise) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.maxLaunchPrice?.message || formErrors?.maxLaunchPriceInPaise}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='maxCurrentPrice'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={e => {
                      if (e.target.value.includes('.')) {
                        return
                      }
                      if (e.target.value[0] === '0' && e.target.value.length === 2 && e.target.value.includes('.')) {
                        return
                      }
                      if (!e.target.value.length) {
                        field.onChange(undefined)

                        return
                      }
                      field.onChange(e)
                      if (formErrors?.maxCurrentPriceInPaise) {
                        dispatch(resetFormErors('maxCurrentPriceInPaise'))
                      }
                    }}
                    type='number'
                    InputProps={{
                      inputProps: { min: 1, max: 10000000000 },
                      endAdornment: <InputAdornment position='end'>INR/Sqft</InputAdornment>
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.maxCurrentPrice || formErrors?.maxCurrentPriceInPaise)}
                    label='Indicative current price on saleable'
                  />
                )}
              />
              {(errors.maxCurrentPrice || formErrors?.maxCurrentPriceInPaise) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.maxCurrentPrice?.message || formErrors?.maxCurrentPriceInPaise}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='marketRateInPaise'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    onChange={e => {
                      field.onChange(e)
                      if (formErrors?.marketRateInPaise) {
                        dispatch(resetFormErors('marketRateInPaise'))
                      }
                    }}
                    type='number'
                    InputProps={{
                      inputProps: { min: 1, max: 10000000000 },
                      endAdornment: <InputAdornment position='end'>INR/Sqft</InputAdornment>
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.marketRateInPaise || formErrors?.marketRateInPaise)}
                    label='Market rate'
                  />
                )}
              />
              {(errors.marketRateInPaise || formErrors?.marketPriceInPaiseInPaise) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.marketRateInPaise?.message || formErrors?.marketPriceInPaiseInPaise}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='homeLoanPartners'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    multiple
                    disableCloseOnSelect
                    value={value}
                    limitTags={2}
                    sx={{ textTransform: 'capitalize' }}
                    onChange={(event, newValue) => {
                      const newValue1 = newValue.map((val: any) => {
                        if (val?.inputValue?.length > 0) {
                          return {
                            inputValue: val?.inputValue,
                            name: val?.inputValue
                          }
                        } else {
                          return val
                        }
                      })
                      onChange(newValue1)
                      dispatch(resetFormErors('homeLoanPartners'))
                    }}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    options={optionsData}
                    id='checkboxes-tags-demo'
                    getOptionLabel={option => {
                      // Value selected with enter, right from the input
                      if (typeof option === 'string') {
                        return option
                      }
                      if (option?.inputValue) {
                        return option?.inputValue
                      }

                      return option.name
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params)

                      const { inputValue } = params
                      const isExisting = options.some(option => inputValue === option.name)
                      if (inputValue !== '' && !isExisting) {
                        filtered.push({
                          inputValue,
                          name: `Add "${inputValue}"`
                        })
                      }

                      return filtered
                    }}
                    renderOption={(props, option, { selected }) => (
                      <li {...props} style={{ textTransform: 'capitalize' }}>
                        <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                        {option.name}
                      </li>
                    )}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Home loan partners'
                        placeholder='Home loan partners'
                        InputLabelProps={{ shrink: true }}
                        error={Boolean(errors.homeLoanPartners || formErrors?.homeLoanPartners)}
                      />
                    )}
                  />
                )}
              />
              {(errors.homeLoanPartners || formErrors?.homeLoanPartners) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  Please select Home Loan Partner
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel
                id='demo-simple-select-label'
                shrink={true}
                error={Boolean(errors.constructionType || formErrors?.constructionType)}
              >
                Construction type
              </InputLabel>
              <Controller
                name='constructionType'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select
                    value={value || ''}
                    defaultValue=''
                    label='Construction type'
                    placeholder='Construction type'
                    notched
                    onChange={e => {
                      onChange(e)
                      dispatch(resetFormErors('constructionType'))
                    }}
                    error={Boolean(errors.constructionType || formErrors?.constructionType)}
                    labelId='demo-simple-select-label'
                    aria-describedby='validation-basic-select'
                    endAdornment={
                      value && (
                        <IconButton
                          size='small'
                          onMouseDown={event => {
                            // stops the popup from appearing when this button is clicked
                            event.stopPropagation()
                          }}
                          onClick={() => {
                            onChange(null)
                          }}
                        >
                          <Close />
                        </IconButton>
                      )
                    }
                    sx={{
                      '& .MuiSelect-icon': {
                        display: value ? 'none' : 'block'
                      }
                    }}
                  >
                    {Object.entries(config?.properties?.constructionType)?.map(([key, value], index) => {
                      return (
                        <MenuItem key={index} value={String(key)}>
                          {String(value)}
                        </MenuItem>
                      )
                    })}
                  </Select>
                )}
              />
              {(errors.constructionType || formErrors?.constructionType) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.constructionType?.message || formErrors?.constructionType}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel
                id='demo-simple-select-label'
                shrink
                error={Boolean(errors.flooring || formErrors?.flooringType)}
              >
                Flooring type
              </InputLabel>
              <Controller
                name='flooring'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    value={value || ''}
                    defaultValue=''
                    label='Flooring type'
                    placeholder='Flooring type'
                    notched
                    onChange={e => {
                      onChange(e)
                      dispatch(resetFormErors('flooringType'))
                    }}
                    error={Boolean(errors.flooring || formErrors?.flooringType)}
                    labelId='demo-simple-select-label'
                    aria-describedby='validation-basic-select'
                    endAdornment={
                      value && (
                        <IconButton
                          size='small'
                          onMouseDown={event => {
                            // stops the popup from appearing when this button is clicked
                            event.stopPropagation()
                          }}
                          onClick={() => {
                            onChange(null)
                          }}
                        >
                          <Close />
                        </IconButton>
                      )
                    }
                    sx={{
                      '& .MuiSelect-icon': {
                        display: value ? 'none' : 'block'
                      }
                    }}
                  >
                    {Object.entries(config?.properties?.flooringType)?.map(([key, value], index) => {
                      return (
                        <MenuItem key={index} value={String(key)}>
                          {String(value)}
                        </MenuItem>
                      )
                    })}
                  </Select>
                )}
              />
              {(errors.flooring || formErrors?.flooringType) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.flooring?.message || formErrors?.flooringType}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='availabilityStatus'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    <InputLabel
                      required
                      id='select-availabilityStatus'
                      shrink={true}
                      error={Boolean(errors.availabilityStatus)}
                    >
                      Availabililty Status
                    </InputLabel>
                    <Select
                      labelId='select-availabilityStatus'
                      defaultValue=''
                      id='select-availabilityStatus'
                      label='Availabililty status'
                      required
                      notched
                      value={String(value) || ''}
                      onChange={onChange}
                      error={Boolean(errors.availabilityStatus)}
                    >
                      {Object.entries(config?.properties?.availabilityStatus)?.map(([key, value], index) => {
                        return (
                          <MenuItem key={index} value={String(key)}>
                            {String(value)}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </>
                )}
              />
              {errors.availabilityStatus && (
                <FormHelperText sx={{ color: 'error.main' }} id='select-availabilityStatus'>
                  {errors.availabilityStatus.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='noOfSecurityTiers'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    <InputLabel id='select-noOfSecurityTiers' shrink={true} error={Boolean(errors.noOfSecurityTiers)}>
                      Security Tier
                    </InputLabel>
                    <Select
                      labelId='select-noOfSecurityTiers'
                      defaultValue=''
                      id='select-noOfSecurityTiers'
                      label='Security tier'
                      notched
                      value={String(value) || ''}
                      onChange={onChange}
                      displayEmpty
                      error={Boolean(errors.noOfSecurityTiers)}
                      endAdornment={
                        value && (
                          <IconButton
                            size='small'
                            onMouseDown={event => {
                              // stops the popup from appearing when this button is clicked
                              event.stopPropagation()
                            }}
                            onClick={() => {
                              onChange(null)
                            }}
                          >
                            <Close />
                          </IconButton>
                        )
                      }
                      sx={{
                        '& .MuiSelect-icon': {
                          display: value ? 'none' : 'block'
                        }
                      }}
                    >
                      {Object.entries(config?.properties?.securityTier)?.map(([key, value], index) => {
                        return (
                          <MenuItem key={index} value={String(key)}>
                            {String(value)}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </>
                )}
              />
              {errors.noOfSecurityTiers && (
                <FormHelperText sx={{ color: 'error.main' }} id='select-noOfSecurityTiers'>
                  {errors.noOfSecurityTiers.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='mediaLinkWalkthrough'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type='text'
                    onChange={e => {
                      field.onChange(e)
                      if (formErrors?.mediaLinkWalkthrough) {
                        dispatch(resetFormErors('mediaLinkWalkthrough'))
                      }
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.mediaLinkWalkthrough || formErrors?.mediaLinkWalkthrough)}
                    label='Media link walk through'
                  />
                )}
              />
              {(errors.mediaLinkWalkthrough || formErrors?.mediaLinkWalkthrough) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.mediaLinkWalkthrough?.message || formErrors?.mediaLinkWalkthrough}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='mediaLinkConstructionUpdate'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type='text'
                    onChange={e => {
                      field.onChange(e)
                      if (formErrors?.mediaLinkConstructionUpdate) {
                        dispatch(resetFormErors('mediaLinkConstructionUpdate'))
                      }
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.mediaLinkConstructionUpdate || formErrors?.mediaLinkConstructionUpdate)}
                    label='Media link construction update'
                  />
                )}
              />
              {(errors.mediaLinkConstructionUpdate || formErrors?.mediaLinkConstructionUpdate) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.mediaLinkConstructionUpdate?.message || formErrors?.mediaLinkConstructionUpdate}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='mediaLinkInterior'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type='text'
                    onChange={e => {
                      field.onChange(e)
                      if (formErrors?.mediaLinkInterior) {
                        dispatch(resetFormErors('mediaLinkInterior'))
                      }
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.mediaLinkInterior || formErrors?.mediaLinkInterior)}
                    label='Media link interior'
                  />
                )}
              />
              {(errors.mediaLinkInterior || formErrors?.mediaLinkInterior) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.mediaLinkInterior?.message || formErrors?.mediaLinkInterior}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='dataAsOn'
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label='Data as on'
                      {...field}
                      inputFormat='yyyy/MM/dd'
                      disableFuture
                      onChange={e => {
                        field.onChange(e)
                        dispatch(resetFormErors('dataAsOn'))
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          required
                          error={Boolean(errors.dataAsOn || formErrors?.dataAsOn)}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              {(errors.dataAsOn || formErrors?.dataAsOn) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.dataAsOn?.message || formErrors?.dataAsOn}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='priceOnDate'
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label='Price on date'
                      {...field}
                      inputFormat='yyyy/MM/dd'
                      disableFuture
                      onChange={e => {
                        field.onChange(e)
                        dispatch(resetFormErors('priceOnDate'))
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={Boolean(errors.priceOnDate || formErrors?.priceOnDate)}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              {(errors.priceOnDate || formErrors?.priceOnDate) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  {errors?.priceOnDate?.message || formErrors?.priceOnDate}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <LocationCard1
              addressLabel='Address'
              name='address'
              control={control}
              errors={errors}
              values={values}
              setValue={setValue}
              watch={watch}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='isReraRegistered'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    value={value}
                    onChange={onChange}
                    control={<Checkbox checked={value} defaultChecked={defaultValues.isReraRegistered} />}
                    label={`Is RERA registered? `}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='isParkingIncluded'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    value={value}
                    onChange={onChange}
                    control={<Checkbox checked={value} defaultChecked={defaultValues.isParkingIncluded} />}
                    label={`Is parking included? `}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Controller
                name='hasShoppingComplex'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    value={value}
                    onChange={onChange}
                    control={<Checkbox checked={value} defaultChecked={defaultValues.hasShoppingComplex} />}
                    label={`Commercial space/Daily need shopping complex?`}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='description'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    value={value}
                    rows={4}
                    style={{ marginTop: '2px' }}
                    multiline
                    required
                    label='Property description'
                    onChange={e => {
                      onChange(e)
                      dispatch(resetFormErors('description'))
                    }}
                    placeholder='Property description'
                    error={Boolean(errors.description || formErrors?.description)}
                    aria-describedby='validation-basic-last-name'
                  />
                )}
              />
              {(errors.description || formErrors?.description) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-textarea'>
                  {errors?.description?.message || formErrors?.description}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <MyGoogleMap
              value={{ lat: Number(location?.lat), lng: Number(location?.lng) }}
              id={'old'}
              addMarker={(lat: number, lng: number) => {
                addMarker(lat, lng)
              }}
              control={control}
              errors={errors}
              formErrors={formErrors}
            />
          </Grid>
          <Grid item container xs={12} sm={12} spacing={6}>
            <Grid item xs={12} sm={6}>
              <DropzoneWrapper>
                <FileUploaderRestrictions
                  files={files}
                  setValue={setValue}
                  setFiles={setFiles}
                  loading={loader || store.loading}
                  text={'Allowed *.jpeg, *.jpg, *.png, *.mp4'}
                />
              </DropzoneWrapper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {files?.length > 0 &&
                  files.map((file: FileProp, index: number) => (
                    <div key={index} className='my-image'>
                      <IconButton
                        onClick={() => {
                          handleRemoveFile(file)
                          setValue('isImageUploaded', '', { shouldDirty: true })
                        }}
                      >
                        <Close style={{ fontSize: '25px' }} />
                      </IconButton>
                      {renderFilePreview(file)}
                    </div>
                  ))}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <LoadingButton
          variant='contained'
          style={{ float: 'right', marginRight: '20px', marginBottom: '20px' }}
          type='submit'
          loading={loader || store.loading}
          disabled={!(isDirty && isValid)}
        >
          Save
        </LoadingButton>
      </form>
      <ImagePreview open={open} setOpen={setOpen} />
    </>
  )
}

export default BasicDetails
