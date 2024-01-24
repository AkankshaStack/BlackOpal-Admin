// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports

// ** Types Imports
import { CardStats } from 'src/@core/components/card-statistics/types'

interface Props {
  data: CardStats
}

const CardStatsCharacter = ({ data }: Props) => {
  // ** Vars
  const { title, stats } = data

  return (
    <Card variant='outlined' sx={{ position: 'relative', mb: 5, height: '100%', backgroundImage: 'linear-gradient(to bottom right, #83aae9, #29bbe0)', border: 'none' }}>
      <CardContent sx={{ pb: '0 !important' }}>
        <Grid
          container
          justifyContent='end'
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
        >
          <Grid item xs={8} style={{alignSelf:'center'}}>
            <Typography variant='h3' sx={{ whiteSpace: 'nowrap', textAlign: 'center', width: '100%',justifyContent:'center' ,color:'#fff'}}>
              {stats}
            </Typography>
          </Grid>
          <Typography  sx={{ whiteSpace: 'nowrap', textAlign: 'center', width: '100%', color:'#fff'}}>{title}</Typography>
        </Grid>
      </CardContent>
    </Card>



  )
}

export default CardStatsCharacter

// CardStatsCharacter.defaultProps = {
//   trend: 'positive',
//   chipColor: 'primary'
// }
