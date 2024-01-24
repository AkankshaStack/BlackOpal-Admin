// ** React Imports
import { useState, FC, Dispatch, SetStateAction } from 'react'

// ** MUI Imports
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import Button from '@mui/material/Button'
import { NearbyPlaceData } from 'src/context/types'
import { CircularProgress, Dialog, DialogTitle, IconButton } from '@mui/material'
import { CloseCircleOutline } from 'mdi-material-ui'
import { patchPropertyDetails } from 'src/store/apps/property'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import { useSelector } from 'react-redux'

interface INearbyLocationListProps {
  nearLocationCoordinates: any[]
  selectedType: string
  setselectedLocations: Dispatch<SetStateAction<NearbyPlaceData[]>>
  selectedLocations: NearbyPlaceData[]
  setselectedType: Dispatch<SetStateAction<string>>
  isMapDataFetching: boolean
}

const NearbyLocationList: FC<INearbyLocationListProps> = ({
  nearLocationCoordinates,
  selectedType,
  setselectedLocations,
  selectedLocations,
  setselectedType,
  isMapDataFetching
}) => {
  // ** State
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setisLoading] = useState(false)
  const [checked, setChecked] = useState<number[]>([])
  const [isModalOpen, setisModalOpen] = useState(false)
  const router = useRouter()
  const { id } = router.query

  const store = useSelector((state: any) => state.property)

  const handleToggle = (value: number, location: NearbyPlaceData) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    handleSelectedLocation(selectedLocations, location)

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }

  const handleSelectedLocation = (selectedLocations: NearbyPlaceData[], location: NearbyPlaceData) => {
    const isDataExist = selectedLocations.filter(item => item.place_id === location.place_id)

    if (!isDataExist.length) {
      setselectedLocations(prev => [...prev, location])
    } else {
      const data = selectedLocations.filter(item => item.place_id !== location.place_id)

      setselectedLocations(data)
    }
  }

  const handleModalClose = () => {
    setisModalOpen(false)
  }
  const handleModalOpen = () => {
    setisModalOpen(true)
  }

  const handleLocationSubmit = async () => {
    const payload = {
      step: 'nearby',
      nearbyBusinesses: selectedLocations
    }
    setisLoading(true)
    dispatch(
      patchPropertyDetails({
        id: id,
        params: payload
      })
    )
      .then(() => {
        setselectedType('')
        setisLoading(false)
        handleModalClose()
      })
      .catch(() => {
        setisLoading(true)
        toast.error('Something went wrong')
      })
  }

  const boxStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  return (
    <Box sx={{ width: '30%', height: 500, position: 'relative' }}>
      {/* <Box sx={{ background: 'white', padding: '0.5rem 1rem', position: 'absolute', top: '-2rem' }}>
        <Button onClick={handleModalOpen} variant='contained' fullWidth>{`Selected All`}</Button>
      </Box> */}
      <List
        sx={{
          // width: '10%',
          height: '90%',
          overflowY: 'scroll'
        }}
      >
        {isMapDataFetching ? (
          <Box sx={boxStyle}>
            <CircularProgress />
          </Box>
        ) : nearLocationCoordinates?.length ? (
          nearLocationCoordinates.map(
            (item, index) =>
              item.businessType && (
                <ListItem disablePadding key={item.place_id}>
                  <ListItemButton onClick={handleToggle(index, item)}>
                    <ListItemText
                      id='checkbox-list-label-0'
                      primary={item.name}
                      sx={{
                        marginRight: '1.6rem'
                      }}
                    />
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge='end'
                        tabIndex={-1}
                        disableRipple
                        onChange={() => handleToggle(index, item)}
                        checked={!!selectedLocations.filter(location => item.place_id === location.place_id).length}
                        inputProps={{ 'aria-labelledby': 'checkbox-list-label-0' }}
                      />
                    </ListItemSecondaryAction>
                  </ListItemButton>
                </ListItem>
              )
          )
        ) : !selectedType ? (
          <Box sx={boxStyle}>
            <Typography>Select atleast one type.</Typography>
          </Box>
        ) : nearLocationCoordinates?.length === 0 ? (
          <Box sx={boxStyle}>
            <Typography>No Result Found</Typography>
          </Box>
        ) : (
          ''
        )}
      </List>
      <Box sx={{ background: 'white', padding: '0.5rem 1rem' }}>
        <Button
          onClick={handleModalOpen}
          variant='contained'
          fullWidth
        >{`Selected Locations (${selectedLocations.length})`}</Button>
      </Box>
      <Dialog fullWidth open={isModalOpen} maxWidth='xs' scroll='body' onClose={handleModalClose}>
        <DialogTitle sx={{ m: 0, p: 4 }}>
          Selected Locations
          <IconButton
            aria-label='close'
            onClick={handleModalClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8

              // color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseCircleOutline />
          </IconButton>
        </DialogTitle>
        <List
          sx={{
            // width: '10%',
            height: '60vh',
            overflowY: 'scroll'
          }}
        >
          {isMapDataFetching ? (
            <Box sx={boxStyle}>
              <CircularProgress />
            </Box>
          ) : selectedLocations.length ? (
            selectedLocations.map(
              (item, index) =>
                item.businessType && (
                  <ListItem disablePadding key={item.name}>
                    <ListItemButton onClick={handleToggle(index, item)}>
                      <ListItemText
                        id='checkbox-list-label-0'
                        primary={item.name}
                        sx={{
                          marginRight: '1.6rem'
                        }}
                      />
                      <ListItemSecondaryAction>
                        <Checkbox
                          edge='end'
                          tabIndex={-1}
                          disableRipple
                          onChange={handleToggle(index, item)}
                          checked={!!selectedLocations.filter(location => item.place_id === location.place_id).length}
                          inputProps={{ 'aria-labelledby': 'checkbox-list-label-0' }}
                        />
                      </ListItemSecondaryAction>
                    </ListItemButton>
                  </ListItem>
                )
            )
          ) : !selectedType ? (
            <Box sx={boxStyle}>
              <Typography>Select atleast one type.</Typography>
            </Box>
          ) : selectedLocations.length === 0 ? (
            <Box sx={boxStyle}>
              <Typography>No Result Found</Typography>
            </Box>
          ) : (
            ''
          )}
        </List>
        <Box sx={{ padding: '1rem', background: 'white', width: '100%' }}>
          <LoadingButton
            disabled={
              !selectedLocations.length ||
              (selectedLocations.length === store?.data?.nearbyBusiness.length &&
                selectedLocations.every((value, index) => value === store?.data?.nearbyBusiness[index]))
            }
            loading={isLoading}
            onClick={handleLocationSubmit}
            fullWidth
            variant='contained'
          >
            Submit
          </LoadingButton>
        </Box>
      </Dialog>
    </Box>
  )
}

export default NearbyLocationList
