import {
  Avatar,
  Box,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import { CurrencyInr, EyeOutline } from 'mdi-material-ui'

import React, { FC, useState } from 'react'
import { imagePreview } from 'src/common/types'
import config from 'src/configs/config'
import { ruppeeConversation } from 'src/utilities/conversions'
import ImagePreview from 'src/views/image-perview'
import DrawerData from 'src/views/property/side-drawer'
import MultiButton from '../multiButton/MultiButton'

interface IPagination {
  currentPage: number
  perPage: number
  total: number
  totalPages: number
}

interface IProperties {
  [key: string]: any
}
interface ICollectionPropertiesTable {
  selectedProperties: Array<any>
  setSelectedProperties: React.Dispatch<React.SetStateAction<IProperties[]>>
  allProperties: Array<any>
  isCover?: boolean
  loading: boolean
  pagination?: IPagination
  setUnselectedProperties?: React.Dispatch<React.SetStateAction<IProperties[]>>
  pageChange: (page: number) => void
}

interface IRow {
  row: any
  handleClick: (event: any, row: any) => void
  setopenDrawer: (visible: boolean, id: string) => void
}

const CollectionPropetriesTable: FC<ICollectionPropertiesTable> = ({
  selectedProperties,
  setSelectedProperties,
  allProperties,
  isCover,
  loading,
  pagination,
  setUnselectedProperties,
  pageChange
}) => {
  const [openImage, setOpenImage] = useState<imagePreview>({
    visible: false,
    url: ''
  })
  const [openDrawer, setopenDrawer] = useState({
    visible: false,
    id: ''
  })

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (allProperties.length) {
      if (event.target.checked) {
        const leftout = allProperties.filter((item: IProperties) => {
          const check = selectedProperties.some(val => item.id === val.id)
          if (!check) {
            return item
          }
        })
        setSelectedProperties((prev: any[]) => [...leftout, ...prev])

        return
      } else {
        const leftout = selectedProperties.filter((item: IProperties) => {
          const check = allProperties.some(val => item.id === val.id)
          if (!check) {
            return item
          }
        })
        setSelectedProperties([...leftout])
      }

      if (setUnselectedProperties) setUnselectedProperties([])
    }
  }
  const handleClick = (event: any, row: IProperties) => {
    const isSelected = event?.target?.checked
    if (isSelected) {
      setSelectedProperties((prev: IProperties[]) => [...prev, row])
      if (setUnselectedProperties)
        setUnselectedProperties((prev: IProperties[]) => {
          if (prev.length > 0) {
            return prev.filter((item: IProperties) => !(item.id === row.id))
          } else {
            return []
          }
        })
    } else {
      if (setUnselectedProperties) setUnselectedProperties((prev: IProperties[]) => [...prev, row])
      setSelectedProperties((prev: IProperties[]) => prev.filter((item: IProperties) => !(item.id === row.id)))
    }
  }
  const handleChangePage = (e: any, page: number) => {
    pageChange(page + 1)
  }

  const Row: FC<IRow> = ({ row, handleClick, setopenDrawer }) => {
    const isItemSelected = selectedProperties.find((item: any) => {
      return item?.id === row?.id
    })

    return (
      <TableRow>
        <TableCell style={{ minWidth: '80px' }} align='left'>
          <Tooltip title='Select'>
            <Checkbox color='primary' checked={!!isItemSelected} onClick={event => handleClick(event, row)} />
          </Tooltip>
        </TableCell>
        <TableCell style={{ minWidth: '200px' }} sx={{ textTransform: 'capitalize' }}>
          <Tooltip title={row?.name ? row.name : ''}>
            <Typography noWrap>
              {row?.name?.length > config.nameLengthCheck
                ? row?.name?.slice(0, config.nameLengthCheck) + '...'
                : row?.name || ''}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell align='left' style={{ minWidth: '100px' }}>
          <div
            onClick={() =>
              setOpenImage({
                visible: true,
                url: row?.images?.length > 0 ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${row?.images[0]}` : ''
              })
            }
            style={{
              cursor: 'pointer'
            }}
          >
            <Avatar src={row?.images?.length > 0 ? process.env.NEXT_PUBLIC_IMAGE_URL + row?.images[0] : ''} />
          </div>
        </TableCell>
        <TableCell align='left' style={{ minWidth: '150px' }}>
          <Typography noWrap sx={{ display: 'flex', alignItems: 'center' }}>
            <CurrencyInr sx={{ fontSize: '1.1rem' }} />
            {`${
              row?.maxLaunchPriceInPaise
                ? ` ${ruppeeConversation(row?.maxLaunchPriceInPaise)}
                      `
                : '-'
            }
              `}
          </Typography>
        </TableCell>
        <TableCell align='left' style={{ minWidth: '150px' }}>
          <Typography noWrap sx={{ display: 'flex', alignItems: 'center' }}>
            <CurrencyInr sx={{ fontSize: '1.1rem' }} />
            {`${
              row?.maxCurrentPriceInPaise
                ? ` ${ruppeeConversation(row?.maxCurrentPriceInPaise)}
                      `
                : '-'
            }
              `}
          </Typography>
        </TableCell>
        <TableCell align='center' style={{ minWidth: '150px' }}>
          <MultiButton
            options={[
              {
                label: 'View',
                tooltipLabel: 'View property details',
                onClick: () => {
                  setopenDrawer(true, row?.id)
                },
                icon: <EyeOutline sx={{ marginRight: '-4px' }} />
              }
            ]}
          />
        </TableCell>
      </TableRow>
    )
  }
  const check = () => {
    if (allProperties?.length === 0) return false
    if (selectedProperties?.length >= allProperties?.length) {
      let count = 0
      selectedProperties.map(data => {
        if (allProperties.find(val => val.id === data.id)) {
          count += 1
        }
      })

      return count === allProperties?.length
    } else {
      return false
    }
  }

  return (
    <>
      <TableContainer
        sx={{
          height: isCover ? '80%' : '450px',
          border: '1px solid rgba(76, 78, 100, 0.1)'
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align='left'>
                <Tooltip title='Select All'>
                  <Checkbox
                    color='primary'
                    indeterminate={selectedProperties?.length > 0 && !check()}
                    checked={check()}
                    onChange={handleSelectAllClick}
                  />
                </Tooltip>
              </TableCell>

              <TableCell align='left'>Property Name</TableCell>
              <TableCell align='left'>Image</TableCell>
              <TableCell align='left'>Launch Price</TableCell>
              <TableCell align='left'>Current Price</TableCell>
              <TableCell align='center'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            style={{
              height: isCover ? '80%' : 'auto',
              position: 'relative'
            }}
          >
            {loading ? (
              <TableRow>
                <TableCell colSpan={12}>
                  <div
                    style={{
                      position: 'relative',
                      height: '200px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CircularProgress />
                  </div>
                </TableCell>
              </TableRow>
            ) : allProperties.length > 0 ? (
              <>
                {allProperties.map((row: any, index: number) => (
                  <Row
                    key={index}
                    row={row}
                    handleClick={handleClick}
                    setopenDrawer={(visible, id) =>
                      setopenDrawer({
                        visible,
                        id
                      })
                    }
                  />
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={12}>
                  <div
                    style={{
                      position: 'relative',
                      height: '200px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    No Property Selected
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <Box>
          <TablePagination
            component='div'
            rowsPerPageOptions={[]}
            count={pagination.total || 0}
            rowsPerPage={pagination.perPage ? pagination.perPage : 10}
            page={pagination.currentPage ? pagination.currentPage - 1 : 0}
            onPageChange={handleChangePage}
            sx={{
              marginTop: `${isCover ? 'auto' : ''}`
            }}
          />
        </Box>
      )}
      <ImagePreview open={openImage} setOpen={setOpenImage} />
      <DrawerData openDrawer={openDrawer} setopenDrawer={setopenDrawer} />
    </>
  )
}

export default CollectionPropetriesTable
