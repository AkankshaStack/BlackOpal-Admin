import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import {
  Box,
  Button,
  CircularProgress,
  debounce,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material'
import React, { FC, Fragment, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import UploadProfile from 'src/pages/components/image'
import LocationCard1 from 'src/pages/components/locationCard1'
import { AppDispatch, RootState } from 'src/store'
import { fetchCountry } from 'src/store/apps/property'
import * as yup from 'yup'
import { LoadingButton } from '@mui/lab'
import config from 'src/configs/config'
import { useRouter } from 'next/router'
import {
  addCollection,
  addCollectionProperties,
  getCollectionData,
  getCollectionProperties,
  resetStoreState,
  setLoader,
  updateCollection
} from 'src/store/collections'
import CollectionPropetriesTable from './CollectionPropetriesTable'
import AddProperties from './AddProperties'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import toast from 'react-hot-toast'
import { addCollectionPropertiesType, collectionIncludes } from 'src/store/collections/type'
import { PER_PAGE } from 'src/utilities/conversions'
import { ERoutes } from 'src/common/routes'

interface IFormCollection {
  collectionName: string
  collectionTitle: string
  collectionDescription: string
  collectionImage: string
  collectionLocation: {
    cityId: {
      id: number
    }
    stateId: {
      id: number
    }
    countryId: {
      id: number
    }
  }
}

interface IPayload {
  name: string
  title: string
  desc: string
  imageSlug: string
  cityId: number
  propertyArray: any
  status?: number
}

interface ICollectionForm {
  isEditable?: boolean
}
interface IProperties {
  [key: string]: any
}

const CollectionForm: FC<ICollectionForm> = ({ isEditable }) => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const store = useSelector((state: RootState) => state.collections)
  const [allProperties, setAllProperties] = useState<IProperties[]>([])
  const [collectionStatus, setCollectionStatus] = useState<number>(1)
  const [isAddProperties, setIsAddProperties] = useState(false)
  const [searchText, setSearchText] = useState<any>([])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const callProperties = (page: number) => {
    dispatch(
      getCollectionProperties({
        collectionId: Number(router.query.id),
        include: collectionIncludes,
        paginate: false
      })
    )
  }

  useEffect(() => {
    if (router.query.id) {
      const payload = {
        include: 'city'
      }
      dispatch(
        getCollectionData({
          data: payload,
          id: router.query.id
        })
      )
      callProperties(1)
    }
    dispatch(fetchCountry())

    return () => {
      dispatch(resetStoreState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const schema = yup.object().shape({
    collectionImage: yup.string().strict(false).trim().required('Please Add Image'),
    collectionName: yup.string().strict(false).trim().required('Please Enter a name').min(5).max(50),
    collectionTitle: yup.string().strict(false).trim().required('Please Enter a title').min(5).max(100),
    collectionDescription: yup.string().strict(false).trim().required('Please Enter a description').min(10).max(250),
    collectionLocation: yup.object().shape({
      cityId: yup.object().shape({
        id: yup.number().required('Please select city').moreThan(0, 'Please select city'),
        name: yup.string()
      }),
      stateId: yup.object().shape({
        id: yup.number().required('Please select state').moreThan(0, 'Please select state'),
        name: yup.string()
      }),
      countryId: yup.object().shape({
        id: yup.number().required('Please select country').moreThan(0, 'Please select country'),
        name: yup.string()
      })
    })
  })

  const defaultValues = {
    collectionImage: store?.collectionData?.imageSlug ? store?.collectionData?.imageSlug : '',
    collectionName: store?.collectionData?.name ? store?.collectionData?.name : '',
    collectionTitle: store?.collectionData?.title ? store?.collectionData?.title : '',
    collectionDescription: store?.collectionData?.desc ? store?.collectionData?.desc : '',
    collectionLocation: {
      cityId: {
        id: store?.collectionData?.city?.id ? store?.collectionData?.city?.id : 0,
        name: store?.collectionData?.city?.name ? store?.collectionData?.city?.name : ''
      },
      stateId: {
        id: store?.collectionData?.city?.state?.id ? store?.collectionData?.city?.state?.id : 0,
        name: store?.collectionData?.city?.state?.name ? store?.collectionData?.city?.state?.name : ''
      },
      countryId: {
        id: store?.collectionData?.city?.state?.country?.id ? store?.collectionData?.city?.state?.country?.id : 0,
        name: store?.collectionData?.city?.state?.country?.name ? store?.collectionData?.city?.state?.country?.name : ''
      }
    }
  }

  const onSubmit = async (data: IFormCollection) => {
    const data1 = allProperties.map(data => {
      return data?.id
    })

    const payload: IPayload = {
      name: data.collectionName,
      title: data.collectionTitle,
      desc: data.collectionDescription,
      imageSlug: data.collectionImage,
      cityId: data.collectionLocation.cityId.id,
      propertyArray: data1
    }

    if (isEditable) payload.status = collectionStatus

    if (!isEditable) {
      dispatch(addCollection(payload)).then(res => {
        if (res?.payload?.code === 200) {
          router.push(ERoutes.COLLECTION)
          toast.success('Collection Added Successfully')
        }
      })
    } else {
      dispatch(updateCollection({ data: payload, id: router.query.id })).then(res => {
        if (res?.payload?.code === 200) {
          router.push(ERoutes.COLLECTION)
          toast.success('Collection Updated Successfully')
        }
      })
    }
    reset(defaultValues)
  }

  const handleSearch = debounce((searchValue: string) => {
    setSearchText(searchValue)
    if (router.query.id) {
      if (searchValue.length > 0) {
        dispatch(
          setLoader({
            loader: true,
            data: []
          })
        )
        const obj: any = []
        allProperties?.map(o => {
          if (o.name.toLowerCase().includes(searchValue.toLowerCase())) {
            obj.push(o) // stop searching
          }
        })

        dispatch(
          setLoader({
            data: obj,
            loader: false
          })
        )
      } else {
        dispatch(
          setLoader({
            data: allProperties,
            loader: false
          })
        )
      }
    }
  }, 600)
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<IFormCollection>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  useEffect(() => {
    if (Object.keys(store?.collectionData).length) {
      reset(defaultValues)
      setCollectionStatus(Number(store?.collectionData?.status))
    }
    if (store?.collectionData?.city?.state?.id) {
      const payload: addCollectionPropertiesType = {
        include: collectionIncludes,
        listingStatus: config?.listingStatus?.listed,
        status: config?.propertyStatus?.approved,
        cityId: store?.collectionData?.city?.state?.id,
        page: 1,
        perPage: PER_PAGE
      }

      dispatch(addCollectionProperties(payload))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store?.collectionData])

  useEffect(() => {
    if (searchText.length === 0 && allProperties?.length === 0) {
      // setSelectedProperties(prev => [...prev, ...store?.collectionProperties])
      setAllProperties(store?.collectionProperties)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store?.collectionProperties])

  // const newPropperties = (newProperties: any[]) => {
  //   // setSelectedProperties((prev: IProperties[]) => [...prev, ...newProperties])
  //   // setAllProperties((prev: IProperties[]) => [...prev, ...newProperties])
  //   // setAllProperties([...newProperties])
  // }

  const values = getValues()

  return (
    <Fragment>
      {store?.loading ? (
        <Box sx={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={6}>
            <Grid item sm={isEditable ? 8 : 12} xs={12} sx={{ ml: 5 }} style={{ paddingTop: 0 }}>
              <p>
                {'Collection Image'} <span style={{ color: '#db3131' }}>*</span>
              </p>
              <UploadProfile
                maxImage={1}
                name='collectionImage'
                setValue={setValue}
                accept={{
                  'image/jpeg': ['.jpeg', '.jpg', '.png']
                }}
                size={200}
                collectionForm
                uploadedImage={
                  store?.collectionData?.imageSlug
                    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${store?.collectionData?.imageSlug}`
                    : false
                }
              />
              {errors.collectionImage && (
                <FormHelperText sx={{ color: 'error.main', marginTop: 2, ml: 4 }} id='validation-basic-first-name'>
                  {errors.collectionImage.message}
                </FormHelperText>
              )}
            </Grid>
            {isEditable && (
              <Grid item xs={12} sm={3} sx={{ alignSelf: 'end' }}>
                <FormControl fullWidth>
                  <InputLabel
                    id='demo-simple-select-label'

                    // error={Boolean(errors.declineReason)}
                  >
                    Status of Collection
                  </InputLabel>

                  <Select
                    value={String(collectionStatus)}
                    onChange={(e: SelectChangeEvent) => setCollectionStatus(Number(e.target.value))}
                    label='Status of Collection'
                    labelId='validation-basic-select'
                    aria-describedby='validation-basic-select'
                  >
                    {Object.values(config.collectionStatus).map((item, index) => (
                      <MenuItem key={index + 1} value={index + 1}>
                        {config.collectionStatus[index + 1]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='collectionName'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} required error={Boolean(errors.collectionName)} label='Collection name' />
                  )}
                />
                {errors.collectionName && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    {errors.collectionName.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='collectionTitle'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} required error={Boolean(errors.collectionTitle)} label='Collection title' />
                  )}
                />
                {errors.collectionTitle && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    {errors.collectionTitle.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='collectionDescription'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      rows={4}
                      required
                      multiline
                      error={Boolean(errors.collectionDescription)}
                      label='Collection description'
                    />
                  )}
                />
                {errors.collectionDescription && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    {errors.collectionDescription.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <LocationCard1
                addressLabel='Collection location'
                name='collectionLocation'
                control={control}
                errors={errors}
                values={values}
                setValue={setValue}
                watch={watch}
                customSet={() => {
                  setAllProperties([])
                }}
                isLocation
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 6, mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: allProperties?.length > 0 || searchText?.length > 0 ? 'space-between' : 'flex-end'
              }}
            >
              {allProperties?.length > 0 || searchText?.length > 0 ? (
                <QuickSearchToolbar
                  onChange={(event: any) => handleSearch(event.target.value)}
                  isNotDataGrid
                  isTeamMember='Search by name'
                />
              ) : null}
              <Button
                variant='contained'
                disabled={
                  !(watch('collectionLocation.cityId').id > 0 || store?.collectionData?.city?.id > 0) ||
                  (allProperties?.length > 0 &&
                    store?.addCollectionPropertiesPagination?.total > 0 &&
                    allProperties?.length === store?.addCollectionPropertiesPagination?.total)
                }
                onClick={() => setIsAddProperties(true)}
              >
                Add Properties
              </Button>
            </Box>
          </Box>
          {allProperties?.length > 0 ? (
            <CollectionPropetriesTable
              selectedProperties={allProperties}
              setSelectedProperties={setAllProperties}
              allProperties={searchText?.length > 0 ? store?.collectionProperties : allProperties}
              loading={store?.collectionPropertiesLoading ? store.collectionPropertiesLoading : false}
              pageChange={callProperties}

              // setUnselectedProperties={setUnselectedProperties}
            />
          ) : null}
          <LoadingButton
            loading={store?.loading}
            variant='contained'
            style={{ float: 'right', marginTop: '20px', marginBottom: '10px' }}
            type='submit'
            disabled={allProperties.length === 0 || !isValid}
          >
            {router?.query?.id ? 'Update' : 'Submit'}
          </LoadingButton>

          <AddProperties
            setSelected={setAllProperties}
            selectedProperties={allProperties}
            cityId={watch('collectionLocation.cityId').id}
            open={isAddProperties}
            formData={values}
            setOpen={setIsAddProperties}
            status={collectionStatus}
          />
        </form>
      )}
    </Fragment>
  )
}

export default CollectionForm
