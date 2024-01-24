// import { newPropertiesData } from 'src/@fake-db/collection'

import React, { FC, useRef, useState } from 'react'
import {
  Modal,
  IconButton,
  Box,
  Card,
  Typography,
  FormGroup,
  InputAdornment,
  TextField,
  Button,
  debounce,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { Close, Magnify } from 'mdi-material-ui'
import { useEffect } from 'react'
import CollectionPropetriesTable from './CollectionPropetriesTable'
import { LoadingButton } from '@mui/lab'
import { AppDispatch } from 'src/store'
import { useDispatch, useSelector } from 'react-redux'
import {
  addCollectionProperties,
  getCollectionProperties,
  resetLoadingState,
  updateCollection
} from 'src/store/collections'
import { PER_PAGE } from 'src/utilities/conversions'
import { addCollectionPropertiesType, collectionIncludes, IFormCollection } from 'src/store/collections/type'
import config from 'src/configs/config'

interface IProperties {
  [key: string]: any
}
interface IAddProperties {
  open: boolean
  setOpen: (value: boolean) => void
  setSelected: React.Dispatch<React.SetStateAction<IProperties[]>>
  cityId: number
  selectedProperties: IProperties[]
  formData?: IFormCollection
  status?: number
}

// import { newPropertiesData } from 'src/@fake-db/collection'
const fallbackPagination = {
  currentPage: 0,
  perPage: 0,
  total: 0,
  totalPages: 0
}

const AddProperties: FC<IAddProperties> = ({
  open,
  setOpen,
  setSelected,
  cityId,
  selectedProperties,
  formData,
  status
}) => {
  const ref = useRef<HTMLImageElement>(null)
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [propertyTypeId, setPropertyTypeId] = useState<any>(undefined)
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: any) => state.collections)
  const [newProperties, setNewProperties] = useState<IProperties[]>([])

  const handleCLose = () => {
    setOpen(false)
    setSearchText('')
  }
  useEffect(() => {
    const checkIfClickedOutside = (event: any) => {
      if (open && ref.current && !ref.current.contains(event.target)) {
        handleCLose()
      }
    }
    if (open) {
      call(1)

      setNewProperties(selectedProperties)
    }
    document.addEventListener('mousedown', checkIfClickedOutside)

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const call = (page: number, searchValue = searchText) => {
    // ** Page and per page have been commented out as the api is not supporting it

    const payload: addCollectionPropertiesType = {
      include: collectionIncludes,
      listingStatus: config?.listingStatus?.listed,
      status: config?.propertyStatus?.approved,
      cityId: cityId,
      page: page || 1,
      perPage: PER_PAGE,
      propertyTypeId: (propertyTypeId == 0 ? undefined : propertyTypeId)
    }
    console.log(payload, '-----payload----')
    if (searchValue.length > 0) {
      payload.q = searchValue
    }

    dispatch(addCollectionProperties(payload))
  }

  useEffect(() => {
    call(1)
  }, [propertyTypeId])


  // useEffect(() => {
  //   if (open) {
  //     call(1)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [open])

  // useEffect(() => {
  //   selectedProperties

  //   setAllProperties(store?.addCollectionProperties)
  // }, [store?.addCollectionProperties])
  const propertyType = [
    {
      name: 'All Properties',
      id: 0
    },
    {
      name: 'High Rise Apartment',
      id: 1
    },
    {
      name: 'Villa',
      id: 2
    },
    {
      name: 'Independent Floor',
      id: 3
    },
    {
      name: 'Residential Plot',
      id: 4
    },
    {
      name: 'Studio Apartment',
      id: 5
    },
    {
      name: 'Senior Living',
      id: 6
    },
    {
      name: 'Student Housing',
      id: 7
    },
    {
      name: 'Service Apartment',
      id: 8
    },
    {
      name: 'Lowrise Apartment',
      id: 9
    }
  ]

  const handleChange = (e: any) => {
    setPropertyTypeId(parseInt(e.target.value))
  }

  console.log(propertyTypeId, '----propertyTypeId')

  const handleSearch = debounce((searchValue: string) => {
    setSearchText(searchValue)
    if (searchValue.length > 0) {
      call(1, searchValue)
    } else {
      call(1, '')
    }
  }, 400)
  const onSave = () => {
    setLoading(true)
    const data = newProperties.map(data => {
      return data?.id
    })
    if (store?.collectionData?.id) {
      // state: store?.collectionData?.city?.state?.id,
      // // country: store?.collectionData?.city?.state?.country?.id,
      //  Get Values
      if (formData) {
        const payload = {
          name: formData?.collectionName,
          title: formData?.collectionTitle,
          desc: formData?.collectionDescription,
          imageSlug: formData?.collectionImage,
          cityId: formData?.collectionLocation?.cityId?.id,
          propertyArray: data,
          status
        }

        dispatch(
          updateCollection({
            id: store?.collectionData?.id,
            data: payload
          })
        ).then(res => {
          if (res.payload?.code === 200) {
            setLoading(false)
            handleCLose()
            setSelected([])
            dispatch(
              getCollectionProperties({
                collectionId: Number(store?.collectionData?.id),
                include: collectionIncludes,
                paginate: false
              })
            ).then(res => {
              if (res.payload?.code === 200) {
                dispatch(resetLoadingState())
              }
            })
          }
        })
      }

      return
    } else {
      setSelected(newProperties)
      setLoading(false)
      setOpen(false)
      setLoading(false)
    }
    setSearchText('')
  }

  return (
    <Modal open={open} onClose={() => handleCLose()} sx={{ maxHeight: '100%' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          objectFit: 'contain',
          padding: '2rem'
        }}
      >
        <Card
          sx={{ p: 10, width: '90vw', height: '80vh', display: 'flex', flexDirection: 'column', position: 'relative' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', maxHeight: 'fit-content' }}>
            <Typography variant='h4' title={`Add New Properties`} noWrap sx={{ fontSize: '1rem', ml: 2, mb: 4 }}>
              Add New Properties
            </Typography>
            <IconButton
              onClick={() => handleCLose()}
              style={{
                position: 'absolute',
                top: 10,
                right: 10
              }}
            >
              <Close style={{ color: 'black' }} />
            </IconButton>
          </Box>
          {/* <Box sx={{  }}> */}

          <FormGroup
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              justifyContent: 'center',
              marginBottom: 20
            }}
          >
            <FormControl sx={{ marginBottom: 1, width: '40%', marginRight: '10px' }}>
              <InputLabel id='type' style={{ fontWeight: '600', color: 'black' }}>
                Property type
              </InputLabel>
              <Select
                variant='outlined'
                labelId='Select Any'
                autoFocus
                required
                id='type'
                label='Select Any'
                onChange={handleChange}
              >
                {propertyType.map((item: any) => (
                  <MenuItem key={item} value={item?.id}>
                    {item?.name}
                  </MenuItem>
                ))}


              </Select>
            </FormControl>
            <TextField
              placeholder='Please Search Property'
              className='search-box'
              onChange={e => handleSearch(e.target.value)}
              sx={{
                width: '60%',
                '& fieldset': {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0
                },
                '& .MuiOutlinedInput-root': {
                  background: 'white'
                },
                '& .MuiFormHelperText-root': {
                  marginLeft: 'auto'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Magnify />
                  </InputAdornment>
                )
              }}
            />
            <LoadingButton
              variant='contained'
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                height: '56px'
              }}
              onClick={() => handleSearch(searchText)}
            >
              Search
            </LoadingButton>
          </FormGroup>
          <CollectionPropetriesTable
            selectedProperties={newProperties}
            setSelectedProperties={setNewProperties}
            allProperties={store?.addCollectionProperties}
            isCover
            loading={store?.addCollectionPropertiesLoading ? store.addCollectionPropertiesLoading : false}
            pageChange={call}
            pagination={
              store?.addCollectionPropertiesPagination ? store.addCollectionPropertiesPagination : fallbackPagination
            }
          />
          <Box>
            <Button
              variant='outlined'
              style={{ float: 'right', marginRight: '10px', marginTop: '20px' }}
              type='submit'
              color='error'
              sx={{ width: '100px' }}
              onClick={() => handleCLose()}
            >
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              style={{ float: 'right', marginRight: '10px', marginTop: '20px' }}
              type='submit'
              sx={{ width: '100px' }}
              loading={loading}
              onClick={onSave}
            >
              Save
            </LoadingButton>
          </Box>
        </Card>
      </div>
    </Modal>
  )
}

// allProperties={allProperties}

export default AddProperties
