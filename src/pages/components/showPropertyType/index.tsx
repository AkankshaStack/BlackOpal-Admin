import { Tooltip } from '@mui/material'
import Icon from '@mdi/react'
import { mdiLandPlots, mdiHomeOutline, mdiHomeFloor0, mdiHomeSilo, mdiDomain, mdiHome, mdiHomeCity } from '@mdi/js'
import config from 'src/configs/config'

const ShowPropertyType = (props: any) => {
  const { id } = props

  if (id === 1) {
    return (
      <Tooltip title={config?.properties?.propertyType?.[id]} arrow>
        <Icon path={mdiDomain} size={1} />
      </Tooltip>
    )
  } else if (id === 2) {
    return (
      <Tooltip title={config?.properties?.propertyType?.[id]} arrow>
        <Icon path={mdiHomeSilo} size={1} />
      </Tooltip>
    )
  } else if (id === 3) {
    return (
      <Tooltip title={config?.properties?.propertyType?.[id]} arrow>
        <Icon path={mdiHomeFloor0} size={1} />
      </Tooltip>
    )
  } else if (id === 4) {
    return (
      <Tooltip title={config?.properties?.propertyType?.[id]} arrow>
        <Icon path={mdiLandPlots} size={1} />
      </Tooltip>
    )
  } else if (id === 5) {
    return (
      <Tooltip title={config?.properties?.propertyType?.[id]} arrow>
        <Icon path={mdiHomeOutline} size={1} />
      </Tooltip>
    )
  } else if (id === 6) {
    return (
      <Tooltip title={config?.properties?.propertyType?.[id]} arrow>
        <Icon path={mdiHomeCity} size={1} />
      </Tooltip>
    )
  } else if (id === 7) {
    return (
      <Tooltip title={config?.properties?.propertyType?.[id]} arrow>
        <Icon path={mdiHome} size={1} />
      </Tooltip>
    )
  } else if (id === 8) {
    return (
      <Tooltip title={config?.properties?.propertyType?.[id]} arrow>
        <Icon path={mdiHomeCity} size={1} />
      </Tooltip>
    )
  } else if (id === 9) {
    return (
      <Tooltip title={config?.properties?.propertyType?.[id]} arrow>
        <Icon path={mdiHomeFloor0} size={1} />
      </Tooltip>
    )
  } else {
    return <></>
  }
}

export default ShowPropertyType
