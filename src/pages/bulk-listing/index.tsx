import { LoadingButton } from '@mui/lab'
import { Box, Card, CardContent, CardHeader, Grid } from '@mui/material'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { downloadSampleCSV, postBulkUpload } from 'src/store/apps/property'
import UploadCertificate from '../forms/Uploader'
import { download } from 'src/utilities/conversions'

const BulkUpload = () => {
  const [slug, setSlug] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()
  const { downloadLoading, bulkLoading, downloadMappingLoading } = useSelector((state: RootState) => state.property)

  return (
    <Card>
      <CardHeader title='Bulk Listing' />
      <CardContent sx={{ p: 8 }}>
        <Grid container>
          <Grid item xs={12} sm={12} lg={4} xl={4}>
            <UploadCertificate
              buttonText='Bulk upload property'
              path='properties/bulkUploads'
              maxImage={1}
              setValue={setSlug}
              reset={Boolean(slug?.length === 0)}
              accept={{
                'application/csv': ['.csv']
              }}
            />
          </Grid>
        </Grid>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}
        >
          <LoadingButton
            loading={downloadLoading}
            variant='outlined'
            style={{ marginTop: '20px', textTransform: 'initial' }}
            onClick={() => {
              dispatch(
                downloadSampleCSV({
                  key: 'properties-bulk-import-sample'
                })
              ).then(res => {
                if (res?.payload?.code === 200) {
                  download(res?.payload?.data?.value?.text, 'Sample CSV')
                } else {
                  toast.error('Some Error Occured, Please try again after some time')
                }
              })
            }}
          >
            Download sample csv
          </LoadingButton>
          <LoadingButton
            loading={downloadMappingLoading}
            variant='outlined'
            style={{ marginTop: '20px', textTransform: 'initial', marginLeft: '20px' }}
            onClick={() => {
              dispatch(
                downloadSampleCSV({
                  key: 'properties-bulk-import-mapping'
                })
              ).then(res => {
                if (res?.payload?.code === 200) {
                  download(res?.payload?.data?.value?.text, 'Sample CSV')
                } else {
                  toast.error('Some Error Occured, Please try again after some time')
                }
              })
            }}
          >
            Download mapping
          </LoadingButton>
          <LoadingButton
            loading={bulkLoading}
            variant='contained'
            disabled={slug?.length === 0}
            style={{ marginTop: '20px', marginLeft: '20px', textTransform: 'initial' }}
            onClick={() => {
              if (slug?.length === 0) {
                toast.error('Please upload csv')

                return
              }
              dispatch(
                postBulkUpload({
                  key: slug
                })
              ).then(res => {
                if (res?.payload?.code === 200) {
                  toast.success(res?.payload?.message)
                  setSlug('')
                } else {
                  toast.error('Some Error Occured, Please try again after some time')
                }
              })
            }}
          >
            Submit
          </LoadingButton>
        </Box>
      </CardContent>
    </Card>
  )
}

export default BulkUpload
