import { FC, Fragment, useEffect } from 'react'
import { Box, IconButton, Typography, CircularProgress, Card } from '@mui/material'
import { useRouter } from 'next/router'
import { ArrowLeft } from 'mdi-material-ui'
import ProfileView from 'src/pages/components/profileView/ProfileView'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { fetchSingleTeamMember } from 'src/store/teammember'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ITeamMemberProfileProps {}

const TeamMemberProfile: FC<ITeamMemberProfileProps> = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const loader = useSelector((state: any) => state.teammember.loading)
  const store = useSelector((state: any) => state.teammember?.singleTeamMemberData)

  const { id } = router.query

  useEffect(() => {
    if (id) {
      dispatch(
        fetchSingleTeamMember({
          id: id,
          data: {
            include: 'company,userDetails,microMarketAddress'
          }
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Fragment>
      {loader ? (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card sx={{ p: 10 }}>
          <Fragment>
            <Box sx={{ mb: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  sx={{ mr: 2 }}
                  onClick={() => {
                    // @ts-ignore
                    if (Object.keys(router?.components)?.length === 2) {
                      router.push('/')

                      return
                    }
                    router.back()
                  }}
                >
                  <ArrowLeft color='primary' fontSize='large' />
                </IconButton>
                <Box display='flex' alignItems='flex-end'>
                  <Typography variant='h4' sx={{ fontSize: '1rem' }}>{`#${
                    store?.refNo !== null ? store?.refNo : 'TM0' + String(store?.id)
                  } | ${store?.userDetails?.firstName} ${store?.userDetails?.lastName}`}</Typography>
                </Box>
              </Box>
            </Box>
            <Box>
              <ProfileView />
            </Box>
          </Fragment>
        </Card>
      )}
    </Fragment>
  )
}

export default TeamMemberProfile
