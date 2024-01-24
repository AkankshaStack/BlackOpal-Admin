import { Card, CardContent } from '@mui/material'
import React from 'react'
import BuyingGuideForm from 'src/views/components/buying-guide/BuyingGuideForm'
import Header from 'src/views/components/header'

const BuyingGuideAdd = () => {
  return (
    <div>
      <Card sx={{ p: 2 }}>
        <Header name='Add new buying guide' />
        <CardContent>
          <BuyingGuideForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default BuyingGuideAdd
