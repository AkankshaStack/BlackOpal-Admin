import { Collapse, Typography, Box } from '@mui/material'
import { CheckCircle } from 'mdi-material-ui'
import { useState, Fragment, useCallback, ReactNode } from 'react'

const RenderFeatures = ({
  data,
  children,
  collapseHeight = 200,
  heightAuto
}: {
  data: any
  children?: ReactNode
  collapseHeight?: number
  heightAuto?: boolean
}) => {
  const [checked, setChecked] = useState(false)
  const [show1, setShow1] = useState(false)

  const handleChange = () => {
    setChecked(prev => !prev)
  }
  const getHeight = useCallback((node: HTMLDivElement) => {
    if (node && node?.clientHeight > collapseHeight && !show1) {
      setShow1(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Fragment>
      <Collapse
        in={checked}
        collapsedSize={collapseHeight}
        sx={
          heightAuto
            ? {
                height: show1 ? undefined : 'auto !important',
                minHeight: show1 ? collapseHeight : 'auto !important'
              }
            : undefined
        }
      >
        <div ref={getHeight}>
          {children
            ? children
            : Object.values(data?.meta)?.map((item: any, index: number) => {
                if (item.value) {
                  return (
                    <Box sx={{ display: 'flex', mt: 1.5, mb: 1.5 }} key={index}>
                      <CheckCircle sx={{ mr: 2.5, fontSize: '1.05rem' }} color='primary' />
                      <Typography variant='body2'>{item.desc}</Typography>
                    </Box>
                  )
                }
              })}
        </div>
      </Collapse>

      <Typography
        variant='button'
        onClick={() => {
          handleChange()
        }}
        sx={{ textTransform: 'initial', float: 'right', color: 'primary.main', cursor: 'pointer', minHeight: 25 }}
      >
        {show1 ? (!checked ? 'Show More' : 'Show Less') : null}
      </Typography>
    </Fragment>
  )
}

export default RenderFeatures
