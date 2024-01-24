import styled from '@emotion/styled'
import { tooltipClasses, Typography, TooltipProps, Tooltip, Box } from '@mui/material'
import { CurrencyInr, Close } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
import config from 'src/configs/config'
import { ruppeeCommaConversation, ruppeeConversation } from 'src/utilities/conversions'

const CustomTransactionTooltip = ({ row, children, setopenDrawer }: any) => {
  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} arrow placement='top' enterTouchDelay={0} />
  ))(({}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#ececec',
      minWidth: '250px',
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: 11
    }
  }))
  const router = useRouter()

  return (
    <LightTooltip
      title={
        <Fragment>
          {row?.transactionFor !==
          Number(
            Object.keys(config?.transactions?.transactionFor).find(
              key => config?.transactions?.transactionFor[key] === 'Order'
            )
          ) ? (
            <>
              <Box sx={{ display: 'flex' }}>
                <div style={{ display: 'flex', width: '70%' }}>
                  <Typography sx={{ float: 'left' }}>
                    <span>
                      {config?.transactions?.type?.credit === row?.type &&
                      row?.transactionFor ===
                        Number(
                          Object.keys(config?.transactions?.transactionFor).find(
                            val1 => config?.transactions?.transactionFor[val1] === 'Refund'
                          )
                        )
                        ? `Cashback for refund`
                        : `${config?.transactions?.transactionFor[row?.transactionFor]} amount`}
                    </span>
                  </Typography>
                </div>
                <div style={{ width: '30%', float: 'left' }}>
                  <Typography
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <span>
                      <CurrencyInr sx={{ fontSize: '1rem', mt: '5px' }} />
                    </span>
                    <span style={{ fontSize: '14px' }}>{ruppeeCommaConversation(row?.amountInPaisa || 0, 0)}</span>
                  </Typography>
                </div>
              </Box>
              {row?.transactionFor ===
                Number(
                  Object.keys(config?.transactions?.transactionFor).find(
                    val1 => config?.transactions?.transactionFor[val1] === 'Refund'
                  )
                ) && row?.cancelReason?.length ? (
                <Fragment>
                  <Typography
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    Cancel reason:
                  </Typography>
                  <Typography
                    variant='subtitle2'
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {row?.cancelReason}
                  </Typography>
                </Fragment>
              ) : null}
              {row?.transactionFor ===
              Number(
                Object.keys(config?.transactions?.transactionFor).find(
                  val1 => config?.transactions?.transactionFor[val1] === 'Recharge'
                )
              ) ? (
                <Box sx={{ display: 'flex' }}>
                  <div style={{ display: 'flex', width: '70%' }}>
                    <Typography sx={{ float: 'left' }}>
                      <span style={{ textTransform: 'capitalize' }}>Tax</span>
                    </Typography>
                  </div>
                  <div style={{ width: '30%', float: 'left' }}>
                    <Typography
                      sx={{
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <span>
                        <CurrencyInr sx={{ fontSize: '1rem', mt: '5px' }} />
                      </span>
                      <span style={{ fontSize: '14px' }}>
                        {ruppeeCommaConversation(row?.order?.taxInPaisa || 0, 0)}
                      </span>
                    </Typography>
                  </div>
                </Box>
              ) : null}
              {row?.transactionFor ===
              Number(
                Object.keys(config?.subscriptions?.transactions?.transactionFor).find(
                  val1 => config?.subscriptions?.transactions?.transactionFor[val1] === 'Project'
                )
              ) ? (
                <Box sx={{ display: 'flex' }}>
                  <div style={{ display: 'flex', width: '60%' }}>
                    <Typography sx={{ float: 'left' }}>
                      <span style={{ textTransform: 'capitalize' }}>Project Name</span>
                    </Typography>
                  </div>
                  <div style={{ width: '40%', float: 'left' }}>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setopenDrawer({
                          visible: true,
                          id: row?.property?.id
                        })
                      }}
                      noWrap
                    >
                      {row?.property?.name?.length ? `${row?.property?.name}` : ''}
                    </Typography>
                  </div>
                </Box>
              ) : null}
              {row?.transactionFor ===
              Number(
                Object.keys(config?.subscriptions?.transactions?.transactionFor).find(
                  val1 => config?.subscriptions?.transactions?.transactionFor[val1] === 'Team Member'
                )
              ) ? (
                <Box sx={{ display: 'flex' }}>
                  <div style={{ display: 'flex', width: '60%' }}>
                    <Typography sx={{ float: 'left' }}>
                      <span style={{ textTransform: 'capitalize' }}>TM Name</span>
                    </Typography>
                  </div>
                  <div style={{ width: '40%', float: 'left' }}>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        router.push({
                          pathname: '/team-members/profile/[:id]'.replace('[:id]', row?.teamMemberDetails?.agentId),
                          query: { isFreelancer: router?.query?.freelancer }
                        })
                      }}
                      noWrap
                    >
                      {row?.teamMemberDetails?.firstName
                        ? `${row?.teamMemberDetails?.firstName} ${row?.teamMemberDetails?.lastName}`
                        : ''}
                    </Typography>
                  </div>
                </Box>
              ) : null}
            </>
          ) : (
            row?.order?.orderItems?.map((val: any) => (
              <Fragment key={val?.id}>
                {val?.entityType === 1 ? (
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ textTransform: 'capitalize', fontSize: '.9rem' }}>{val?.OrderBreakup?.name}</h3>
                    <Box
                      style={{
                        fontSize: '14px',
                        display: 'flex'
                      }}
                    >
                      <div style={{ width: '70%' }}>
                        <Typography
                          style={{
                            fontSize: '14px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center'
                          }}
                        >
                          <span style={{ textTransform: 'capitalize', fontSize: '14px' }}>{`Amount`}</span>
                        </Typography>
                      </div>
                      <div style={{ width: '30%' }}>
                        <Typography
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            float: 'left'
                          }}
                        >
                          <span>
                            <CurrencyInr sx={{ fontSize: '1rem', mt: '5px' }} />
                          </span>
                          <span style={{ fontSize: '14px' }}>{ruppeeConversation(val?.amountInPaisa, 0)}</span>
                        </Typography>
                      </div>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      <div style={{ display: 'flex', width: '70%' }}>
                        <Typography sx={{ float: 'left', fontSize: '14px' }}>
                          <span style={{ textTransform: 'initial' }}>Previous plan amount(left days)</span>
                        </Typography>
                      </div>
                      <div style={{ width: '30%', float: 'left' }}>
                        <Typography
                          sx={{
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <span>
                            <CurrencyInr sx={{ fontSize: '1rem', mt: '5px' }} />
                          </span>
                          <span style={{ fontSize: '14px' }}>
                            {ruppeeConversation(Math.abs(row?.order?.finalAmountInPaisa - val?.amountInPaisa), 0)}
                          </span>
                        </Typography>
                      </div>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ textTransform: 'capitalize', fontSize: '.9rem' }}>{val?.OrderBreakup?.name}</h3>
                    <Box
                      style={{
                        fontSize: '14px',
                        display: 'flex'
                      }}
                    >
                      <div style={{ width: '70%' }}>
                        <Typography
                          style={{
                            fontSize: '14px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center'
                          }}
                        >
                          <span style={{ textTransform: 'capitalize', fontSize: '14px' }}>{`Amount ${
                            val.quantity || 0
                          }`}</span>
                          <span style={{ marginTop: '5px' }}>
                            <Close sx={{ fontSize: '15px' }} />
                          </span>
                          <span style={{ fontSize: '14px' }}>{ruppeeConversation(Number(val?.amountInPaisa), 0)}</span>
                        </Typography>
                      </div>
                      <div style={{ width: '30%' }}>
                        <Typography
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            float: 'left'
                          }}
                        >
                          <span>
                            <CurrencyInr sx={{ fontSize: '1rem', mt: '5px' }} />
                          </span>
                          <span style={{ fontSize: '14px' }}>
                            {ruppeeConversation(Number(val?.quantity) * val?.amountInPaisa, 0)}
                          </span>
                        </Typography>
                      </div>
                    </Box>
                  </Box>
                )}
              </Fragment>
            ))
          )}
        </Fragment>
      }
    >
      {children}
    </LightTooltip>
  )
}

export default CustomTransactionTooltip
