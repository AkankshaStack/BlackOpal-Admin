import { Card, CardContent } from '@mui/material'
import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import Header from 'src/views/components/header'
import CollectionForm from 'src/views/components/collections/CollectionForm'

const PropertiesCollectionDetails = () => {
  const store = useSelector((state: RootState) => state.collections)

  return (
    <Card sx={{ p: 2 }}>
      <Fragment>
        {!store?.loading && <Header name={`#${store?.collectionData?.id} | ${store?.collectionData?.name}`} />}
        <CardContent>
          <CollectionForm isEditable />
        </CardContent>
      </Fragment>
    </Card>
  )
}

export default PropertiesCollectionDetails
