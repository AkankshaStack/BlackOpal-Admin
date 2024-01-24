// ** Types Import
import { Settings } from 'src/@core/context/settingsContext'
import { NavLink, NavGroup, NavSectionTitle, VerticalNavItemsType } from 'src/@core/layouts/types'

// ** Custom Menu Components
import VerticalNavLink from './VerticalNavLink'
import VerticalNavGroup from './VerticalNavGroup'
import VerticalNavSectionTitle from './VerticalNavSectionTitle'
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  parent?: NavGroup
  navHover?: boolean
  settings: Settings
  navVisible?: boolean
  groupActive: string[]
  isSubToSub?: NavGroup
  currentActiveGroup: string[]
  navigationBorderWidth: number
  verticalNavItems?: VerticalNavItemsType
  saveSettings: (values: Settings) => void
  setGroupActive: (value: string[]) => void
  setCurrentActiveGroup: (item: string[]) => void
}

const resolveNavItemComponent = (item: NavGroup | NavLink | NavSectionTitle) => {
  if ((item as NavSectionTitle).sectionTitle) return VerticalNavSectionTitle
  if ((item as NavGroup).children) return VerticalNavGroup

  return VerticalNavLink
}

const VerticalNavItems = (props: Props) => {
  // ** Props
  const { verticalNavItems } = props
  const auth = useAuth()

  const roleExists = (name: string) => {
    if (auth.user) {
      return auth?.user?.roles?.some((el: any) => {
        return el.name === name
      })
    }

    return true
  }

  const RenderMenuItems = verticalNavItems?.map((item: NavGroup | NavLink | NavSectionTitle, index: number) => {
    if (item?.role && roleExists(item?.role)) {
      const TagName: any = resolveNavItemComponent(item)

      return <TagName {...props} key={index} item={item} />
    } else if (!item?.role) {
      const TagName: any = resolveNavItemComponent(item)

      return <TagName {...props} key={index} item={item} />
    }
  })

  return <>{RenderMenuItems}</>
}

export default VerticalNavItems
