import React, { useEffect } from 'react'
import { ContentState, EditorState, convertFromHTML } from 'draft-js'
import { useState } from 'react'
import RichTextEditor from '../components/RichTextEditor'
import { Grid, Box, CircularProgress } from '@mui/material'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import CardSnippet from 'src/@core/components/card-snippet'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { convertToHTML } from 'draft-convert'
import TabContext from '@mui/lab/TabContext'
import Tab from '@mui/material/Tab'

// ** Demo Components Imports

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { fetchprivacy, postprivacy } from 'src/store/settings/privacy-policy'

import { LoadingButton, TabList } from '@mui/lab'

const Privacypolicy = () => {
  const [value, setValue] = useState(EditorState.createEmpty())
  const [key, setKey] = useState<string>('pvpCustomer')
  const dispatch = useDispatch<AppDispatch>()

  // Need to ask kishan about this error
  const store = useSelector((state: any) => state.privacy)

  // /* TNC PArtner || TNC CUtomer */:- tncCustomer
  // /* TNC PArtner || TNC CUtomer */:- tncPartner
  // /* TNC PArtner || TNC CUtomer */:- pvpCustomer
  // /* TNC PArtner || TNC CUtomer */:- pvpPartner
  // // faq

  useEffect(() => {
    dispatch(
      fetchprivacy({
        key
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  useEffect(() => {
    if (store?.data?.length) {
      const blocksFromHTML = convertFromHTML(store.data)
      setValue(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap)
        )
      )
    }
  }, [store.data])

  const save = () => {
    dispatch(
      postprivacy({
        key,
        value: {
          text: convertToHTML(value.getCurrentContent())
        }
      })
    )
  }

  return (
    <React.Fragment>
      <EditorWrapper>
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={12}>
            <CardSnippet
              sx={{ overflow: 'visible' }}
              code={{
                tsx: null,
                jsx: null
              }}
              title='Privacy Policy'
            >
              <TabContext value={key}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList
                    onChange={(event: React.SyntheticEvent, newValue: string) => setKey(newValue)}
                    style={{ marginBottom: '40px' }}
                  >
                    <Tab label='Customer' value='pvpCustomer' />
                    <Tab label='Partner' value='pvpPartner' />
                    <Tab label='Team member' value='pvpTeamMember' />
                  </TabList>
                </Box>
              </TabContext>
              {store.loading ? (
                <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <RichTextEditor value={value} setValue={setValue} />
                  <LoadingButton
                    loading={store.loading}
                    variant='contained'
                    onClick={() => save()}
                    style={{ marginTop: '20px' }}
                  >
                    Save
                  </LoadingButton>
                </>
              )}
            </CardSnippet>
          </Grid>
        </Grid>
      </EditorWrapper>
    </React.Fragment>
  )
}
export default Privacypolicy
