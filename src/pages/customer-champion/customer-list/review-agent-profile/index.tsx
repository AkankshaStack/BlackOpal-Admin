/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { fetchData } from 'src/store/apps/user'

import Image from 'next/image'

import { AccountOutline, ChartDonut, CogOutline, EyeOutline, Laptop, PencilOutline } from 'mdi-material-ui'
import { Grid, Typography } from '@mui/material'
import { documentType } from 'src/utilities/conversions'
import { GetCustomerChampion } from 'src/api'
import { useRouter } from 'next/router'
import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'

interface UserRoleType {
  [key: string]: ReactElement
}

// ** Vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userRoleObj: UserRoleType = {
  admin: <Laptop sx={{ mr: 2, color: 'error.main' }} />,
  author: <CogOutline sx={{ mr: 2, color: 'warning.main' }} />,
  editor: <PencilOutline sx={{ mr: 2, color: 'info.main' }} />,
  maintainer: <ChartDonut sx={{ mr: 2, color: 'success.main' }} />,
  subscriber: <AccountOutline sx={{ mr: 2, color: 'primary.main' }} />
}

interface CellType {
  row: any
}

const Documents = ({ documentData }: any) => {
  // ** State
  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [CustomerChampion, setCustomerChampion] = useState<any>({})
  const [openPopup, setOpenPopup] = useState(false)
  const [images, setImages] = useState([])

  const router = useRouter()
  const [show, setShow] = useState<{
    type: number
    response: any
  }>({
    type: 0,
    response: {}
  })

  const [open, setOpen] = useState<imagePreview>({
    visible: false,
    url: ''
  })

  const removeImage = (index: any) => {
    console.log(index, 'index')

    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)
    console.log(images, 'setImage')
  }

  console.log(images, 'setImage')
  console.log(router, 'router')

  // ** Hooks

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(
      fetchData({
        role,
        status,
        q: value,
        currentPlan: plan
      })
    )
  }, [dispatch, plan, role, status, value])

  const CutomerChampion = async () => {
    const payload: any = {}
    payload.Id = router?.query.id
    try {
      const response = await GetCustomerChampion(payload)
      setCustomerChampion(response?.data)
      setImages(response?.data?.meta?.document_media)
      console.log(response?.data, '===========response data')
    } catch (error) {}
  }

  console.log(router?.query.id, 'router?.query.id')

  useEffect(() => {
    CutomerChampion()
  }, [])

  console.log(CustomerChampion, 'CustomerChampion')

  return (
    <>
      <Grid item xs={12}>
        <Typography
          style={{
            fontWeight: '700',
            fontSize: '2rem',
            paddingLeft: 'vh',
            color: 'black',
            paddingTop: '2vh',
            marginLeft: '2vh'
          }}
        >
          Application Details
        </Typography>
        <Typography style={{ marginLeft: '54px', color: 'black', fontWeight: '700', paddingTop: '20px' }}>
          Customer Champion Info
        </Typography>

        <div
          style={{
            border: '1px solid #b5babadb',
            borderRadius: '10px',
            width: '80%',
            marginLeft: '50px',
            marginTop: '2vh',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '600'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>Customer Name</p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ marginLeft: '7vw' }}>{CustomerChampion?.customerName}</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '600'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>Project </p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ marginLeft: '7vw' }}>{CustomerChampion?.project_id}</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '600'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>Unit No.</p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ marginLeft: '7vw' }}>{CustomerChampion?.meta?.unit_door_number}</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '600'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>Floor No.</p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ marginLeft: '7vw' }}>{CustomerChampion?.meta?.floor}</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '600'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>Configuration Area (sqft)</p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ marginLeft: '7vw' }}>{CustomerChampion?.configuration_id}</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '600'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>Date of purchase</p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ marginLeft: '7vw' }}>{CustomerChampion?.meta?.purchase_date}</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div style={{ borderRight: '1px solid #b5babadb', width: '30%', color: 'black', fontWeight: '600' }}>
              <p style={{ marginLeft: '2vh' }}>Document Uploaded</p>
            </div>

            <div
              style={{
                width: '70%',
                border: '1px solid ',
                alignSelf: 'center',
                marginRight: '10px',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <a
                href={CustomerChampion?.meta?.document_certificate[0]?.document_url || ''}
                target='_blank'
                rel='noreferrer'
              >
                <Image
                  src={'/images/Preview eyes.svg'}
                  style={{ borderRadius: '5px' }}
                  alt='qwerty'
                  height={30}
                  width={30}
                />
              </a>
            </div>
          </div>
        </div>

        <Typography
          style={{ marginLeft: '54px', color: 'black', fontWeight: '700', paddingTop: '20px', marginTop: '5vh' }}
        >
          Review Info
        </Typography>

        <div
          style={{
            border: '1px solid #b5babadb',
            borderRadius: '10px',
            width: '80%',
            marginLeft: '50px',
            marginTop: '2vh',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '600'
              }}
            >
              <p style={{ marginLeft: '2vh', fontWeight: '800' }}>Parameter</p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ textAlign: 'center', fontWeight: '800', color: 'black' }}>Rating</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '600'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>Buying Experience</p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ textAlign: 'center' }}>{CustomerChampion?.rating_meta?.buying_experience}</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '600'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>CRM Support</p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ textAlign: 'center' }}>{CustomerChampion?.rating_meta?.crm_support}</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '600'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>Project Progress </p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ textAlign: 'center' }}>{CustomerChampion?.rating_meta?.project_progress}</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '600'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>Construction Quality</p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ textAlign: 'center' }}>{CustomerChampion?.rating_meta?.costruction_quality}</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '600'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>Project Location & Neighbourhood</p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ textAlign: 'center' }}>{CustomerChampion?.rating_meta?.project_loc_neighourhood}</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '600'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>Amenities and specifications</p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ textAlign: 'center' }}>{CustomerChampion?.rating_meta?.ammenities_spec}</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '600'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>Value for Money</p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ textAlign: 'center' }}>{CustomerChampion?.rating_meta?.value_for_money}</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '600'
              }}
            >
              <p style={{ marginLeft: '2vh', fontWeight: '800' }}>Total</p>
            </div>

            <div style={{ width: '70%' }}>
              <p style={{ textAlign: 'center' }}>{CustomerChampion?.average_rating}</p>
            </div>
          </div>
        </div>

        <div
          style={{
            border: '1px solid #b5babadb',
            borderRadius: '5px',
            width: '80%',
            marginLeft: '50px',
            marginTop: '6vh',
            padding: '20px'

            // boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)"
          }}
        >
          <div style={{ position: 'absolute', bottom: -585, right: 210 }}>
            <Image src={'/images/Checkmark.svg'} alt='dbdd' height={30} width={30} />
          </div>

          <Image src={'/images/quotation.svg'} alt='qwerty' height={30} width={30} />
          {/* <Typography>
            Prominent shopping malls, movie theatres, school, and hospitals are present in proximity of this residential
            project. The project has been finely constructed and the interior space is spacious. One of the best
            projects I have ever seen with excellent service and maintenance.
          </Typography> */}
          <Typography>{CustomerChampion?.review}</Typography>
        </div>

        <div>
          <Typography
            style={{ marginLeft: '54px', color: 'black', fontWeight: '600', paddingTop: '20px', marginTop: '5vh' }}
          >
            Media Info
          </Typography>

          <div>
            {CustomerChampion?.meta?.document_media?.map((item: any, index: any) => {
              return (
                <div
                  key={index}
                  style={{
                    marginLeft: '7vh',
                    marginTop: '10px',
                    display: 'flex',
                    borderRadius: '5px',
                    padding: '5px'
                  }}
                >
                  <div style={{ position: 'absolute', zIndex: 999, right: '970px', bottom: '-786px' }}>
                    <Image
                      src={'/images/Cancel.svg'}
                      alt='dbdd'
                      height={30}
                      width={30}
                      onClick={() => removeImage(index)}
                    />
                  </div>
                  <Image
                    id={index}
                    width={200}
                    alt={item.document_url}
                    height={200}
                    style={{ borderRadius: '10px' }}
                    src={item.document_url}
                    onClick={() =>
                      setOpen({
                        visible: true,
                        url: item.document_url
                      })
                    }
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* <Dialog
          fullWidth
          open={Boolean(show?.type)}
          maxWidth='xs'
          scroll='body'
          onClose={() => {
            setShow({
              type: 0,
              response: {}
            })
          }}
        >
          <DialogTitle sx={{ m: 0, p: 4 }}>
            Karza API Response
            <IconButton
              aria-label='close'
              onClick={() =>
                setShow({
                  type: 0,
                  response: {}
                })
              }
              sx={{
                position: 'absolute',
                right: 8,
                top: 8

                // color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseCircleOutline />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ padding: '1rem', background: 'white', width: '100%' }}>
              <DocumentModal type={show?.type} response={show?.response} />
            </Box>
          </DialogContent>
        </Dialog> */}

        {/* <ImageModal isOpen={openPopup} onClose={closePopup}  /> */}
        
        <ImagePreview open={open} setOpen={setOpen} />
      </Grid>
    </>
  )
}

export default Documents
