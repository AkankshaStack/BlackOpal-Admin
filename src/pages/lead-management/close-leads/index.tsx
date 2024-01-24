import React, { FC } from 'react'
import LeadsClosed from 'src/views/components/leads/LeadsClosed'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IClosedLeads {}

const ClosedLeads: FC<IClosedLeads> = () => {
  return (
    <>
      <LeadsClosed />
    </>
  )
}

export default ClosedLeads
