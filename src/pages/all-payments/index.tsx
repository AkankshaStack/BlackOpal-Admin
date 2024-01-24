import { Card, CardContent, CardHeader } from '@mui/material'
import React from 'react'
import PaymentTable from 'src/views/components/payment-table/PaymentTable'

const AllPayments = () => {
  return (
    <Card>
      <CardHeader title='All Payments' />
      <CardContent>
        <PaymentTable />
      </CardContent>
    </Card>
  )
}

export default AllPayments
