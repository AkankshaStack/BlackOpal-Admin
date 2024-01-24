import { Card, CardContent } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import BuyingGuideForm from 'src/views/components/buying-guide/BuyingGuideForm'
import Header from 'src/views/components/header'

const AddBuyingGuide = () => {
  const router = useRouter()

  return (
    <Card sx={{ p: 2 }}>
      <Header name={`#${router?.query?.id} |  Edit`} />
      <CardContent>
        <BuyingGuideForm isEditable />
      </CardContent>
    </Card>
  )
}

export default AddBuyingGuide
