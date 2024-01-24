import { SyntheticEvent, useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import { Card, Tab, CardContent, CardHeader, IconButton, Box, CircularProgress } from '@mui/material'
import { TabList, TabPanel, TabContext } from '@mui/lab'
import { ArrowLeft } from 'mdi-material-ui'
import DashboardAgent from '../components/dashboard-agent'
import ReviewProfile from '../components/documents/reviewProfile'
import ServiceDetails from '../components/service-details'
import TeamMembers from '../components/team-members'
import ProjectList from '../components/projectList/ProjectList'
import { useDispatch } from 'react-redux'
import { fetchsingleData } from 'src/store/apps/user'
import { AppDispatch } from 'src/store'
import { useSelector } from 'react-redux'
import config from 'src/configs/config'
import Leads from 'src/views/components/leads/Leads'
import TransactionTable from 'src/views/components/transaction-table/TransactionTable'
import CustomChip from 'src/@core/components/mui/chip'

const User = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [value, setValue] = useState<string>('1')

  const store = useSelector((state: any) => state.user.singleData)
  const loading = useSelector((state: any) => state.user.loading)

  useEffect(() => {
    if (router?.query?.uid) {
      dispatch(
        fetchsingleData({
          id: router?.query?.uid,
          payload: {
            include: 'company,business,userDetails,microMarketAddress'
          }
        })
      )
    }
  }, [dispatch, router])

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Fragment>
      {loading ? (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <CardHeader
            title={
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <IconButton onClick={() => router.back()}>
                  <ArrowLeft />
                </IconButton>
                <Box sx={{ display: 'flex', marginLeft: '10px' }}>
                  <h4 style={{ marginLeft: '0px', marginTop: 0, marginBottom: 0 }}>
                    {store?.userDetails?.orgType !== config.orgType.company
                      ? `#${store?.refNo !== null ? store?.refNo : 'AG0' + String(store?.id)} | ${
                          store?.userDetails?.firstName || 'Agent Admin'
                        } ${store?.userDetails?.lastName || ''}`
                      : `#${store?.refNo !== null ? store?.refNo : 'AG0' + String(store?.id)} | ${
                          store?.company?.name || 'Agent Admin'
                        }`}
                  </h4>
                  <CustomChip
                    skin='light'
                    size='small'
                    label={
                      store?.userDetails?.orgType === config.orgType.company
                        ? 'Company'
                        : store?.userDetails?.orgType === config.orgType.individual
                        ? 'Propertiership'
                        : 'Freelancer'
                    }
                    color='secondary'
                    sx={{
                      height: 25,
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      alignSelf: 'flex-start',

                      ml: 1
                    }}
                  />
                </Box>
              </div>
            }
          />
          <CardContent>
            <TabContext value={value}>
              <TabList onChange={handleChange} aria-label='card navigation example' variant='scrollable'>
                <Tab value='1' label='Dashboard' />
                <Tab value='2' label='Profile Details' />
                <Tab value='3' label='Service Details' />
                {store?.verificationStatus === config.agents.verificationStatus.verified && (
                  <Tab value='4' label='Team Members' />
                )}
                {store?.verificationStatus === config.agents.verificationStatus.verified && (
                  <Tab value='5' label='Projects' />
                )}
                {store?.verificationStatus === config.agents.verificationStatus.verified && (
                  <Tab value='6' label='Leads' />
                )}
                {store?.verificationStatus === config.agents.verificationStatus.verified && (
                  <Tab value='7' label='Transaction History' />
                )}
              </TabList>
              <CardContent>
                <TabPanel value='1' sx={{ p: 0 }}>
                  <DashboardAgent />
                </TabPanel>
                <TabPanel value='2' sx={{ p: 0 }}>
                  <ReviewProfile />
                </TabPanel>

                <TabPanel value='3' sx={{ p: 0 }}>
                  <ServiceDetails />
                </TabPanel>
                <TabPanel value='4' sx={{ p: 0 }}>
                  <TeamMembers />
                </TabPanel>
                <TabPanel value='5' sx={{ p: 0 }}>
                  <ProjectList />
                </TabPanel>
                <TabPanel value='6' sx={{ p: 0 }}>
                  <Leads />
                </TabPanel>
                <TabPanel value='7' sx={{ p: 0 }}>
                  <TransactionTable name={store?.company?.name || 'Agent Admin'} />
                </TabPanel>
              </CardContent>
            </TabContext>
          </CardContent>
        </Card>
      )}
    </Fragment>
  )
}

export default User
