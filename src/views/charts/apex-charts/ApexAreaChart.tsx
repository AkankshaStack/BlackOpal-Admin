// ** React Imports

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'


// ** Third Party Imports
import { ApexOptions } from 'apexcharts'
import Link from 'next/link'

// ** Icons Imports
import config from 'src/configs/config'

// ** Custom Components Imports
import { useAuth } from 'src/hooks/useAuth'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { Alert } from '@mui/material'

const areaColors = {
  series1: '#666666',
  series2: '#5b5b5b',
  series3: '#6A6E82'
}
interface props {
  heading?: string
  subHeading?: string
  tooltipText?: string
  data?: any
}

const ApexAreaChart = ({ heading, subHeading, tooltipText, data }: props) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // const today = new Date();
  // const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const options: ApexOptions = {
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 1.5,
      show: true,
      curve: 'smooth'
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    markers: {
      size: 0
    },
    colors: [areaColors.series1],
    xaxis: {
      // categories: [...Array(12).keys()]
      // type: "category",
      // range: 12,
      categories: monthNames
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100]
      }
    },
    tooltip: {
      shared: true,
      x: {
        show: false
      }
    }
  }



  const series = [
    {
      name: tooltipText,
      data: data
    }
  ]
  const auth = useAuth()

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <CardHeader
          title={heading}
          subheader={subHeading}
          titleTypographyProps={{ variant: 'h6' }}
          subheaderTypographyProps={{ variant: 'caption', sx: { color: 'text.disabled' } }}
          sx={{
            flexDirection: ['column', 'row'],
            alignItems: ['flex-start', 'center'],
            '& .MuiCardHeader-action': { mb: 0 },
            '& .MuiCardHeader-content': { mb: [2, 0] }
          }}
        />
        {/* <CardHeader title={'Data Showing from the last 30 days'} /> */}
      </div>
      <CardContent>
        {
          <div>
            <div style={{ height: 400, position: 'relative' }}>
              <ReactApexcharts
                options={options}
                series={series}
                type='area'
                height={400}
                style={{
                  filter:
                    auth.user?.verificationStatus === config.agents.verificationStatus.pending ||
                      auth.user?.verificationStatus === config.agents.verificationStatus.requested ||
                      auth.user?.verificationStatus === config.agents.verificationStatus.correctionRequired
                      ? 'blur(7px)'
                      : 'none',
                  pointerEvents:
                    auth.user?.verificationStatus === config.agents.verificationStatus.pending ||
                      auth.user?.verificationStatus === config.agents.verificationStatus.requested ||
                      auth.user?.verificationStatus === config.agents.verificationStatus.correctionRequired
                      ? 'none'
                      : 'auto'
                }}
              />

              {(auth.user?.verificationStatus === config.agents.verificationStatus.pending ||
                auth.user?.verificationStatus === config.agents.verificationStatus.requested ||
                auth.user?.verificationStatus === config.agents.verificationStatus.correctionRequired) && (
                  <>
                    {auth.user?.verificationStatus === config.agents.verificationStatus.requested ? (
                      <Alert severity='warning' className='my-alert'>
                        Your profile is currently under review.
                      </Alert>
                    ) : (
                      <>
                        {auth.user?.verificationStatus === config.agents.verificationStatus.correctionRequired ? (
                          <Alert
                            severity='error'
                            sx={{
                              padding: '10px',
                              position: 'absolute',
                              top: 0,
                              width: '70%',
                              left: 0,
                              right: 0,
                              margin: '0 auto'
                            }}
                          >
                            <p style={{ margin: 0 }}>
                              Your profile is requested for correction. Please update your profile in&nbsp;
                              <Link passHref href='/profile'>
                                My Profile.
                              </Link>
                            </p>
                            <p style={{ fontWeight: 500, marginBottom: 0, paddingBottom: 0 }}>Reason:</p>
                            <p style={{ marginTop: 0, paddingTop: 0 }}>{auth.user?.listingRemark}</p>
                          </Alert>
                        ) : (
                          <Alert severity='warning' className='my-alert'>
                            Your profile is incomplete. Complete it now under&nbsp;
                            <Link passHref href='/profile'>
                              My Profile
                            </Link>
                            &nbsp;to get access to all dashboard feature.
                          </Alert>
                        )}
                      </>
                    )}
                  </>
                )}
            </div>
          </div>
        }
      </CardContent>
    </Card>
  )
}

export default ApexAreaChart
