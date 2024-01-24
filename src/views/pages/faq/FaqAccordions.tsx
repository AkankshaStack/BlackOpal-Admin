// ** MUI Imports
// import Button from '@mui/material/Button'
// import axios from 'axios'
/**
 * ! Icons Imports:
 * ! You need to import all the icons which come from the API or from your server and then add these icons in 'icons' variable.
 * ! If you need all the icons from the library, use "import * as Icon from 'mdi-material-ui'"
 * */
import ChevronDown from 'mdi-material-ui/ChevronDown'

// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
// ** Icons Imports
// import DeleteOutline from 'mdi-material-ui/DeleteOutline'
// ** Types
import { FaqQAndAType } from 'src/@fake-db/types'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { IconButton } from '@mui/material'
import { Delete, PencilOutline } from 'mdi-material-ui'

interface Props {
  data: FaqQAndAType[]
  setEditingKey: (id: number) => void
  setConfirm: (id: number) => void
}

const JHFaqAccordions = ({ data, setEditingKey, setConfirm }: Props) => {
  // ** States
  const [expandedFaq, setExpandedFaq] = useState<number | string | false>(false)

  const expanded = (panel: string) => {
    return expandedFaq === panel
  }

  // const [dialog, dialogOpen]=useState<boolean>(false);

  const handleChange = (panel: number | string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpandedFaq(isExpanded ? panel : false)
  }

  const renderAccordion = (item: FaqQAndAType, index: number) => {
    return (
      <div style={{ width: '100%' }}>
        <Accordion key={item.id} expanded={expanded(item.id)} onChange={handleChange(item.id)}>
          <AccordionSummary
            expandIcon={<ChevronDown />}
            id={`faq-accordion-${item.id}-header`}
            aria-controls={`faq-accordion-${item.id}-content`}
            sx={{
              '& .MuiAccordionSummary-content': {
                justifyContent: 'space-between'
              }
            }}
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Typography>{item.question}</Typography>
            <div>
              <IconButton onClick={() => setEditingKey(index)}>
                <PencilOutline />
              </IconButton>
              <IconButton onClick={() => setConfirm(index)}>
                <Delete />
              </IconButton>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
        {/* <Button sx={{ml:3, mr:0}} color="secondary" startIcon={<DeleteOutline/>} onClick={async () => { await axios.delete('/settings/faq', {
          params:{ id: obj.id}
        })}}>
      </Button> */}
        {/* </Grid> */}
      </div>
    )
  }

  const renderData = () => {
    if (data.length) {
      return (
        <>
          {data.length &&
            data?.map((item: FaqQAndAType, index) => {
              if (item) {
                return <Box sx={{ mt: 3 }}>{renderAccordion(item, index)}</Box>
              } else {
                return null
              }
            })}
        </>
      )
    } else {
      return null
    }
  }

  return renderData()
}

export default JHFaqAccordions
