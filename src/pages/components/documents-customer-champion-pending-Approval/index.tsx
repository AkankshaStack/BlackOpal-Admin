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
import { CloseImage, GetCustomerChampion, GetCustomerChampionData, UpdateCCStatus } from 'src/api'
import { useRouter } from 'next/router'
import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'
import moment from 'moment'
import toast from 'react-hot-toast'

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

function DocumentUpload(CustomerChampion: any) {
  switch (CustomerChampion) {
    case 1:
      return 'Copy of First 5 pages of Builder Buyer Agreement'
    case 2:
      return 'Copy of Demand Statement'
    case 3:
      return 'Copy of Account Statement'
    case 4:
      return 'Copy of Booking Receipt*(upload multiple if required)'
  }
}

const Documents = ({ documentData }: any) => {
  // ** State

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

  // console.log(documentData, 'documentData')

  const handleApproveClick = async () => {
    if (!router.query.id) return

    const payload = {
      id: Number(router.query.id),
      status: 2
    }

    try {
      const response = await UpdateCCStatus(payload)
      console.log(response?.data, 'my data')
      toast(response?.data?.message || 'Approved successfully')
      router.push('/customer-champion/pending-Approval')
    } catch (error) {}
  }

  const removeImage = async (id: any) => {
    console.log(id, '===========REMOVE-IMAGE========')
    const payload = {
      document_key: id
    }
    try {
      const response = await CloseImage(payload, router?.query.id)
      console.log(response, 'response from image')
      if (response.code == 200) {
        CutomerChampion()
      }
    } catch (error) {}
  }

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
                fontWeight: '500'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>Customer Name</p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              {/* <p style={{ marginLeft: '7vw' }}>{CustomerChampion?.firstName || ''}</p> */}
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
                fontWeight: '500'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>Project </p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ marginLeft: '7vw' }}>{CustomerChampion?.propertyId || 0}</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '500'
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
                fontWeight: '500'
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
                fontWeight: '500'
              }}
            >
              <p style={{ marginLeft: '2vh' }}>Configuration Area (sqft)</p>
            </div>

            <div style={{ borderBottom: '1px solid #b5babadb', width: '70%' }}>
              <p style={{ marginLeft: '7vw' }}>{CustomerChampion?.configurationId || 0}</p>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <div
              style={{
                borderBottom: '1px solid #b5babadb',
                borderRight: '1px solid #b5babadb',
                width: '30%',
                color: 'black',
                fontWeight: '500'
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
            <div style={{ borderRight: '1px solid #b5babadb', width: '30%', color: 'black', fontWeight: '500' }}>
              <p style={{ marginLeft: '2vh' }}>Document Uploaded</p>
            </div>

            <div style={{ marginLeft: '14vh', display: 'flex', alignItems: 'left' }}>
              <span style={{ marginLeft: '0.5rem' }}>
                {DocumentUpload(CustomerChampion?.meta?.document_certificate[0]?.document_type || 'Empty')}
              </span>

              {CustomerChampion?.meta?.document_certificate.map((item: any, index: any) => {
                console.log(item, '......Item')

                return (
                  <div key={index} style={{ marginLeft: '1rem' }}>
                    <a href={item?.document_url || ''} target='_blank' rel='noreferrer'>
                      <Image src={'/images/Preview eyes.svg'} alt='qwerty' height={30} width={30} />
                    </a>
                  </div>
                )
              })}
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
                fontWeight: '500'
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
                fontWeight: '500'
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
                fontWeight: '500'
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
                fontWeight: '500'
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
                fontWeight: '500'
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
                fontWeight: '500'
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
                fontWeight: '500'
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
                fontWeight: '500'
              }}
            >
              <p style={{ marginLeft: '2vh', fontWeight: '800' }}>Total</p>
            </div>

            <div style={{ width: '70%' }}>
              <p style={{ textAlign: 'center', fontWeight: '800', color: 'black' }}>
                {CustomerChampion?.averageRating}
              </p>
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

          <Typography>{CustomerChampion?.reviews}</Typography>
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
                    marginLeft: '38px',
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
                      marginBottom: '40px'
                    }}
                  >
                    <Image src={'/images/Cancel.svg'} alt='dbdd' height={30} width={30} />
                  </div>
                  <Image
                    id={index}
                    width={180}
                    alt={'image'}
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '25vh', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                border: '1px solid blue',
                padding: '15px',
                width: '180px',
                alignItems: 'center',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={handleApproveClick}
            >
              <Image src={'/images/Approve.svg'} alt='qwerty' height={20} width={20} onClick={handleApproveClick} />

              <Typography style={{ marginLeft: '10px', color: 'Blue', fontWeight: '600' }}>Approve</Typography>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                border: '1px solid green',
                padding: '15px',
                width: '180px',
                alignItems: 'center',
                borderRadius: '5px'
              }}
            >
              <Image src={'/images/raiseQueryButton.svg'} alt='qwerty' height={20} width={20} />

              <Typography style={{ marginLeft: '10px', color: 'green', fontWeight: '600' }}>
                <a
                  href='mailto:ashok.sharma@deepmindz.co'
                  style={{ textDecoration: 'none', color: 'green', fontWeight: '600' }}
                >
                  Raise Query
                </a>
              </Typography>
            </div>
          </div>
        </div>

        <ImagePreview open={open} setOpen={setOpen} />
      </Grid>
    </>
  )
}

export default Documents
