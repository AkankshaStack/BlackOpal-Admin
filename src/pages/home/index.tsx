/* eslint-disable @typescript-eslint/no-unused-vars */
import CardStatsCharacter from 'src/@core/components/card-statistics/card-stats-with-image'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Components Imports
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
// ** Custom Component Import
// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import SwiperControls from 'src/views/components/swiper/SwiperControls'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const apiData = {
  statsCharacter: [
    {
      stats: '10',
      title: 'Agent Approval'
    },
    {
      stats: '5',
      title: 'Profile Updates'
    },
    {
      stats: '40',
      title: 'Pending Queries'
    },
    {
      stats: '50',
      title: 'Solved Queries'
    }
  ]
}

const HomePage = () => {
  const {
    settings: { direction }
  } = useSettings()
  const auth = useAuth()

  return (
    <>
      <ApexChartWrapper>
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={12}>
            <Typography variant='h4' style={{ textTransform: 'capitalize' }}>{`Welcome, ${
              auth?.user?.firstName || 'Project Admin'
            } ${auth?.user?.lastName || ''}`}</Typography>

            <Typography sx={{ mt: 5, whiteSpace: 'nowrap' }}></Typography>
          </Grid>
          <Grid item xs={12}>
            {/* <CardStatisticsCharacters data={apiData.statsCharacter} /> */}
            {/* <CardStatsCharacter data={apiData.statsCharacter[0]} /> */}
            <Grid container spacing={6}>
              {apiData?.statsCharacter?.map((d: any, index: number) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <CardStatsCharacter key={index} data={d} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* <Grid item xs={12} sx={{ mb: 4 }}>
            <Typography variant='h6'>Agent Requests</Typography>
          </Grid> */}
        </Grid>
      </ApexChartWrapper>

      {/* <KeenSliderWrapper>
        <Grid item xs={12}>
          <SwiperControls direction={direction} />
        </Grid>
      </KeenSliderWrapper> */}
    </>
  )
}

export default HomePage
