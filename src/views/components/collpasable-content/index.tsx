import { Typography, Grid, Rating, Box } from '@mui/material'
import { Fragment } from 'react'
import CustomChip from 'src/@core/components/mui/chip'

interface collpasableProps {
  data: any[]
  averageRating: number
}

const CollapsableContent = ({ data, averageRating }: collpasableProps) => {
  return (
    <Fragment>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: '10px', columnGap: '10px' }}>
        <Typography variant='body2' noWrap>
          Average Rating
        </Typography>
        {averageRating !== null || averageRating !== undefined ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Rating name='half-rating-read' defaultValue={averageRating} readOnly precision={0.1} />
            {averageRating ? `(${1 * parseFloat(averageRating.toFixed(1))})` : ''}
          </div>
        ) : null}
      </Box>
      <Grid container spacing={4} sx={{ pt: 4 }}>
        {data.map((val: any, index: number) => {
          if (!Array.isArray(val?.displayValue)) {
            return (
              <Grid item xs={12} md={3} sm={12} key={`${val?.displayValue}${index}`}>
                <Typography variant='body2' noWrap>
                  {val?.label}
                </Typography>
                <Typography sx={{ fontWeight: 600, wordBreak: 'normal' }} variant='subtitle1' noWrap>
                  {val?.displayValue || '-'}
                </Typography>
                {val?.rating !== null || val?.rating !== undefined ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Rating name='half-rating-read' defaultValue={val?.rating} readOnly precision={0.1} />
                    {val?.rating ? `(${1 * parseFloat(val?.rating.toFixed(1))})` : ''}
                  </div>
                ) : null}
              </Grid>
            )
          } else {
            return (
              <Grid item xs={12} md={3} sm={12} key={`${val?.label}${index}`}>
                <Typography variant='body2' noWrap>
                  {val?.label}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {val?.displayValue?.length > 0
                    ? val?.displayValue?.map((val1: any, index: number) => (
                        <CustomChip
                          size='small'
                          key={`${val1}${index}`}
                          skin='light'
                          color={val?.chipColor}
                          label={val1 || ''}
                          sx={{
                            '& .MuiChip-label': { textTransform: 'capitalize' },
                            '&:not(:last-of-type)': { mr: 3 }
                          }}
                        />
                      ))
                    : '-'}
                </Box>
                {val?.rating !== null || val?.rating !== undefined ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }} component='div'>
                    <Rating name='half-rating-read' defaultValue={val?.rating} readOnly precision={0.1} />
                    {val?.rating ? `(${1 * parseFloat(val?.rating.toFixed(1))})` : ''}
                  </Box>
                ) : null}
              </Grid>
            )
          }
        })}
      </Grid>
    </Fragment>
  )
}

export default CollapsableContent
