import CardStatsCharacter from 'src/@core/components/card-statistics/card-stats-with-image'

// import { useSettings } from 'src/@core/hooks/useSettings'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import ApexAreaChart from 'src/views/charts/apex-charts/ApexAreaChart'
import Grid from '@mui/material/Grid'

const apiData = {
  statsCharacter: [
    {
      stats: '10',
      title: 'Total Properties'
    },
    {
      stats: '5',
      title: 'Total  Leads'
    },
    {
      stats: '40',
      title: 'Your average rating'
    },
    {
      stats: '50',
      title: 'Wallet Balance'
    }
  ]
}

const DashboardAgent = () => {
  // const {
  //   settings: { direction }
  // } = useSettings()

  return (
    <>
      <ApexChartWrapper>
        <Grid container spacing={6} className='match-height'>
          {/* <Grid item xs={12}>
            <Typography variant='h4'>Welcome, Admin agent</Typography>
            <Typography sx={{ mt: 5, whiteSpace: 'nowrap' }}>Here's your dashboard! sit amet, Lorem Episem </Typography>
          </Grid> */}
          <Grid item xs={12}>
            <Grid container spacing={6}>
              {apiData?.statsCharacter?.map((d: any, index: number) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <CardStatsCharacter key={index} data={d} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <ApexAreaChart heading={`Lead Generate`} tooltipText='Leads' />
          </Grid>
          <Grid item xs={12}>
            <ApexAreaChart heading={`Amount Spent`} tooltipText='Amount' />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </>
  )
}

export default DashboardAgent
