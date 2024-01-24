import { Typography, Grid, Box, Tooltip } from '@mui/material'
import { Fragment } from 'react'

interface collpasableProps {
  val: any
}

const RatingAlert = ({ val }: collpasableProps) => {
  return (
    <Fragment>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: '10px', columnGap: '10px' }}>
        <Typography variant='body2' noWrap sx={{ fontWeight: 'bold' }}>
          Average Rating:
        </Typography>
        {val?.averageRating !== null || val?.averageRating !== undefined ? (
          <Typography variant='body2' noWrap sx={{ fontWeight: 'bold' }}>
            {val?.averageRating ? `${1 * parseFloat(val?.averageRating)}` : ''}
          </Typography>
        ) : null}
      </Box>
      {Object.keys(val?.meta?.alertsCount).map(val1 => (
        <Grid container spacing={4} sx={{ pt: 4 }} key={val}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <h4 style={{ margin: 0, alignSelf: 'flex-start', textTransform: 'capitalize' }}> {val1}</h4>
              <h4 style={{ margin: 0, alignSelf: 'flex-start', textTransform: 'capitalize' }}>
                {`(${val?.meta?.alertsCount[val1] || 0})`}
              </h4>
            </Box>
          </Grid>
          {val?.data?.map((ratingData: any) => {
            if (ratingData?.severity === val1) {
              return (
                <Grid item xs={12} md={3} sm={12} key={ratingData?.label}>
                  <Tooltip title={ratingData?.label}>
                    <Typography variant='body2' noWrap>
                      {ratingData?.label}
                    </Typography>
                  </Tooltip>
                  <Tooltip title={ratingData?.displayValue || '-'}>
                    <Typography sx={{ fontWeight: 600, wordBreak: 'normal' }} variant='subtitle1' noWrap>
                      {ratingData?.displayValue || '-'}
                    </Typography>
                  </Tooltip>
                </Grid>
              )
            }
          })}
        </Grid>
      ))}
    </Fragment>
  )
}

export default RatingAlert
