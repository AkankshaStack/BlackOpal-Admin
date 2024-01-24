// ** React Imports
import { Fragment, SyntheticEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import BasicDetails from './basic-details'
import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import Configuration from './configuration'
import DeveloperDetails from './developer'
import RERADetails from './rera-details'
import Aminities from './amenities'
import { useRouter } from 'next/router'
import NearbyPlaces from 'src/views/components/nearbyPlaces/NearbyPlaces'

import ArrowLeft from 'mdi-material-ui/ArrowLeft'
import { fetchPropertyDetails } from 'src/store/apps/property'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'

// import NearByPlaces from './nearbyplaces'

const EditProperty = () => {
  // ** State
  const [value, setValue] = useState<string>('1')
  const [Loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const { id } = router.query

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(
      fetchPropertyDetails({
        id,
        params: {
          include:
            'tags,address,reraAnalytics,propertyInventory,homeloanPartners,developer,statusUpdatedByUser,listingStatusUpdatedByUser,amenities,createdByUser,details,localities,nearbyBusiness,localities'
        }
      })
    ).then(res => {
      if (res?.payload?.data?.id) {
        setLoading(false)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardContent>
        {Loading ? (
          <Box sx={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Fragment>
            <Typography
              color='primary'
              onClick={() => {
                // @ts-ignore
                if (Object.keys(router?.components)?.length === 2) {
                  router.push('/')

                  return
                }
                router.back()
              }}
              style={{ marginBottom: '10px', display: 'flex', width: 'fit-content', cursor: 'pointer' }}
            >
              <ArrowLeft color='primary' />
              <span style={{ marginLeft: '3px' }}>Back</span>
            </Typography>
            <TabContext value={value}>
              <TabList
                variant='scrollable'
                onChange={(event: SyntheticEvent, val: string) => handleChange(event, val)}
                aria-label='full width tabs example'
              >
                <Tab value='1' label='Basic Details' />
                <Tab value='2' label='Configurations' />
                <Tab value='3' label='Developer Details' />
                <Tab value='4' label='RERA Details' />
                <Tab value='5' label='Near By Places' />
                <Tab value='6' label='Amenities' />
              </TabList>

              <TabPanel value='1'>
                <BasicDetails id={id} />
              </TabPanel>
              <TabPanel value='2'>
                <Configuration id={id} />
              </TabPanel>
              <TabPanel value='3'>
                <DeveloperDetails id={id} />
              </TabPanel>
              <TabPanel value='4'>
                <RERADetails id={id} />
              </TabPanel>
              <TabPanel value='5'>
                <NearbyPlaces />
              </TabPanel>
              <TabPanel value='6'>
                <Aminities id={id} />
              </TabPanel>
            </TabContext>
          </Fragment>
        )}
      </CardContent>
    </Card>
  )
}

export default EditProperty
