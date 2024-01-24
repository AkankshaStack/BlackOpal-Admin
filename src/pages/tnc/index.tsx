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
import { fetchtnc, posttnc } from 'src/store/settings/tnc'
import TabContext from '@mui/lab/TabContext'
import Tab from '@mui/material/Tab'
import { LoadingButton, TabList } from '@mui/lab'

// ** Demo Components Imports

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const Tnc = () => {
  const [value, setValue] = useState(EditorState.createEmpty())
  const [key, setKey] = useState<string>('tncCustomer')
  const dispatch = useDispatch<AppDispatch>()

  // Need to ask kishan about this error
  const store = useSelector((state: any) => state.tnc)

  useEffect(() => {
    dispatch(
      fetchtnc({
        key
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  useEffect(() => {
    if (store.data?.length) {
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
      posttnc({
        key,
        value: {
          text: convertToHTML(value.getCurrentContent())
        }
      })
    )
  }

  return (
    <EditorWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
          <CardSnippet
            sx={{ overflow: 'visible' }}
            title='Terms & Conditions'
            code={{
              tsx: null,
              jsx: null
            }}
          >
            <TabContext value={key}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={(event: React.SyntheticEvent, newValue: string) => setKey(newValue)}
                  style={{ marginBottom: '40px' }}
                >
                  <Tab label='Customer' value='tncCustomer' />
                  <Tab label='Partner' value='tncPartner' />
                  <Tab label='Team member' value='tncTeamMember' />
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
  )
}
export default Tnc
