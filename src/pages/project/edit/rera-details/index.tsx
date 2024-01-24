import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import {
  Grid,
  Card,
  FormControl,
  FormHelperText,
  TextField,
  CardContent,
  IconButton,
  Tooltip,
  Autocomplete,
  CardHeader,
  InputLabel,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import UploadCertificate from 'src/pages/forms/Uploader'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { FileProp, propertyProp } from 'src/common/types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { Delete, Plus } from 'mdi-material-ui'
import { Fragment, useEffect, useState } from 'react'
import { patchPropertyDetails, fetchCategory, resetFormErors } from 'src/store/apps/property'
import { useSelector } from 'react-redux'
import FileUploaderRestrictions from 'src/views/forms/form-elements/file-uploader/FileUploaderRestrictions'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import CardDocument from 'src/views/ui/cards/document/CardDocument'
import UploadMultipleImageService from 'src/services/uploadMultipleImages'
import moment from 'moment'

interface image {
  slug: string
  url: string
  name: string
}
interface multipleDocument {
  label: string
  slug: string
}

interface FormInputs1 {
  reraNumber: string
  reraRegistrationDate: Date
  reraDeclaredPossessionDate: Date
  reraPossessionCovidExtensionDate: Date
  reraPossessionReraExtensionDate: Date
  constructionCompletion: Date
  carpetArea: number | undefined
  environmentClearanceSlug: image
  structuralStabilityCertificateSlug: image
  buildingPlanSlug: image
  fireNocSlug: image
  architectCertificateSlug: image
  engineerCertificateSlug: image
  caCertificateSlug: image
  encumbranceCertificateSlug: image
  brochureSlug: image
  customerComplaintSlug: image
  reraSpecificationSlug: image
  priceListSlug: image
  allotmentLetterSlug: image
  titleDeedSlug: image
  jvAgreementSlug: image
  loiSlug: image
  codSlug: image
  zoningPlanSlug: image
  demarcationPlanSlug: image
  leaseDeedSlugs: FileProp[]
  saleDeedSlugs: FileProp[]
  landDocumentSlugs: FileProp[]
  isSpecificationPresent: boolean
  isReraEncumbered: boolean
}

interface FormInputs2 {
  category: string
  text: string
}
interface specification {
  icon: string
  category: string
  text: string
}

const RERADetails = (prop: propertyProp) => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: any) => state.property)
  const formErrors = useSelector((state: any) => state.user.formErrors)
  const [imageChange, setImageChange] = useState<boolean>(false)
  const [data, setData] = useState<specification[]>([])
  const [loader, setLoader] = useState<boolean>(false)

  const scehma = yup.object().shape({
    slug: yup.string().nullable().optional().notRequired()
  })
  const detailsSchema = yup.object().shape({
    reraNumber: yup.string().strict(false).trim().required('Please enter RERA number'),
    reraRegistrationDate: yup
      .date()
      .typeError('Please select RERA registration date')
      .notRequired()
      .optional()
      .nullable(),
    reraDeclaredPossessionDate: yup
      .date()
      .typeError('Please select RERA possession date')
      .required('Please select RERA possession date'),
    reraPossessionCovidExtensionDate: yup
      .date()
      .typeError('Please select RERA covid extension date')
      .required('Please select RERA covid extension date'),
    reraPossessionReraExtensionDate: yup
      .date()
      .typeError('Please select RERA extension date')
      .required('Please select RERA extension date'),
    carpetArea: yup
      .number()
      .max(100, 'Please enter valid carpet area between 1-100')
      .typeError('Customer Area must be a number')
      .nullable()
      .transform((_, val) => Number(val)),
    environmentClearanceSlug: scehma,
    structuralStabilityCertificateSlug: scehma,
    buildingPlanSlug: scehma,
    fireNocSlug: scehma,
    architectCertificateSlug: scehma,
    engineerCertificateSlug: scehma,
    caCertificateSlug: scehma,
    encumbranceCertificateSlug: scehma,
    brochureSlug: scehma,
    customerComplaintSlug: scehma,
    reraSpecificationSlug: scehma,
    priceListSlug: scehma,
    allotmentLetterSlug: scehma,
    titleDeedSlug: scehma,
    jvAgreementSlug: scehma,
    loiSlug: scehma,
    codSlug: scehma,
    zoningPlanSlug: scehma,
    demarcationPlanSlug: scehma,
    leaseDeedSlugs: yup.array().nullable().optional().notRequired(),
    saleDeedSlugs: yup.array().nullable().optional().notRequired(),
    landDocumentSlugs: yup.array().nullable().optional().notRequired(),
    isSpecificationPresent: yup.boolean().notRequired(),
    isReraEncumbered: yup.boolean().notRequired()
  })

  const specificationSchema = yup.object().shape({
    category: yup.string().strict(false).trim().required('Please enter category'),
    text: yup.string().strict(false).trim().required('Please enter Text')
  })
  const defaultValues = {
    reraNumber: store?.data?.reraAnalytics?.reraNumber || '',
    reraRegistrationDate: store?.data?.reraAnalytics?.reraRegistrationDate || null,
    reraDeclaredPossessionDate: store?.data?.reraAnalytics?.reraDeclaredPossessionDate || null,
    reraPossessionCovidExtensionDate: store?.data?.reraAnalytics?.reraPossessionCovidExtensionDate || null,
    reraPossessionReraExtensionDate: store?.data?.reraAnalytics?.reraPossessionReraExtensionDate || null,
    constructionCompletion: store?.data?.details?.constructionCompletionDate || null,
    carpetArea: store?.data?.details?.percentageCarpetAreaToSaleableArea || null,
    environmentClearanceSlug: {
      slug: store?.data?.reraAnalytics?.environmentClearanceSlug || null,
      url: '',
      name: ''
    },
    structuralStabilityCertificateSlug: {
      slug: store?.data?.reraAnalytics?.structuralStabilityCertificateSlug || null,
      url: '',
      name: ''
    },
    buildingPlanSlug: {
      slug: store?.data?.reraAnalytics?.buildingPlanSlug || null,
      url: '',
      name: ''
    },
    fireNocSlug: {
      slug: store?.data?.reraAnalytics?.fireNocSlug || null,
      url: '',
      name: ''
    },
    architectCertificateSlug: {
      slug: store?.data?.reraAnalytics?.architectCertificateSlug || null,
      url: '',
      name: ''
    },
    engineerCertificateSlug: {
      slug: store?.data?.reraAnalytics?.engineerCertificateSlug || null,
      url: '',
      name: ''
    },
    caCertificateSlug: {
      slug: store?.data?.reraAnalytics?.caCertificateSlug || null,
      url: '',
      name: ''
    },
    encumbranceCertificateSlug: {
      slug: store?.data?.reraAnalytics?.encumbranceCertificateSlug || null,
      url: '',
      name: ''
    },
    brochureSlug: {
      slug: store?.data?.reraAnalytics?.brochureSlug || null,
      url: '',
      name: ''
    },
    customerComplaintSlug: {
      slug: store?.data?.reraAnalytics?.customerComplaintSlug || null,
      url: '',
      name: ''
    },
    reraSpecificationSlug: {
      slug: store?.data?.reraAnalytics?.reraSpecificationSlug || null,
      url: '',
      name: ''
    },
    priceListSlug: {
      slug: store?.data?.reraAnalytics?.priceListSlug || null,
      url: '',
      name: ''
    },
    allotmentLetterSlug: {
      slug: store?.data?.reraAnalytics?.allotmentLetterSlug?.slug || null,
      url: '',
      name: ''
    },
    titleDeedSlug: {
      slug: store?.data?.reraAnalytics?.titleDeedSlug?.slug || null,
      url: '',
      name: ''
    },
    jvAgreementSlug: {
      slug: store?.data?.reraAnalytics?.jvAgreementSlug?.slug || null,
      url: '',
      name: ''
    },
    loiSlug: {
      slug: store?.data?.reraAnalytics?.loiSlug?.slug || null,
      url: '',
      name: ''
    },
    codSlug: {
      slug: store?.data?.reraAnalytics?.codSlug?.slug || null,
      url: '',
      name: ''
    },
    zoningPlanSlug: {
      slug: store?.data?.reraAnalytics?.zoningPlanSlug?.slug || null,
      url: '',
      name: ''
    },
    demarcationPlanSlug: {
      slug: store?.data?.reraAnalytics?.demarcationPlanSlug?.slug || null,
      url: '',
      name: ''
    },
    leaseDeedSlugs:
      store?.data?.reraAnalytics?.leaseDeedSlugs?.length > 0
        ? store?.data?.reraAnalytics?.leaseDeedSlugs?.map((val: multipleDocument) => {
            return {
              slug: val?.slug || null,
              url: '',
              name: ''
            }
          })
        : [],
    saleDeedSlugs:
      store?.data?.reraAnalytics?.saleDeedSlugs?.length > 0
        ? store?.data?.reraAnalytics?.saleDeedSlugs?.map((val: multipleDocument) => {
            return {
              slug: val?.slug || null,
              url: '',
              name: ''
            }
          })
        : [],
    landDocumentSlugs:
      store?.data?.reraAnalytics?.landDocumentSlugs?.length > 0
        ? store?.data?.reraAnalytics?.landDocumentSlugs?.map((val: multipleDocument) => {
            return {
              slug: val?.slug || null,
              url: '',
              name: ''
            }
          })
        : [],

    isSpecificationPresent: false,
    isReraEncumbered: store?.data?.reraAnalytics?.isReraEncumbered || false
  }

  useEffect(() => {
    dispatch(fetchCategory())
    setData(store?.data?.reraAnalytics?.meta?.specifications || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const optionsData: string[] = store?.category?.map((val: any) => val.category)

  const handleUploader = async (files: FileProp[]) => {
    const leftOut: string[] = []
    const upload: FileProp[] = []

    files?.filter(i => {
      if (i?.slug?.length) {
        leftOut.push(i?.slug)
      } else {
        upload.push(i)
      }
    })

    const imagePayload: any = {
      files: upload,
      path: 'property/images'
    }

    let images: any = []
    if (upload?.length) {
      images = await UploadMultipleImageService(imagePayload, setLoader)
    }

    return [...leftOut, ...images]
  }
  const onSubmitSpecification = () => {
    specificationform.trigger()

    if (
      specificationform?.formState?.isValid &&
      specificationform?.getValues()?.category?.length > 0 &&
      specificationform?.getValues()?.text?.length > 0
    ) {
      if (!imageChange) {
        setImageChange(true)
      }
      setValue('isSpecificationPresent', true, {
        shouldValidate: true,
        shouldDirty: true
      })
      setData([...data, { icon: 'building', ...specificationform?.getValues() }])
      specificationform.reset({
        category: '',
        text: ''
      })
      specificationform.reset()

      return
    }
  }

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors, isDirty, isValid }
  } = useForm<FormInputs1>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(detailsSchema)
  })

  const specificationform = useForm<FormInputs2>({
    defaultValues: {
      category: undefined,
      text: ''
    },
    mode: 'onChange',
    resolver: yupResolver(specificationSchema)
  })
  const control1 = specificationform.control
  const formState1 = specificationform.formState
  const error1 = formState1.errors

  const spacing = 6

  const onSubmit = async (values: any) => {
    setLoader(true)

    const leaseDeed = (await handleUploader(values?.leaseDeedSlugs)) || []
    const landDocument = (await handleUploader(values?.landDocumentSlugs)) || []
    const saleDeed = (await handleUploader(values?.saleDeedSlugs)) || []

    const payload = {
      step: 'rera',
      reraNumber: values.reraNumber,
      reraRegistrationDate: values.reraRegistrationDate
        ? moment(values?.reraRegistrationDate).add('1', 'days')
        : values?.reraRegistrationDate,
      reraDeclaredPossessionDate: values.reraDeclaredPossessionDate
        ? moment(values?.reraDeclaredPossessionDate).add('1', 'days')
        : values?.reraDeclaredPossessionDate,
      reraPossessionCovidExtensionDate: values.reraPossessionCovidExtensionDate
        ? moment(values?.reraPossessionCovidExtensionDate).add('1', 'days')
        : values?.reraPossessionCovidExtensionDate,
      reraPossessionReraExtensionDate: values.reraPossessionReraExtensionDate
        ? moment(values?.reraPossessionReraExtensionDate).add('1', 'days')
        : values?.reraPossessionReraExtensionDate,
      constructionCompletionDate: values.constructionCompletion
        ? moment(values?.constructionCompletion).add('1', 'days')
        : values?.constructionCompletion,
      percentageCarpetAreaToSaleableArea: values.carpetArea,
      encumbranceCertificateSlug: values?.encumbranceCertificateSlug?.slug,
      buildingPlanSlug: values?.buildingPlanSlug?.slug,
      environmentClearanceSlug: values?.environmentClearanceSlug?.slug,
      structuralStabilityCertificateSlug: values?.structuralStabilityCertificateSlug?.slug,
      fireNocSlug: values?.fireNocSlug?.slug,
      architectCertificateSlug: values?.architectCertificateSlug?.slug,
      engineerCertificateSlug: values?.engineerCertificateSlug?.slug,
      caCertificateSlug: values?.caCertificateSlug?.slug,
      brochureSlug: values?.brochureSlug?.slug,
      customerComplaintSlug: values?.customerComplaintSlug?.slug,
      reraSpecificationSlug: values?.reraSpecificationSlug?.slug,
      specifications: data,
      priceListSlug: values?.priceListSlug?.slug,
      allotmentLetterSlug: values?.allotmentLetterSlug?.slug,
      titleDeedSlug: values?.titleDeedSlug?.slug,
      jvAgreementSlug: values?.jvAgreementSlug?.slug,
      loiSlug: values?.loiSlug?.slug,
      codSlug: values?.codSlug?.slug,
      zoningPlanSlug: values?.zoningPlanSlug?.slug,
      demarcationPlanSlug: values?.demarcationPlanSlug?.slug,
      isReraEncumbered: values?.isReraEncumbered,
      leaseDeedSlugs: leaseDeed || [],
      saleDeedSlugs: saleDeed || [],
      landDocumentSlugs: landDocument || []
    }
    console.log('vfdvfdvvfd', payload, leaseDeed, saleDeed, landDocument)
    setImageChange(false)
    setLoader(false)

    dispatch(
      patchPropertyDetails({
        id: prop.id,
        params: payload
      })
    ).then(() => {
      setImageChange(false)
      setLoader(false)
      reset(values)
    })
  }
  const remove = (index1: number) => {
    if (!imageChange) {
      setImageChange(true)
    }
    setValue('isSpecificationPresent', true, {
      shouldDirty: true,
      shouldValidate: true
    })
    if (data.length === 1) {
      setData([])
    } else {
      const arr = data.filter((val, currIndex) => currIndex !== Number(index1))
      setData([...arr])
    }
  }

  const maxRegistrationDate = () => {
    if (!watch('reraDeclaredPossessionDate')) {
      return null
    }
    const date = new Date(watch('reraDeclaredPossessionDate'))

    date.setDate(date.getDate() - 1)

    return date
  }

  const maxConstructionCompletionDate = () => {
    if (!watch('reraDeclaredPossessionDate')) {
      return null
    }

    const date = new Date(watch('reraDeclaredPossessionDate'))

    return date
  }

  const minPossessionDate = () => {
    if (!watch('reraRegistrationDate') && watch('constructionCompletion')) {
      return new Date(watch('constructionCompletion'))
    } else if (watch('reraRegistrationDate') && !watch('constructionCompletion')) {
      const tempDate = new Date(watch('reraRegistrationDate'))

      return tempDate.setDate(tempDate.getDate() + 1)
    }

    if (watch('reraRegistrationDate') && watch('constructionCompletion')) {
      const regDate = new Date(watch('reraRegistrationDate'))

      const constDate = new Date(watch('constructionCompletion'))

      if (regDate > constDate) {
        return regDate.setDate(regDate.getDate() + 1)
      } else {
        return constDate
      }
    }

    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '30px' }} noValidate>
      {store?.data?.isReraRegisterd ? (
        <>
          <Grid container sx={{ mb: spacing }} spacing={spacing}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='reraNumber'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      onChange={e => {
                        field.onChange(e)
                        dispatch(resetFormErors('reraNumber'))
                      }}
                      inputProps={{ style: { textTransform: 'uppercase' } }}
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.reraNumber || formErrors?.reraNumber)}
                      label='RERA number'
                      placeholder='RERA number'
                    />
                  )}
                />
                {(errors.reraNumber || formErrors?.reraNumber) && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    {errors?.reraNumber?.message || formErrors?.reraNumber}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='reraRegistrationDate'
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label='RERA registration date'
                        {...field}
                        inputFormat='yyyy/MM/dd'
                        disableFuture
                        maxDate={maxRegistrationDate()}
                        onChange={e => {
                          field.onChange(e)
                          dispatch(resetFormErors('reraRegistrationDate'))
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={Boolean(errors.reraRegistrationDate || formErrors?.reraRegistrationDate)}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                {(errors.reraRegistrationDate || formErrors?.reraRegistrationDate) && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    {errors?.reraRegistrationDate?.message || formErrors?.reraRegistrationDate}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='constructionCompletion'
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label='Construction completion date'
                        {...field}
                        inputFormat='yyyy/MM/dd'
                        disableFuture={store?.data?.availabilityStatus === 2}
                        maxDate={maxConstructionCompletionDate()}
                        minDate={watch('reraRegistrationDate')}
                        onChange={e => {
                          field.onChange(e)
                          dispatch(resetFormErors('constructionCompletionDate'))
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={Boolean(errors.constructionCompletion || formErrors?.constructionCompletionDate)}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                {(errors.constructionCompletion || formErrors?.constructionCompletionDate) && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    {errors?.constructionCompletion?.message || formErrors?.constructionCompletionDate}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='reraDeclaredPossessionDate'
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label='RERA declared possession date'
                        {...field}
                        inputFormat='yyyy/MM/dd'
                        disableFuture={store?.data?.availabilityStatus === 2}
                        minDate={minPossessionDate()}
                        onChange={e => {
                          field.onChange(e)
                          dispatch(resetFormErors('reraDeclaredPossessionDate'))
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            required
                            error={Boolean(errors.reraDeclaredPossessionDate || formErrors?.reraDeclaredPossessionDate)}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                {(errors.reraDeclaredPossessionDate || formErrors?.reraDeclaredPossessionDate) && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    {errors?.reraDeclaredPossessionDate?.message || formErrors?.reraDeclaredPossessionDate}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='reraPossessionCovidExtensionDate'
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label='RERA possession covid extension date'
                        {...field}
                        inputFormat='yyyy/MM/dd'
                        disableFuture={store?.data?.availabilityStatus === 2}
                        disabled={!Boolean(watch('reraDeclaredPossessionDate'))}
                        onChange={e => {
                          field.onChange(e)
                          dispatch(resetFormErors('reraPossessionCovidExtensionDate'))
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            required
                            disabled={!Boolean(watch('reraDeclaredPossessionDate'))}
                            error={Boolean(
                              errors.reraPossessionCovidExtensionDate || formErrors?.reraPossessionCovidExtensionDate
                            )}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                {(errors.reraPossessionCovidExtensionDate || formErrors?.reraPossessionCovidExtensionDate) && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    {errors?.reraPossessionCovidExtensionDate?.message || formErrors?.reraPossessionCovidExtensionDate}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='reraPossessionReraExtensionDate'
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label='RERA Possession Extension Date'
                        {...field}
                        inputFormat='yyyy/MM/dd'
                        disabled={!Boolean(watch('reraDeclaredPossessionDate'))}
                        disableFuture={store?.data?.availabilityStatus === 2}
                        onChange={e => {
                          field.onChange(e)
                          dispatch(resetFormErors('reraPossessionReraExtensionDate'))
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            required
                            disabled={!Boolean(watch('reraDeclaredPossessionDate'))}
                            error={Boolean(
                              errors.reraPossessionReraExtensionDate || formErrors?.reraPossessionReraExtensionDate
                            )}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                {(errors.reraDeclaredPossessionDate || formErrors?.reraDeclaredPossessionDate) && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    {errors?.reraDeclaredPossessionDate?.message || formErrors?.reraDeclaredPossessionDate}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='carpetArea'
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
                        dispatch(resetFormErors('constructionCompletionDate'))
                      }}
                      type='number'
                      InputProps={{ inputProps: { min: 1, max: 100 } }}
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.carpetArea || formErrors?.constructionCompletionDate)}
                      label='Percentage carpet area to saleable area'
                      placeholder='Percentage carpet area to saleable area'
                    />
                  )}
                />
                {(errors.carpetArea || formErrors?.constructionCompletionDate) && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    {errors?.carpetArea?.message || formErrors?.constructionCompletionDate}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='isReraEncumbered'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      value={value}
                      onChange={onChange}
                      control={<Checkbox checked={value} defaultChecked={defaultValues.isReraEncumbered} />}
                      label={`Is RERA encumbered?`}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid container item sm={12} columnSpacing={spacing} style={{ paddingTop: 0 }}>
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px',
                      marginBottom: '15px'
                    }}
                    error={Boolean(errors.buildingPlanSlug && watch('buildingPlanSlug')?.slug?.length === 0)}
                  >
                    Building plan
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='buildingPlanSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='Building plan'
                          maxImage={1}
                          setValue={setValue}
                          value={defaultValues?.buildingPlanSlug}
                          name='buildingPlanSlug'
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                    {errors.buildingPlanSlug && watch('buildingPlanSlug')?.slug?.length === 0 && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        Please upload Building Plan
                      </FormHelperText>
                    )}
                  </div>
                </FormControl>
              </Grid>
              <Grid item md={6} lg={4} xl={4} xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(
                      errors.encumbranceCertificateSlug && watch('encumbranceCertificateSlug')?.slug?.length === 0
                    )}
                  >
                    RERA emcumbrance
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='encumbranceCertificateSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='RERA emcumbrance'
                          maxImage={1}
                          setValue={setValue}
                          name='encumbranceCertificateSlug'
                          value={defaultValues?.encumbranceCertificateSlug}
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                    {errors.encumbranceCertificateSlug && watch('encumbranceCertificateSlug')?.slug?.length === 0 && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        Please upload Emcumbrance
                      </FormHelperText>
                    )}
                  </div>
                </FormControl>
              </Grid>
              <Grid item md={6} lg={4} xl={4} xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(
                      errors.environmentClearanceSlug && watch('environmentClearanceSlug')?.slug?.length === 0
                    )}
                  >
                    Environment clearance
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='environmentClearanceSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='Environment clearance'
                          maxImage={1}
                          setValue={setValue}
                          name='environmentClearanceSlug'
                          value={defaultValues?.environmentClearanceSlug}
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                    {errors.environmentClearanceSlug && watch('environmentClearanceSlug')?.slug?.length === 0 && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        Please upload Environment Clearance
                      </FormHelperText>
                    )}
                  </div>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(errors.customerComplaintSlug && watch('customerComplaintSlug')?.slug?.length === 0)}
                  >
                    Customer complaints
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='customerComplaintSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='Customer Complaint'
                          maxImage={1}
                          setValue={setValue}
                          value={defaultValues?.customerComplaintSlug}
                          name='customerComplaintSlug'
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.customerComplaintSlug && watch('customerComplaintSlug')?.slug?.length === 0 && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                      Please upload customer complaint
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item md={6} lg={4} xl={4} xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(
                      errors.structuralStabilityCertificateSlug &&
                        watch('structuralStabilityCertificateSlug')?.slug?.length === 0
                    )}
                  >
                    Structure stability certificate
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='structuralStabilityCertificateSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='Structure stability certificate'
                          maxImage={1}
                          setValue={setValue}
                          name='structuralStabilityCertificateSlug'
                          value={defaultValues?.structuralStabilityCertificateSlug}
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                    {errors.structuralStabilityCertificateSlug &&
                      watch('structuralStabilityCertificateSlug')?.slug?.length === 0 && (
                        <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                          Please upload structure stability certificate
                        </FormHelperText>
                      )}
                  </div>
                </FormControl>
              </Grid>
              <Grid item md={6} lg={4} xl={4} xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel
                    error={Boolean(errors.fireNocSlug && watch('fireNocSlug')?.slug?.length === 0)}
                    style={{
                      marginLeft: '-15px'
                    }}
                  >
                    Fire noc
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='fireNocSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='Fire NOC'
                          maxImage={1}
                          setValue={setValue}
                          name='fireNocSlug'
                          value={defaultValues?.fireNocSlug}
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                    {errors.fireNocSlug && watch('fireNocSlug')?.slug?.length === 0 && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        Please upload fire noc
                      </FormHelperText>
                    )}
                  </div>
                </FormControl>
              </Grid>
              <Grid item md={6} lg={4} xl={4} xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel
                    error={Boolean(
                      errors.architectCertificateSlug && watch('architectCertificateSlug')?.slug?.length === 0
                    )}
                    style={{
                      marginLeft: '-15px'
                    }}
                  >
                    Architect certificate
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='architectCertificateSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='Architect certificate'
                          maxImage={1}
                          setValue={setValue}
                          name='architectCertificateSlug'
                          value={defaultValues?.architectCertificateSlug}
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                    {errors.architectCertificateSlug && watch('architectCertificateSlug')?.slug?.length === 0 && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        Please upload architect certificate
                      </FormHelperText>
                    )}
                  </div>
                </FormControl>
              </Grid>
              <Grid item md={6} lg={4} xl={4} xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel
                    error={Boolean(
                      errors.engineerCertificateSlug && watch('engineerCertificateSlug')?.slug?.length === 0
                    )}
                    style={{
                      marginLeft: '-15px'
                    }}
                  >
                    Engineer certificate
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='engineerCertificateSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='Engineer certificate'
                          maxImage={1}
                          setValue={setValue}
                          name='engineerCertificateSlug'
                          value={defaultValues?.engineerCertificateSlug}
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                    {errors.engineerCertificateSlug && watch('engineerCertificateSlug')?.slug?.length === 0 && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        Please upload engineer certificate
                      </FormHelperText>
                    )}
                  </div>
                </FormControl>
              </Grid>
              <Grid item md={6} lg={4} xl={4} xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(errors.caCertificateSlug && watch('caCertificateSlug')?.slug?.length === 0)}
                  >
                    CA certificate
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='caCertificateSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='CA certificate'
                          maxImage={1}
                          setValue={setValue}
                          name='caCertificateSlug'
                          value={defaultValues?.caCertificateSlug}
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                    {errors.caCertificateSlug && watch('caCertificateSlug')?.slug?.length === 0 && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        Please upload ca certificate
                      </FormHelperText>
                    )}
                  </div>
                </FormControl>
              </Grid>
              <Grid item md={6} lg={4} xl={4} xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(errors.brochureSlug && watch('brochureSlug')?.slug?.length === 0)}
                  >
                    Brochure
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='brochureSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='Brochure'
                          maxImage={1}
                          setValue={setValue}
                          name='brochureSlug'
                          value={defaultValues?.brochureSlug}
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                    {errors.brochureSlug && watch('brochureSlug')?.slug?.length === 0 && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        Please upload brochure
                      </FormHelperText>
                    )}
                  </div>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(errors.priceListSlug && watch('priceListSlug')?.slug?.length === 0)}
                  >
                    Price List
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='priceListSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='Price List'
                          maxImage={1}
                          setValue={setValue}
                          value={defaultValues?.priceListSlug}
                          name='priceListSlug'
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.priceListSlug && watch('priceListSlug')?.slug?.length === 0 && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                      Please upload price list
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(errors.allotmentLetterSlug && watch('allotmentLetterSlug')?.slug?.length === 0)}
                  >
                    Allotment Letter
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='allotmentLetterSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='Allotment Letter'
                          maxImage={1}
                          setValue={setValue}
                          value={defaultValues?.allotmentLetterSlug?.slug}
                          name='allotmentLetterSlug'
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.allotmentLetterSlug && watch('allotmentLetterSlug')?.slug?.length === 0 && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                      Please upload allotment letter
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(errors.titleDeedSlug && watch('titleDeedSlug')?.slug?.length === 0)}
                  >
                    Title Deed
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='titleDeedSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='Title Deed'
                          maxImage={1}
                          setValue={setValue}
                          value={defaultValues?.titleDeedSlug?.slug}
                          name='titleDeedSlug'
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.titleDeedSlug && watch('titleDeedSlug')?.slug?.length === 0 && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                      Please upload title deed
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(errors.jvAgreementSlug && watch('jvAgreementSlug')?.slug?.length === 0)}
                  >
                    JV Agreement
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='jvAgreementSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='JV Agreement'
                          maxImage={1}
                          setValue={setValue}
                          value={defaultValues?.jvAgreementSlug?.slug}
                          name='jvAgreementSlug'
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.jvAgreementSlug && watch('jvAgreementSlug')?.slug?.length === 0 && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                      Please upload jv agreement
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(errors.loiSlug && watch('loiSlug')?.slug?.length === 0)}
                  >
                    LOI Certificate
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='loiSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='LOI Certificate'
                          maxImage={1}
                          setValue={setValue}
                          value={defaultValues?.loiSlug?.slug}
                          name='loiSlug'
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.loiSlug && watch('loiSlug')?.slug?.length === 0 && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                      Please upload LOI Certificate
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(errors.codSlug && watch('codSlug')?.slug?.length === 0)}
                  >
                    COD Certificate
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='codSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='COD Certificate'
                          maxImage={1}
                          setValue={setValue}
                          value={defaultValues?.codSlug?.slug}
                          name='codSlug'
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.codSlug && watch('codSlug')?.slug?.length === 0 && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                      Please upload COD Certificate
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(errors.zoningPlanSlug && watch('zoningPlanSlug')?.slug?.length === 0)}
                  >
                    Zoning Plan
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='zoningPlanSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='Zoning Plan'
                          maxImage={1}
                          setValue={setValue}
                          value={defaultValues?.zoningPlanSlug?.slug}
                          name='zoningPlanSlug'
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.zoningPlanSlug && watch('zoningPlanSlug')?.slug?.length === 0 && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                      Please upload zoning plan
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(errors.demarcationPlanSlug && watch('demarcationPlanSlug')?.slug?.length === 0)}
                  >
                    Demarcation Plan
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='demarcationPlanSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='Demarcation Plan'
                          maxImage={1}
                          setValue={setValue}
                          value={defaultValues?.demarcationPlanSlug?.slug}
                          name='demarcationPlanSlug'
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.demarcationPlanSlug && watch('demarcationPlanSlug')?.slug?.length === 0 && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                      Please upload demarcation plan
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(errors.reraSpecificationSlug && watch('reraSpecificationSlug')?.slug?.length === 0)}
                  >
                    RERA specification
                  </InputLabel>
                  <div style={{ marginTop: '30px' }}>
                    <Controller
                      name='reraSpecificationSlug'
                      control={control}
                      render={() => (
                        <UploadCertificate
                          imageChange={imageChange}
                          setImageChange={setImageChange}
                          buttonText='Rera Specification'
                          maxImage={1}
                          setValue={setValue}
                          value={defaultValues?.reraSpecificationSlug}
                          name='reraSpecificationSlug'
                          accept={{
                            'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                          }}
                        />
                      )}
                    />
                    {errors.reraSpecificationSlug && watch('reraSpecificationSlug')?.slug?.length === 0 && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        Please upload rera specification
                      </FormHelperText>
                    )}
                  </div>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4}></Grid>
              <Grid container item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(errors.leaseDeedSlugs)}
                  >
                    Lease Deed
                  </InputLabel>
                  <div style={{ marginTop: '45px' }}>
                    <Controller
                      name='leaseDeedSlugs'
                      control={control}
                      render={({ field }) => (
                        <Fragment>
                          <DropzoneWrapper>
                            <FileUploaderRestrictions
                              files={field.value}
                              setValue={setValue}
                              setFiles={value => {
                                setValue('leaseDeedSlugs', value)
                              }}
                              // eslint-disable-next-line lines-around-comment
                              // Need to add the loader for uploading
                              accept={{
                                'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                              }}
                              loading={store.loading}
                              text={'Allowed *.jpeg, *.jpg, *.png, .pdf'}
                            />
                          </DropzoneWrapper>
                        </Fragment>
                      )}
                    />
                  </div>
                  {errors.leaseDeedSlugs && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                      Please upload lease deed
                    </FormHelperText>
                  )}
                </FormControl>
                <div
                  style={{
                    maxHeight: '250px',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    marginTop: '20px',
                    width: '100%'
                  }}
                >
                  {watch('leaseDeedSlugs').map((val, index) => (
                    <div
                      style={{
                        position: 'relative'
                      }}
                      key={index}
                    >
                      <CardDocument
                        file={val}
                        index={index}
                        remove={position => {
                          const uploadedFiles = getValues().leaseDeedSlugs
                          const filtered = uploadedFiles.filter((i: FileProp, index: number) => index !== position)
                          setValue('leaseDeedSlugs', [...filtered], {
                            shouldValidate: true,
                            shouldDirty: true
                          })
                        }}
                        fullWidth='97%'
                        removeIconSxProps={{
                          top: '6px',
                          right: '-6px'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Grid>
              <Grid container item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(errors.landDocumentSlugs)}
                  >
                    Land Documents
                  </InputLabel>
                  <div style={{ marginTop: '45px' }}>
                    <Controller
                      name='landDocumentSlugs'
                      control={control}
                      render={({ field }) => (
                        <Fragment>
                          <DropzoneWrapper>
                            <FileUploaderRestrictions
                              files={field.value}
                              setValue={setValue}
                              setFiles={value => {
                                setValue('landDocumentSlugs', value)
                              }}
                              // eslint-disable-next-line lines-around-comment
                              // Need to add the loader for uploading
                              accept={{
                                'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                              }}
                              loading={store.loading}
                              text={'Allowed *.jpeg, *.jpg, *.png, .pdf'}
                            />
                          </DropzoneWrapper>
                        </Fragment>
                      )}
                    />
                  </div>
                  {errors.landDocumentSlugs && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                      Please upload land document
                    </FormHelperText>
                  )}
                </FormControl>
                <div
                  style={{
                    maxHeight: '250px',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    marginTop: '20px',
                    width: '100%'
                  }}
                >
                  {watch('landDocumentSlugs').map((val, index) => (
                    <div
                      style={{
                        position: 'relative'
                      }}
                      key={index}
                    >
                      <CardDocument
                        file={val}
                        index={index}
                        remove={position => {
                          const uploadedFiles = getValues().landDocumentSlugs
                          const filtered = uploadedFiles.filter((i: FileProp, index: number) => index !== position)
                          setValue('landDocumentSlugs', [...filtered], {
                            shouldValidate: true,
                            shouldDirty: true
                          })
                        }}
                        fullWidth='97%'
                        removeIconSxProps={{
                          top: '6px',
                          right: '-6px'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Grid>
              <Grid container item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      marginLeft: '-15px'
                    }}
                    error={Boolean(errors.saleDeedSlugs)}
                  >
                    Sale deed
                  </InputLabel>
                  <div style={{ marginTop: '45px' }}>
                    <Controller
                      name='saleDeedSlugs'
                      control={control}
                      render={({ field }) => (
                        <Fragment>
                          <DropzoneWrapper>
                            <FileUploaderRestrictions
                              files={field.value}
                              setValue={setValue}
                              setFiles={value => {
                                setValue('saleDeedSlugs', value)
                              }}
                              // eslint-disable-next-line lines-around-comment
                              // Need to add the loader for uploading
                              accept={{
                                'application/pdf': ['.jpeg', '.jpg', '.png', '.pdf']
                              }}
                              loading={store.loading}
                              text={'Allowed *.jpeg, *.jpg, *.png, .pdf'}
                            />
                          </DropzoneWrapper>
                        </Fragment>
                      )}
                    />
                  </div>
                  {errors.saleDeedSlugs && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                      Please upload sale deed
                    </FormHelperText>
                  )}
                </FormControl>
                <div
                  style={{
                    maxHeight: '250px',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    marginTop: '20px',
                    width: '100%'
                  }}
                >
                  {watch('saleDeedSlugs').map((val, index) => (
                    <div
                      style={{
                        position: 'relative'
                      }}
                      key={index}
                    >
                      <CardDocument
                        file={val}
                        index={index}
                        remove={position => {
                          const uploadedFiles = getValues().saleDeedSlugs
                          const filtered = uploadedFiles.filter((i: FileProp, index: number) => index !== position)
                          setValue('saleDeedSlugs', [...filtered], { shouldValidate: true, shouldDirty: true })
                        }}
                        fullWidth='97%'
                        removeIconSxProps={{
                          top: '6px',
                          right: '-6px'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Card style={{ boxShadow: 'none', border: '1px solid lightgrey' }}>
            <CardHeader title='Specification' />
            <form style={{ width: '100%' }} noValidate>
              <Grid container xs={12} sx={{ pl: 6 }} spacing={spacing} mb={data?.length === 0 ? spacing : 0}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='category'
                      control={control1}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <Autocomplete
                            value={value?.length > 0 ? value : ''}
                            disableClearable
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            isOptionEqualToValue={(option, value) => option === value}
                            onChange={(event, newValue) => {
                              onChange(newValue)
                            }}
                            options={optionsData}
                            id='checkboxes-tags-demo'
                            getOptionLabel={option => option}
                            getOptionDisabled={option =>
                              Boolean(
                                data?.findIndex(val => val?.category?.toLowerCase() === option?.toLowerCase()) >= 0
                              )
                            }
                            renderOption={(props, option) => <li {...props}>{option}</li>}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Category'
                                placeholder='Category'
                                error={Boolean(error1.category)}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        )
                      }}
                    />
                    {error1.category && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        {error1.category.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='text'
                      control={control1}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          type='text'
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(error1.text)}
                          label='Description'
                        />
                      )}
                    />
                    {error1.text && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        {error1.text.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={2} style={{ marginBottom: '10px' }}>
                  <LoadingButton variant='contained' onClick={() => onSubmitSpecification()} startIcon={<Plus />}>
                    Add
                  </LoadingButton>
                </Grid>
                <Grid container item xs={12} sm={12} spacing={spacing}>
                  {data?.length > 0
                    ? data?.map((val: any, index1: number) => (
                        <Grid item xs={12} sm={4} key={index1}>
                          <Card
                            style={{
                              width: '100%',
                              boxShadow: 'none',
                              marginBottom: '20px',
                              height: '350px',
                              overflowY: 'scroll'
                            }}
                            variant='outlined'
                          >
                            <CardHeader
                              title={val?.category}
                              action={
                                <Tooltip
                                  title='Delete category'
                                  style={
                                    {
                                      // position: 'absolute',
                                      // top: 0,
                                      // right: '10px'
                                    }
                                  }
                                >
                                  <IconButton
                                    color='error'
                                    onClick={() => {
                                      remove(index1)
                                    }}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                              }
                            />
                            <CardContent
                              style={{
                                position: 'relative',
                                maxWidth: '100%',
                                wordBreak: 'break-all'
                              }}
                            >
                              <p>{val?.text}</p>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))
                    : null}
                </Grid>
              </Grid>
            </form>
          </Card>
          <Grid item xs={12} sm={12}>
            <LoadingButton
              variant='contained'
              style={{ float: 'right', marginRight: '20px', marginBottom: '20px', marginTop: '25px' }}
              type='submit'
              disabled={!(isDirty && isValid)}
              loading={store.loading || loader}
            >
              Save
            </LoadingButton>
          </Grid>
        </>
      ) : (
        'Please select RERA register in basic details Tab'
      )}
    </form>
  )
}

export default RERADetails
