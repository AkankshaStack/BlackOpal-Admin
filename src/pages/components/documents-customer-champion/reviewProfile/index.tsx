import { CircularProgress } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { useSelector } from 'react-redux'
import BusinessDetailsForm from '../../../components/locationCard/forms/businessDetails'
import CompanyDetailsForm from '../../../components/locationCard/forms/companyDetails'
import config from 'src/configs/config'

interface FormInputs {
  dob: DateType
  email: string
  radio: string
  status: string
  communicationAddress: string
  select: string
  lastName: string
  registeredAddress: string
  password: string
  textarea: string
  checkbox: boolean
  firstName: string
  years_in_business: number
  business_profile: string
  pan: string
  no_of_employee: number
  gst_number: string
  cin: string
  gst_registered_address: string
}

// interface CustomInputProps {
//   value: DateType
//   label: string
//   error: boolean
//   onChange: (event: ChangeEvent) => void
// }

const defaultValues = {
  dob: null,
  email: '',
  radio: '',
  select: '',
  lastName: '',
  password: '',
  textarea: '',
  firstName: '',
  status: '',
  communicationAddress: '',
  checkbox: false
}

const ReviewProfile = ({}) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const onSubmit = () => toast.success('Form Submitted')
  const store = useSelector((state: any) => state.user.singleData)

  return (
    <>
      {store.loading ? (
        <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {store?.userDetails?.orgType === config.orgType.company && (
            <CompanyDetailsForm control={control} errors={errors} />
          )}
          <BusinessDetailsForm control={control} errors={errors} />
        </form>
      )}
    </>
  )
}

export default ReviewProfile
