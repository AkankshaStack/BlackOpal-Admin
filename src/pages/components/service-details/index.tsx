import { Button, CardContent, CardHeader, Grid, Card, Divider } from '@mui/material'
import { Eye } from 'mdi-material-ui'
import { useSelector } from 'react-redux'
import { Fragment } from 'react'
import config from 'src/configs/config'

const ServiceDetails = () => {
  const store = useSelector((state: any) => state.user.singleData)

  return (
    <Fragment>
      {store?.reraCertificates?.length > 0 && (
        <>
          <h4 style={{ marginTop: 0 }}>RERA Details</h4>
          <Grid container sx={{ width: '100%', pr: { lg: 0, xs: 4 } }} spacing={6}>
            {store?.reraCertificates?.map((field: any, index: number) => {
              return (
                <Grid item xs={12} sm={6} key={index}>
                  <Card style={{ width: '100%', boxShadow: 'none', marginBottom: '20px' }} variant='outlined'>
                    <CardHeader
                      title={`RERA Number: ${field?.verificationNumber}`}
                      action={
                        <Button
                          onClick={() => window.open(field?.verificationCertificateUrl)}
                          startIcon={<Eye />}
                          variant='outlined'
                        >
                          View
                        </Button>
                      }
                    />
                    <Divider sx={{ m: 0 }} />
                    <CardContent sx={{ pt: 0 }}>
                      <p>State: {field?.state?.name}</p>

                      <p>District:{field?.district?.name}</p>

                      <p style={{ marginBottom: 0 }}>City: {field?.city?.name}</p>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </>
      )}
      {store?.gstCertificates?.length > 0 && store?.userDetails?.orgType === config.orgType.company && (
        <>
          <h4 style={{ marginTop: 0 }}>GST Details</h4>
          <Grid container sx={{ width: '100%', pr: { lg: 0, xs: 4 } }} spacing={6}>
            {store?.gstCertificates?.map((field: any, index: number) => {
              return (
                <Grid item xs={12} sm={6} key={index}>
                  <Card style={{ width: '100%', boxShadow: 'none', marginBottom: '20px' }} variant='outlined'>
                    <CardHeader
                      title={`GST Number: ${field?.verificationNumber}`}
                      action={
                        <Button
                          onClick={() => window.open(field?.verificationCertificateUrl)}
                          startIcon={<Eye />}
                          variant='outlined'
                        >
                          View
                        </Button>
                      }
                    />
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </>
      )}
      {store?.panCertificates?.length > 0 && store?.userDetails?.orgType !== config.orgType.company && (
        <>
          <h4 style={{ marginTop: 0 }}>PAN Details</h4>
          <Grid container sx={{ width: '100%', pr: { lg: 0, xs: 4 } }} spacing={6}>
            {store?.panCertificates?.map((field: any, index: number) => {
              return (
                <Grid item xs={12} sm={6} key={index}>
                  <Card style={{ width: '100%', boxShadow: 'none', marginBottom: '20px' }} variant='outlined'>
                    <CardHeader
                      title={`PAN Number: ${field?.verificationNumber}`}
                      action={
                        <Button
                          onClick={() => window.open(field?.verificationCertificateUrl)}
                          startIcon={<Eye />}
                          variant='outlined'
                        >
                          View
                        </Button>
                      }
                    />
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </>
      )}
    </Fragment>
  )
}
export default ServiceDetails
