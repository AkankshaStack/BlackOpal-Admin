import { useState, useEffect } from 'react'
import { ListItem, ListItemText, Typography, List, ListSubheader, Tooltip, Tab } from '@mui/material'
import {
  Cash,
  HospitalBuilding,
  School,
  Shopping,
  Cart,
  Airport,
  BusStop,
  Train,
  PoliceBadge,
  LandPlots
} from 'mdi-material-ui'
import TabContext from '@mui/lab/TabContext'
import { TabList } from '@mui/lab'

const PropertyMap = ({ nearbyPlaces }) => {
  const [selectedType, setselectedType] = useState('1')
  const [selectedLocationsByType, setselectedLocationsByType] = useState([])

  const handleTypeChange = key => {
    setselectedType(key)
  }

  useEffect(() => {
    setselectedLocationsByType(nearbyPlaces.filter(item => item.businessType === Number(selectedType)))
  }, [selectedType])

  return (
    <>
      <List
        sx={{
          // position: 'absolute',
          // top: 20,
          // left: 20,
          width: '100%',
          height: 200,
          bgcolor: '#F5F5F7',
          borderRadius: 1,
          overflow: 'scroll',
          zIndex: 10,
          mb: 4,
          '& ul': { padding: 0 }
        }}
        subheader={<li />}
      >
        <ListSubheader sx={{ bgcolor: '#e6e6e6' }}>{`Nearby ${
          NEARBY_LOCATION.filter(item => item.key === Number(selectedType))[0]?.label
        }`}</ListSubheader>
        {selectedLocationsByType.length ? (
          selectedLocationsByType.map((item, index) => (
            <ListItem
              key={index}
              component='div'
              sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', py: 2.5 }}
            >
              <Tooltip title={`${item.name}`}>
                <Typography noWrap>{`${item.name}`}</Typography>
              </Tooltip>
              <Typography sx={{ whiteSpace: 'nowrap', marginLeft: 1 }}>{`${parseFloat(
                item.distanceInMeters / 1000
              ).toPrecision(2)} km`}</Typography>
            </ListItem>
          ))
        ) : (
          <ListItem component='div'>
            <ListItemText sx={{ fontStyle: 'italic' }} primary={`No Result Found`} />
          </ListItem>
        )}
      </List>
      <TabContext value={selectedType}>
        <TabList
          variant='scrollable'
          aria-label='full width tabs example'
          onChange={(event, val) => {
            console.log('lplplplp', event, val)
            handleTypeChange(val)
          }}
          sx={{
            '& .MuiTabs-scrollButtons': {
              display: 'inline-flex !important'
            }
          }}
        >
          {NEARBY_LOCATION.map(item => (
            <Tab key={item.label} value={String(item.key)} icon={item.icon} label={item.label} />
          ))}
        </TabList>
      </TabContext>
    </>
  )
}

export default PropertyMap

export const NEARBY_LOCATION = [
  {
    label: 'school',
    key: 1,
    icon: <School color='primary' fontSize='medium' />
  },
  {
    label: 'mall',
    key: 2,
    icon: <Cart color='primary' fontSize='medium' />
  },
  {
    label: 'hospital',
    key: 3,
    icon: <HospitalBuilding color='primary' fontSize='medium' />
  },
  {
    label: 'store',
    key: 4,
    icon: <Shopping color='primary' fontSize='medium' />
  },
  {
    label: 'ATM',
    key: 5,
    icon: <Cash color='primary' fontSize='medium' />
  },
  {
    label: 'Airport',
    key: 6,
    icon: <Airport color='primary' fontSize='medium' />
  },
  {
    label: 'Bus Station',
    key: 7,
    icon: <BusStop color='primary' fontSize='medium' />
  },
  {
    label: 'Metro',
    key: 8,
    icon: <Train color='primary' fontSize='medium' />
  },
  {
    label: 'Police',
    key: 9,
    icon: <PoliceBadge color='primary' fontSize='medium' />
  },
  {
    label: 'Park',
    key: 10,
    icon: <LandPlots color='primary' fontSize='medium' />
  }
]
