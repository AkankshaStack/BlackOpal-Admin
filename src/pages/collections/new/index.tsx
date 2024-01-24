import { Card, CardContent } from '@mui/material'

import React from 'react'
import CollectionForm from 'src/views/components/collections/CollectionForm'
import Header from 'src/views/components/header'

const PropertiesCollectionAdd = () => {
  return (
    <div>
      <Card sx={{ p: 2 }}>
        <Header name='Add New Collection' />
        <CardContent>
          <CollectionForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default PropertiesCollectionAdd
