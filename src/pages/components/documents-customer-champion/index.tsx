/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { fetchData } from 'src/store/apps/user'
import Link from 'next/link'
import Image from 'next/image'

import { AccountOutline, ChartDonut, CogOutline, EyeOutline, Laptop, PencilOutline } from 'mdi-material-ui'
import { Grid, IconButton, Typography } from '@mui/material'
import { documentType } from 'src/utilities/conversions'
import { CloseImage, GetCustomerChampion, GetCustomerChampionData } from 'src/api'
import { useRouter } from 'next/router'
import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'
import moment from 'moment'
import { useAuth } from 'src/hooks/useAuth'

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
  const auth = useAuth()
console.log(auth,'-------------auth')
  const [CustomerChampion, setCustomerChampion] = useState<any>(documentData?.[0] || {})
  const [openPopup, setOpenPopup] = useState(false)

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

  // ** Hooks
  const CutomerChampion = async () => {
    const payload: any = {}
    payload.Id = router?.query.id
    try {
      // const response = await GetCustomerChampion(payload)
      const response = await GetCustomerChampionData(router.query.id)
      console.log(response?.data, 'my data')
      setCustomerChampion(response?.data[0])
    } catch (error) {}
  }

  console.log(router?.query.id, 'router?.query.id')

  useEffect(() => {
    CutomerChampion()
  }, [])

  const removeImage = async (id: any) => {
    console.log("removeImage=",id)
    const payload = {
      document_key: id
    }
    try {
      const response = await CloseImage(payload,router?.query.id)
      console.log(response, 'response from image' )
      if(response.code==200){
        CutomerChampion()
      }
    } catch (error) {}
  }

  // useEffect(() => {
  //   removeImage()
  // }, [])


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
              <p style={{ marginLeft: '7vw' }}>{`${CustomerChampion?.firstName || ''} ${
                CustomerChampion?.lastName || ''
              }`}</p>
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
              <p style={{ marginLeft: '7vw' }}>{CustomerChampion?.propertyId || ''}</p>
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
              <p style={{ marginLeft: '7vw' }}>{CustomerChampion?.meta?.unit_door_number || 0}</p>
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
              <p style={{ marginLeft: '7vw' }}>{CustomerChampion?.meta?.floor || 0}</p>
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
              <p style={{ marginLeft: '7vw' }}>{CustomerChampion?.configurationId}</p>
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
              <p style={{ marginLeft: '7vw' }}>
                {moment(CustomerChampion?.meta?.purchase_date).locale('en-in').format('D MMM YYYY')}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div style={{ borderRight: '1px solid #b5babadb', width: '30%', color: 'black', fontWeight: '600' }}>
              <p style={{ marginLeft: '2vh' }}>Document Uploaded</p>
            </div>

            <div style={{ margin: 'auto' }}>
              <a
                href={CustomerChampion?.meta?.document_certificate?.document_url || ''}
                target='_blank'
                rel='noreferrer'
              >
                <Image src={'/images/Preview eyes.svg'} alt='qwerty' height={30} width={30} />
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
              <p style={{ textAlign: 'center' }}>{CustomerChampion?.meta?.rating_meta?.buying_experience || 0}</p>
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
              <p style={{ textAlign: 'center' }}>{CustomerChampion?.meta?.rating_meta?.crm_support || 0}</p>
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
              <p style={{ textAlign: 'center' }}>{CustomerChampion?.meta?.rating_meta?.project_progress || 0}</p>
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
              <p style={{ textAlign: 'center' }}>{CustomerChampion?.meta?.rating_meta?.costruction_quality || 0}</p>
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
              <p style={{ textAlign: 'center' }}>
                {CustomerChampion?.meta?.rating_meta?.project_loc_neighourhood || 0}
              </p>
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
              <p style={{ textAlign: 'center' }}>{CustomerChampion?.meta?.rating_meta?.ammenities_spec || 0}</p>
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
              <p style={{ textAlign: 'center' }}>{CustomerChampion?.meta?.rating_meta?.value_for_money || 0}</p>
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
              <p style={{ textAlign: 'center' }}>{CustomerChampion?.averageRating || 0}</p>
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
          }}
        >
          <div style={{ position: 'absolute', bottom: -575, right: 210 }}>
            <Image src={'/images/Checkmark.svg'} alt='dbdd' height={30} width={30} />
          </div>

          <Image src={'/images/quotation.svg'} alt='qwerty' height={30} width={30} />

          <Typography>{CustomerChampion?.reviews || ''}</Typography>
        </div>

        <div>
          <Typography
            style={{ marginLeft: '54px', color: 'black', fontWeight: '600', paddingTop: '20px', marginTop: '5vh' }}
          >
            Media Info
          </Typography>

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {CustomerChampion?.meta?.document_media?.map((item: any, index: any) => {
              return (
                <div
                  key={index}
                  style={{
                    marginLeft: '30px',
                    marginTop: '10px',
                    display: 'flex',
                    borderRadius: '5px',
                    alignItems: 'center',
                    padding: '5px',
                    flexDirection: 'column'
                  }}
                >
                  <div
                    onClick={() => removeImage(item?.document_key)}
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      zIndex: 999,
                      marginLeft: '24vh',
                      marginBottom: '30px'
                    }}
                  >
                    <Image src={'/images/Cancel.svg'} alt='dbdd' height={30} width={30} />
                  </div>

                  <Image
                    id={index}
                    width={180}
                    alt={'item?.document_url'}
                    height={100}
                    style={{ borderRadius: '5px' }}
                    src={item?.document_url}
                    onClick={() =>
                      setOpen({
                        visible: true,
                        url: item?.document_url || ''
                      })
                    }
                  />
                </div>
              )
            })}
          </div>
        </div>

        <ImagePreview open={open} setOpen={setOpen} />
      </Grid>
    </>
  )
}

export default Documents
