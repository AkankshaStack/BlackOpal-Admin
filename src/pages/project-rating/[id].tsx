import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Card, CardContent, CircularProgress, Rating, Tab, Tooltip } from '@mui/material'
import { useRouter } from 'next/router'
import React, { Fragment, SyntheticEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { getPropertyRating } from 'src/store/rating'
import CollapsableContent from 'src/views/components/collpasable-content'
import Header from 'src/views/components/header'
import { fetchPropertyDetails } from 'src/store/apps/property'
import RatingAlert from 'src/views/components/collpasable-content/RaingAlert'

const ProjectRating = () => {
  const [value, setValue] = useState<string>('0')
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.rating)
  const propertyStore: any = useSelector((state: RootState) => state.property)
  const router = useRouter()

  useEffect(() => {
    if (router?.query?.id) {
      dispatch(getPropertyRating({ id: router?.query?.id as string }))
      dispatch(
        fetchPropertyDetails({
          id: router?.query?.id as string,
          params: {
            include: ''
          }
        })
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card sx={{ p: 2, height: '85vh', overflowY: 'scroll' }}>
      <Header name='Rating' />
      <CardContent>
        {store?.ratingLoading || propertyStore?.loading ? (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Fragment>
            {store?.ratingData?.length === 0 ? (
              <Box
                sx={{ height: '85vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                No Ratings Found
              </Box>
            ) : (
              <Fragment>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
                  <Tooltip title={propertyStore?.data?.name || ''}>
                    <h4 style={{ margin: 0, alignSelf: 'flex-start' }}>{propertyStore?.data?.name || ''}</h4>
                  </Tooltip>
                  <Box component='div' sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <Rating
                      name='half-rating-read'
                      defaultValue={propertyStore?.data?.averageRating}
                      readOnly
                      precision={0.1}
                    />
                    {propertyStore?.data?.averageRating
                      ? `(${1 * parseFloat(propertyStore?.data?.averageRating.toFixed(1))})`
                      : ''}
                  </Box>
                </Box>
                <TabContext value={value}>
                  <TabList
                    variant='scrollable'
                    onChange={(event: SyntheticEvent, val: string) => handleChange(event, val)}
                    aria-label='full width tabs example'
                  >
                    {store?.ratingData?.map((val: any, index: number) => (
                      <Tab value={String(index)} label={val?.label} key={val?.label} />
                    ))}
                  </TabList>
                  {store?.ratingData?.map((val: any, index: number) => (
                    <TabPanel value={String(index)} key={val?.label}>
                      {val?.type === 'alert' ? (
                        <RatingAlert val={val} />
                      ) : (
                        <CollapsableContent data={val?.data} averageRating={val?.averageRating} />
                      )}
                    </TabPanel>
                  ))}
                </TabContext>
              </Fragment>
            )}
          </Fragment>
        )}
      </CardContent>
    </Card>
  )
}

export default ProjectRating
