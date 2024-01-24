import CardStatsCharacter from 'src/@core/components/card-statistics/card-stats-with-image'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import ApexAreaChart from 'src/views/charts/apex-charts/ApexAreaChart'
import ApexDonutChart from 'src/views/charts/apex-charts/ApexDonutChart'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Alert, Box, Card, CardContent, InputAdornment, TextField, Select, MenuItem } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import Link from 'next/link'
import config from 'src/configs/config'
import Button from '@mui/material/Button'
import { Container } from '@mui/material'
import React, { forwardRef, useEffect, useState } from 'react'

// import { cityData, fetchAnalytics, fetchAnalyticsGraph } from 'src/api/Index'
import DatePicker from "react-datepicker";

// import { fetchTeamMembers } from 'src/store/apps/team-member'

// import { activeProjectlist } from 'src/store/apps/project'
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import moment from 'moment'
import ApexBarChart from 'src/views/charts/apex-charts/ApexBarChart'
import format from 'date-fns/format'
import { ChevronDown, DownloadCircleOutline, } from 'mdi-material-ui'

// import Table from 'src/@core/theme/overrides/table'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { cityData, fetchAnalyticsAgent, fetchAnalyticsGraphAgent } from 'src/api'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// const [endDate, setEndDate] = useState<DateType>(null)
// const [startDate, setStartDate] = useState<DateType>(new Date())



