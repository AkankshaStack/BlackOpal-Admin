/* eslint-disable jsx-a11y/alt-text */
import { Card } from '@mui/material'
import { useState } from 'react'

const Zoom = () => {
  const [zoom, setZoom] = useState<number>(1)

  // style={{ zoom: `${Number(zoom) >= 100 ? Number(zoom) - 100 : 100 - Number(zoom)}%` }}
  return (
    <>
      <input onChange={e => setZoom(Number(e.target.value))} />
      <button onClick={() => setZoom(prev => prev + 0.1)}>plus</button>
      <button onClick={() => setZoom(prev => prev - 0.1)}>minus</button>
      <Card
        style={{
          overflowX: 'scroll',
          overflowY: 'scroll',
          width: '100%',
          height: '100%',
          cursor: 'move',
          textAlign: 'center',
          marginTop: 'auto'
        }}
      >
        <div
          style={{
            backgroundImage: `url('https://media.geeksforgeeks.org/wp-content/cdn-uploads/20191108140642/zoom_property.png')`,
            backgroundSize: 'cover',
            width: '100%',
            height: '100%',
            transform: `scale(${zoom}))`
          }}
        ></div>
        <img style={{}} />
      </Card>
    </>
  )
}

export default Zoom
