import { Stack, Typography, Tooltip, Box } from '@mui/material'
import moment from 'moment'
import { Fragment } from 'react'
import config from 'src/configs/config'

// CIN verification
const DocumentModal = ({ type, response }: { type: number; response: any }) => {
  const handleValuePrint = (data: any, isWrap = true) => {
    return (
      <Fragment>
        {data ? (
          isWrap ? (
            <Tooltip title={data} placement='bottom-start'>
              <Typography sx={{ fontWeight: 600, wordBreak: 'normal', mb: 2 }} variant='subtitle1'>
                {data}
              </Typography>
            </Tooltip>
          ) : (
            <Typography sx={{ fontWeight: 600, wordBreak: 'normal', mb: 2 }} variant='subtitle1'>
              {data}
            </Typography>
          )
        ) : (
          <Typography sx={{ fontWeight: 600, fontStyle: 'italic', mb: 2 }} variant='subtitle1'>
            Not Available
          </Typography>
        )}
      </Fragment>
    )
  }

  return (
    <>
      {!Object?.keys(response || {}).length ? (
        <Stack height='100%' alignItems='center' justifyContent='center'>
          No data found
        </Stack>
      ) : (
        <Fragment>
          {config?.certificates?.type?.gst === type ? (
            <Fragment>
              <Typography variant='body2'>Trader Name</Typography>
              {handleValuePrint(response?.tradeNam)}
              <Typography variant='body2' sx={{ mb: 2 }}>
                Contact Details
              </Typography>
              <Box sx={{ ml: 2 }}>
                <Typography variant='body2'>Name</Typography>
                {handleValuePrint(response?.contacted?.name)}
                <Typography variant='body2'>Email</Typography>
                {handleValuePrint(response?.contacted?.email)}
                <Typography variant='body2'>Mobile number</Typography>
                {handleValuePrint(response?.contacted?.mobNum)}
              </Box>
            </Fragment>
          ) : config?.certificates?.type?.pan === type ? (
            <Fragment>
              <Typography variant='body2'>Name</Typography>
              {handleValuePrint(response?.name)}
            </Fragment>
          ) : config?.certificates?.type?.aadhar === type ? (
            <Fragment>
              <Typography variant='body2'>Name</Typography>
              {handleValuePrint(response?.name)}
              <Typography variant='body2'>DOB</Typography>
              {handleValuePrint(response?.dob ? moment(response?.dob).format('DD MMM YYYY') : '')}
              <Typography variant='body2'>Gender</Typography>
              {handleValuePrint(response?.gender)}
              <Typography variant='body2'>Address</Typography>
              {handleValuePrint(
                response?.address?.splitAddress
                  ? `${response?.address?.splitAddress?.houseNumber || ''} ${
                      response?.address?.splitAddress?.street || ''
                    } ${response?.address?.splitAddress?.subdistrict || ''} ${
                      response?.address?.splitAddress?.district || ''
                    } ${response?.address?.splitAddress?.vtcName || ''} ${
                      response?.address?.splitAddress?.vtcName || ''
                    }`
                  : null
              )}
              <Typography variant='body2'>Pincode</Typography>
              {handleValuePrint(response?.address?.splitAddress?.pincode || '')}
              <Typography variant='body2'>State</Typography>
              {handleValuePrint(response?.address?.splitAddress?.state || '')}
              <Typography variant='body2'>Country</Typography>
              {handleValuePrint(response?.address?.splitAddress?.country || '')}
            </Fragment>
          ) : config?.certificates?.type?.cin === type ? (
            <Fragment>
              <Typography variant='body2'>Company Name</Typography>
              {handleValuePrint(response?.companyName)}
              <Typography variant='body2'>Company Type</Typography>
              {handleValuePrint(response?.classOfCompany)}
              <Typography variant='body2'>Company Status</Typography>
              {handleValuePrint(response?.companyStatus)}
              <Typography variant='body2'>Email</Typography>
              {handleValuePrint(response?.email)}
              <Typography variant='body2'>Registered Address</Typography>
              {handleValuePrint(response?.registeredAddress)}
            </Fragment>
          ) : null}
        </Fragment>
      )}
    </>
  )
}

export default DocumentModal