const AgentAnalytics = () => {

  const auth = useAuth()
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [analyticsData, setAnalyticsData] = useState<any>([])
  const [cityDataDetails, setCityData] = useState<any>([])

  const [searchValue, setsearchValue] = useState<string>(`${''}`);

  const [selectedValueCity, setSelectedValueCity] = useState(false)

  const [selectedCityId, setSelectedCityId] = useState<any>('')
  console.log(selectedCityId)
  const [pieCHartData, setPieCHartData] = useState([])
  const [barCHartData, setBarCHartData] = useState([])
  const [barCHarttitle, setBarCHartTitle] = useState([])
  const [lineCHartData, setLineCHartData] = useState<any>([])
  const [pieCHartTitle, setpieCHartTitle] = useState<any>([])
  const [tableData, setTableData] = useState([])

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 2 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState(currentYear);


  const months = [
    { label: "Select Months", value: 0 },
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  const [selectedMonth, setselectedMonth] = useState(0);


  const handleYearChange = (e: any) => {
    setSelectedYear(parseInt(e.target.value));
  }
  const handleMonthChange = (event: any) => {
    setselectedMonth(parseInt(event.target.value));
  };

  const anylytcisdata = async () => {
    const payload: any = {}

    payload.startDate = moment(startDate).format('YYYY/MM/DD')
    payload.endDate = moment(endDate).format('YYYY/MM/DD')
    payload.address_id = 0

    try {
      const resp = await fetchAnalyticsAgent(payload)
      setAnalyticsData(resp?.data?.data)
    } catch (error) {
      console.log(error, '----error')

    }

  }
  const graphData = async () => {
    const payload: any = {}
    payload.month = selectedMonth
    payload.year = selectedYear

    try {
      const resp = await fetchAnalyticsGraphAgent
        (payload)
      if (resp?.code == 200) {

        console.log(resp, '------resp graph')
        const graphData = resp?.data[2]?.LineChart?.stats.map((item: any) => { return item?.Onboarding_Trend })

        const piechartstats = resp?.data[0]?.PieChart.map((item: any) => { return item?.stats })
        const removePercentage = piechartstats.map((percent: any) => parseInt(percent.replace('%', ''), 10));
        const piechartTitle = resp?.data[0]?.PieChart.map((item: any) => { return item?.title })

        const barchartstats = resp?.data[1]?.BarChart.map((item: any) => { return item?.stats })
        const barchartTitle = resp?.data[1]?.BarChart.map((item: any) => { return item?.title })

        setLineCHartData(graphData)
        setTableData(resp?.data[3]?.Table)

        setBarCHartData(barchartstats)
        setBarCHartTitle(barchartTitle)

        setPieCHartData(removePercentage)
        setpieCHartTitle(piechartTitle)

      }

    } catch (error) {
      console.log(error, '----error')

    }
  }


  const handleChange = (value: string) => {
    setsearchValue(value);
    setSelectedValueCity(true)
  };



  const selectedCity = (name: any, id: any) => {
    setsearchValue(name)

    setSelectedCityId(id)

    setSelectedValueCity(false)

  }

  const fetchCityName = async () => {
    try {
      const resp = await cityData({
        searchValue
      })
      setCityData(resp)
      console.log(resp, '------resp city')
    } catch (error) {

    }
  }



  const CustomInput = forwardRef((props: any, ref) => {
    const startDate = format(props.start, 'MM/dd/yyyy')
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return (
      <TextField
        {...props}
        size='small'
        value={value}
        inputRef={ref}
        InputProps={{

          endAdornment: (
            <InputAdornment position='end'>
              <ChevronDown />
            </InputAdornment>
          )
        }}
      />
    )
  })

  const handleOnChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const exportPDF = () => {

    const downloadbtn = document.getElementById('downloadPdf-btn')!;
    downloadbtn.style.visibility = "hidden";
    const input = document.getElementById('pdf-content')!;
    console.log(input, "input")

    const options: any = { logging: true, letterRendering: 1, useCORS: true };
    html2canvas(input, options).then(canvas => {
      const imageWidth = 200;
      const imageHeight = canvas.height * imageWidth / canvas.width;
      const imgData = canvas.toDataURL('img/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, imageWidth, imageHeight);
      pdf.save('AnalyticsReport.pdf')

    })
    downloadbtn.style.visibility = "visible";
  }

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));



  useEffect(() => {
    if (endDate != undefined) {

      anylytcisdata()
    }
    fetchCityName()
    graphData()

    // teamMember()
    // activeProject(1)

  }, [searchValue, endDate, selectedMonth, selectedYear])

  return (
    <>
      <div id="pdf-content">
        <ApexChartWrapper>
          <Card>
            <CardContent>
              {(auth.user?.verificationStatus === config.agents.verificationStatus.pending ||
                auth.user?.verificationStatus === config.agents.verificationStatus.correctionRequired) && (
                  <>
                    {auth.user?.verificationStatus === config.agents.verificationStatus.correctionRequired ? (
                      <Alert severity='error'>
                        <p style={{ margin: 0 }}>
                          Your Profile is requested for correction. Please update your profile in&nbsp;
                          <Link passHref href='/profile'>
                            My Profile.
                          </Link>
                        </p>
                        <p style={{ fontWeight: 500, marginBottom: 0, paddingBottom: 0 }}>Reason:</p>
                        <p style={{ marginTop: 0, paddingTop: 0 }}>{auth.user?.listingRemark}</p>
                      </Alert>
                    ) : (
                      <Alert
                        severity='warning'
                        style={{
                          marginBottom: '10px'
                        }}
                      >
                        Your Profile is incomplete. Complete it now under&nbsp;
                        <Link passHref href='/profile'>
                          My Profile
                        </Link>
                        &nbsp;to get access to all dashboard feature.
                      </Alert>
                    )}
                  </>
                )}
              {auth?.user?.listingStatus === config?.listingStatus?.unlisted && (
                <Alert severity='error'>
                  <p style={{ margin: 0 }}>Your profile is unlisted.</p>
                  <p style={{ fontWeight: 500, marginBottom: 0, paddingBottom: 0 }}>Reason:</p>
                  <p style={{ marginTop: 0, paddingTop: 0 }}>{auth.user?.listingRemark}</p>
                </Alert>
              )}


              {/* start here */}


              <Grid container spacing={6} className='match-height'>
                <Grid item xs={12} className='gap-4'>
                  <Typography variant='h4' sx={{ mt: 4, textTransform: 'capitalize' }}>
                    Analytics
                  </Typography>
                </Grid>


                <Grid style={{ flexDirection: 'column', justifyContent: 'center', display: 'flex', width: '100%', }}>
                  <Container
                    style={{
                      fontWeight: 200,
                      marginBottom: 0,
                      paddingBottom: 0,
                      display: 'flex',
                      justifyContent: 'flex-end',

                    }}
                  >
                    {true && < div style={{ position: 'relative', }}>


                      <label
                        className="block my-2 text-sm font-medium text-blueText lg:text-md ">
                        Filter
                      </label>
                      <div style={{ position: 'relative', width: '230px', marginRight: '10px' }}>
                        <input
                          type="city"
                          name="city"
                          id="city"
                          style={{ backgroundColor: 'white', border: '1px solid rgb(215 214 214)', width: '100%', borderRadius: '8px', padding: '10px', marginRight: '2px', fontSize: '14px' }}
                          placeholder="Region"
                          required
                          value={searchValue}
                          onChange={(e) => handleChange(e.target.value)}
                        />
                        {selectedValueCity && searchValue != '' &&
                          < div style={{
                            backgroundColor: 'white',
                            position: 'absolute',
                            height: '300px',
                            width: '100%',
                            padding: '1vw',
                            zIndex: '99',
                            borderRadius: '1px',
                            overflow: 'scroll',
                            overflowX: 'hidden',
                            paddingTop: 0,
                            boxShadow: '0 0 10px #dadada',
                          }}
                          >
                            {
                              cityDataDetails?.data != undefined && cityDataDetails?.data?.length > 0 && cityDataDetails?.data.map((d: any, ind: any) => {
                                return (
                                  <div key={ind} onClick={() => { selectedCity(d?.name, d?.id) }}
                                    className='cursor-pointer '>
                                    <p className=' py-1 text-md'>{d?.name}</p>
                                  </div>
                                )
                              })}

                          </div>}

                      </div>
                    </div>}
                    <div style={{ width: '23.5%' }}>
                      <label className='block my-2 text-sm font-medium text-blueText lg:text-md '>Date</label>
                      <div style={{ position: 'relative', width: '100%', marginRight: '10px' }}>
                        <div style={{ flexDirection: 'row' }}>
                          <DatePicker
                            selectsRange
                            endDate={endDate}
                            id='apexchart-bar'
                            selected={startDate}
                            startDate={startDate}
                            onChange={handleOnChange}
                            placeholderText='Click to select a date'
                            customInput={
                              <CustomInput start={startDate as Date | number} end={endDate as Date | number} />
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{ justifyContent: 'center', marginTop: '20px', marginLeft: '10px' }}>
                      <Button
                        variant='outlined'
                        endIcon={<DownloadCircleOutline />}
                        style={{
                          padding: '10px',

                          color: 'black',
                          border: '1px solid rgb(199 200 208 / 68%)',
                          textTransform: 'capitalize',

                        }}
                        onClick={exportPDF}
                        id="downloadPdf-btn"
                      >
                        {/* <Box display='flex' alignItems='center'>
                        Download
                      </Box> */}
                      </Button>
                    </div>

                  </Container>
                </Grid>

                <Grid
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    display: 'flex',
                    width: '45%',
                    marginBottom: ''
                  }}
                >
                  <Container
                    style={{
                      fontWeight: 200,
                      marginBottom: 0,
                      paddingBottom: 0,
                      marginLeft: '10px',
                      display: 'flex',
                      justifyContent: 'space-evenly'
                    }}
                  >


                  </Container>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={6}>
                    {analyticsData != undefined && analyticsData.length > 0 && analyticsData.map((data: any, index: number) => (
                      <Grid item xs={12} sm={6} lg={3} key={index}>
                        <CardStatsCharacter key={index} data={data} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

              </Grid>
            </CardContent>
          </Card>
        </ApexChartWrapper >
        <ApexChartWrapper style={{ marginTop: '15px' }}>
          <Card>
            <CardContent >
              <Grid>
                <Grid item xs={12} >
                  <Grid style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Box style={{ justifyContent: 'end', marginRight: '10px' }}>
                      <Typography style={{ marginBottom: '5px' }}>Select Months</Typography>

                      <Select
                        id='type'
                        style={{ padding: '0px', width: '200px', height: '40px' }}
                        onChange={handleMonthChange}
                      >
                        {months.map((data: any) => (
                          <MenuItem key={data} value={data?.value}>
                            {data?.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                    <Box style={{ justifyContent: 'end', }}>
                      <Typography style={{ marginBottom: '5px' }}>Select Years</Typography>

                      <Select
                        id='type'
                        style={{ padding: '0px', width: '200px', height: '40px' }}
                        onChange={handleYearChange}
                      >
                        {years.map((data: any) => (
                          <MenuItem key={data} value={data}>
                            {data}
                          </MenuItem>
                        ))}
                      </Select>

                    </Box>
                  </Grid>
                  <Grid >
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', }}>
                      <ApexDonutChart label={pieCHartTitle} data={pieCHartData} />
                      <Grid style={{ flexDirection: 'row', display: 'flex' }}>
                        <ApexBarChart label={barCHarttitle} data={barCHartData} />


                      </Grid>
                    </Box>
                    <ApexAreaChart heading={`Onboarding Trend`} tooltipText='Leads'
                      data={lineCHartData}
                    />
                  </Grid>
                </Grid>

              </Grid>
            </CardContent>
          </Card>
        </ApexChartWrapper >
        <ApexChartWrapper style={{ marginTop: '15px' }}>
          <Card>
            <CardContent >
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Top 10</StyledTableCell>
                        <StyledTableCell align="center">Subscriber Agent ID</StyledTableCell>
                        <StyledTableCell align="center">Team Member</StyledTableCell>
                        <StyledTableCell align="center">Closed Leads</StyledTableCell>
                        <StyledTableCell align="center">Active Leads</StyledTableCell>
                        <StyledTableCell align="center">Avg. Wallet Recharge</StyledTableCell>
                        <StyledTableCell align="center">Active Since</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((row: any) => (
                        <StyledTableRow key={row.Sr_No}>
                          <StyledTableCell component="th" scope="row">
                            {row.Sr_No}
                          </StyledTableCell>
                          <StyledTableCell align="center">{row.Subscriber_Agent_Id}</StyledTableCell>
                          <StyledTableCell align="center">{row.Team_Member}</StyledTableCell>
                          <StyledTableCell align="center">{row.Closed_Leads}</StyledTableCell>
                          <StyledTableCell align="center">{row.Active_Leads}</StyledTableCell>
                          <StyledTableCell align="center">{row.Avg_Wallet}</StyledTableCell>
                          <StyledTableCell align="center">{row.Active_Since}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </CardContent>
          </Card>
        </ApexChartWrapper>
      </div>
    </>
  )
}



export default AgentAnalytics