// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Grid } from '@mui/material'

const CardUser = () => {
  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Box sx={{ mb: 4.5 }}>
          <div className='my-slider'>
            <Box
              component='img'
              src='/images/cards/accounting-logo.png'
              alt='dffr'
              sx={{ mr: 5, width: 84, borderRadius: 84 }}
            />
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ fontWeight: 600 }}>Shivam Singh</Typography>
              <Typography variant='caption'>Gurgaon, Haryana</Typography>
              <Grid container spacing={2.5} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant='subtitle2'>RERA Certificate Number</Typography>
                  <Typography variant='caption'>1234567890</Typography>
                </Grid>
              </Grid>
            </Box>
          </div>
        </Box>
        <Button variant='outlined' size='medium' style={{ width: '90%' }}>
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}

export default CardUser
