/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable no-undef */
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useEffect, useState } from 'react'
import github from '../../assets/grey_logo.png'
import { ip } from './../../constants'
import {
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow,
  CContainer,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'
import 'chartjs-plugin-datalabels'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { DocsCallout } from 'src/components'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { element } from 'prop-types'
import { CanvasJS, CanvasJSChart } from 'canvasjs-react-charts'
import useMediaQuery from 'src/scss/useMediaQuery'

import { Column, Pie, G2, Line, Area, Bar, measureTextWidth } from '@ant-design/plots'
import { each, groupBy } from '@antv/util'
import { cilBold } from '@coreui/icons'
import { CBadge, CCardFooter } from '@coreui/react-pro'
import { useUserAuth } from 'src/Context/AuthContext'
import Loading from '../theme/loading/loading'

const CurrentMonth = () => {
  const [month, setMonth] = useState()
  const [year, setYear] = useState()
  const [date, setDate] = useState()
  const param = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const G = G2.getEngine('canvas')
  let location = useLocation()
  const matches = useMediaQuery('(max-width: 767px)')
  const { click1, click2, click3, setClick1Function, setClick2Function, setClick3Function } =
    useUserAuth()
  let [data, setData] = useState() // i set the data here
  let [currentMonthData, setCurrentMonthData] = useState()

  const monthNum = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  }

  const fetchCurrentMonthData = async () => {
    const response = await fetch(`${ip}/currentMonth/2022/December`)
    const data = await response.json()
    console.log(data)
    setCurrentMonthData(data)
    setLoading(true)
  }

  const dataCapture = (name, data) => {
    let a = 0
    let b = 0
    let c = 0
    let d = 0
    let e = 0
    let f = 0
    let arr = []

    console.log(data)
    a = parseInt(fetchStatusCategorySum(data, name, 'Core'))
    b = parseInt(fetchStatusCategorySum(data, name, 'ERC'))
    c = parseInt(fetchStatusCategorySum(data, name, 'Networking'))
    d = parseInt(fetchStatusCategorySum(data, name, 'Interface'))
    e = parseInt(fetchStatusCategorySum(data, name, 'Meta'))
    f = parseInt(fetchStatusCategorySum(data, name, 'Informational'))

    arr.push(
      {
        type: 'Core',
        value: a,
      },
      {
        type: 'ERC',
        value: b,
      },
      {
        type: 'Networking',
        value: c,
      },
      {
        type: 'Interface',
        value: d,
      },
      {
        type: 'Meta',
        value: e,
      },
      {
        type: 'Informational',
        value: f,
      },
    )

    return arr
  }

  const configColumnCharts = (name, data) => {
    const config = {
      data: dataCapture(name, data),
      color: ['#228be6', '#66d9e8', '#ffa8a8', '#ffe066', '#e599f7', '#c0eb75'],
      isStack: true,
      xField: 'type',
      yField: 'value',
      seriesField: 'type',
      label: {
        position: 'middle',

        style: {
          fill: '#FFFFFF',
          opacity: 0.8,
          fontSize: 14,
          fontWeight: 800,
        },
      },
      legend: {
        position: 'top-right',
      },
    }

    return config
  }

  const configPieCharts = (name, data) => {
    const config = {
      appendPadding: 10,
      data: dataCapture(name, data),
      angleField: 'value',
      colorField: 'type',
      radius: 0.75,
      legend: false,
      color: ['#228be6', '#66d9e8', '#ffa8a8', '#ffe066', '#e599f7', '#c0eb75', '#20c997'],
      label: {
        type: 'spider',
        labelHeight: 40,
        formatter: (data, mappingData) => {
          const group = new G.Group({})
          group.addShape({
            type: 'circle',
            attrs: {
              x: 0,
              y: 0,
              width: 40,
              height: 50,
              r: 5,
              fill: mappingData.color,
            },
          })
          group.addShape({
            type: 'text',
            attrs: {
              x: 10,
              y: 8,
              text: `${data.type}`,
              fill: mappingData.color,
            },
          })
          group.addShape({
            type: 'text',
            attrs: {
              x: 0,
              y: 25,
              text: `${data.value}`,
              fill: 'rgba(0, 0, 0, 0.65)',
              fontWeight: 700,
            },
          })
          return group
        },
      },
      interactions: [
        {
          type: 'element-selected',
        },
        {
          type: 'element-active',
        },
      ],
    }

    return config
  }
  function renderStatistic(containerWidth, text, style) {
    const { width: textWidth, height: textHeight } = measureTextWidth(text, style)
    const R = containerWidth / 2 // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 1

    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))),
        ),
        1,
      )
    }

    const textStyleStr = `width:${containerWidth}px;`
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
      scale < 1 ? 1 : 'inherit'
    };">${text}</div>`
  }
  const configDougnutChart = (name, data) => {
    const config = {
      appendPadding: 10,
      data: dataCapture(name, data),
      color: ['#228be6', '#66d9e8', '#ffa8a8', '#ffe066', '#e599f7', '#c0eb75', '#20c997'],
      angleField: 'value',
      colorField: 'type',
      radius: 1,
      innerRadius: 0.64,
      meta: {
        value: {
          formatter: (v) => `${v} ¥`,
        },
      },
      label: {
        type: 'inner',
        offset: '-50%',
        style: {
          textAlign: 'center',
        },
        autoRotate: false,
        content: '{value}',
      },
      statistic: {
        title: {
          offsetY: -4,

          customHtml: (container, view, datum) => {
            const { width, height } = container.getBoundingClientRect()
            const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
            const text = datum ? datum.type : 'Total'
            return renderStatistic(d, text, {
              fontSize: 8,
            })
          },
        },
        content: {
          offsetY: 4,
          style: {
            fontSize: '32px',
          },
          customHtml: (container, view, datum, data) => {
            const { width } = container.getBoundingClientRect()
            const text = datum ? `${datum.value}` : `${data.reduce((r, d) => r + d.value, 0)}`
            return renderStatistic(width, text, {
              fontSize: 32,
            })
          },
        },
      },
      interactions: [
        {
          type: 'element-selected',
        },
        {
          type: 'element-active',
        },
        {
          type: 'pie-statistic-active',
        },
      ],
    }
    return config
  }
  const configAreaCharts = (name, data) => {
    const config = {
      data: dataCapture(name, data),
      xField: 'type',
      yField: 'value',
      color: ['#228be6', '#66d9e8', '#ffa8a8', '#ffe066', '#e599f7', '#c0eb75', '#20c997'],
      xAxis: {
        range: [0, 1],
        tickCount: 5,
      },
      areaStyle: () => {
        return {
          fill: 'l(270) 0:#ffffff 0.5:#66d9e8 1:#228be6',
        }
      },
    }
    return config
  }

  const configDraftvsPotentialCharts = (data) => {
    const config = {
      data: [
        {
          type: 'Draft',
          value: parseInt(fetchStatusSum(data, 'Draft')),
        },
        {
          type: 'Potential Proposal',
          value: 12,
        },
      ],
      color: ['#228be6', '#66d9e8', '#ffa8a8', '#ffe066', '#e599f7', '#c0eb75'],
      isStack: true,
      xField: 'type',
      yField: 'value',
      seriesField: 'type',
      label: {
        position: 'middle',

        style: {
          fill: '#FFFFFF',
          opacity: 0.8,
          fontSize: 14,
          fontWeight: 800,
        },
      },
      legend: {
        position: 'top-right',
      },
    }

    return config
  }

  const fetchStatusCategorySum = (monthData, status, category) => {
    let arr = []
    console.log(status, category)
    let statusArr = monthData.filter((elem) => {
      return elem.Status === status
    })
    console.log(statusArr)
    if (statusArr.length === 0) return 0
    for (let i = 0; i < statusArr[0][category][0]; i++) {
      arr.push(statusArr[0][category][i + 1])
    }

    if (status !== 'Final') {
      for (let i = 0; i < statusArr[0]['Undefined'][0]; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (arr[j] === statusArr[0]['Undefined'][i + 1]) {
            arr.splice(j, 1)
          }
        }
      }
    }

    console.log(arr)
    console.log(arr.length)

    return arr.length
  }

  // draft vs Final Charts
  const annotations = []

  const d1 = [
    {
      year: 'Draft',
      value: fetchStatusCategorySum(
        currentMonthData === undefined ? [] : currentMonthData,
        'Draft',
        'Core',
      ),
      type: 'Core',
    },
    {
      year: 'Draft',
      value: fetchStatusCategorySum(
        currentMonthData === undefined ? [] : currentMonthData,
        'Draft',
        'ERC',
      ),
      type: 'ERC',
    },
    {
      year: 'Draft',
      value: fetchStatusCategorySum(
        currentMonthData === undefined ? [] : currentMonthData,
        'Draft',
        'Networking',
      ),
      type: 'Networking',
    },
    {
      year: 'Draft',
      value: fetchStatusCategorySum(
        currentMonthData === undefined ? [] : currentMonthData,
        'Draft',
        'Interface',
      ),
      type: 'Interface',
    },
    {
      year: 'Draft',
      value: fetchStatusCategorySum(
        currentMonthData === undefined ? [] : currentMonthData,
        'Draft',
        'Meta',
      ),
      type: 'Meta',
    },
    {
      year: 'Draft',
      value: fetchStatusCategorySum(
        currentMonthData === undefined ? [] : currentMonthData,
        'Draft',
        'Informational',
      ),
      type: 'Informational',
    },
    {
      year: 'Final',
      value: fetchStatusCategorySum(
        currentMonthData === undefined ? [] : currentMonthData,
        'Final',
        'Core',
      ),
      type: 'Core',
    },
    {
      year: 'Final',
      value: fetchStatusCategorySum(
        currentMonthData === undefined ? [] : currentMonthData,
        'Final',
        'ERC',
      ),
      type: 'ERC',
    },
    {
      year: 'Final',
      value: fetchStatusCategorySum(
        currentMonthData === undefined ? [] : currentMonthData,
        'Final',
        'Networking',
      ),
      type: 'Networking',
    },
    {
      year: 'Final',
      value: fetchStatusCategorySum(
        currentMonthData === undefined ? [] : currentMonthData,
        'Final',
        'Interface',
      ),
      type: 'Interface',
    },

    {
      year: 'Final',
      value: fetchStatusCategorySum(
        currentMonthData === undefined ? [] : currentMonthData,
        'Final',
        'Meta',
      ),
      type: 'Meta',
    },
    {
      year: 'Final',
      value: fetchStatusCategorySum(
        currentMonthData === undefined ? [] : currentMonthData,
        'Final',
        'Informational',
      ),
      type: 'Informational',
    },
  ]
  each(groupBy(d1, 'year'), (values, k) => {
    const value = values.reduce((a, b) => a + b.value, 0)

    annotations.push({
      type: 'text',
      position: [k, value],
      content: `${value}`,
      style: {
        textAlign: 'center',
        fontSize: 12,
        fill: 'rgba(0,0,0,0.6)',
      },
      offsetY: -10,
    })
  })
  const configDraftvsFinalCharts = (data) => {
    const config = {
      data: d1,
      color: ['#228be6', '#66d9e8', '#ffa8a8', '#ffe066', '#e599f7', '#c0eb75'],
      isStack: true,
      xField: 'year',
      yField: 'value',
      seriesField: 'type',
      label: false,

      annotations,
    }
    return config
  }
  const getBadge = (status) => {
    switch (status) {
      case 'Final':
        return '#c3fae8'
      case 'Last_Call':
        return '#d3f9d8'
      case 'Last Call':
        return '#d3f9d8'
      case 'LastCall':
        return '#d3f9d8'
      case 'Draft':
        return '#fff3bf'
      case 'Stagnant':
        return '#ffe8cc'
      case 'Withdrawn':
        return '#ffe3e3'
      case 'Review':
        return '#d0ebff'
      case 'Living':
        return '#c5f6fa'
      default:
        return '#e7f5ff'
    }
  }
  const getBadgeColor = (status) => {
    switch (status) {
      case 'Final':
        return '#0ca678'
      case 'Last_Call':
        return '#37b24d'
      case 'Last Call':
        return '#37b24d'
      case 'LastCall':
        return '#37b24d'
      case 'Draft':
        return '#f08c00'
      case 'Stagnant':
        return '#e8590c'
      case 'Withdrawn':
        return '#e03131'
      case 'Review':
        return '#1971c2'
      case 'Living':
        return '#0c8599'
      default:
        return '#1c7ed6'
    }
  }

  const coloring = (text) => {
    switch (text) {
      case 'text':
        return '#1c7ed6'
      case 'back':
        return '#e7f5ff'
      default:
        return '#e7f5ff'
    }
  }

  // header
  const header = (text) => {
    return (
      <CCardHeader
        className="cardHeader"
        style={{
          color: `${getBadgeColor(text)}`,
          background: `${getBadge(text)}`,
          borderBottom: `2px solid ${getBadgeColor(text)}`,
        }}
      >
        {text === 'GeneralStats' ? 'General Stats' : text === 'LastCall' ? 'Last Call' : text}{' '}
        {text === 'GeneralStats' ? (
          ''
        ) : (
          <label style={{ fontWeight: '700' }}>
            {'('}
            {parseInt(
              fetchStatusSum(
                currentMonthData === undefined ? [] : currentMonthData,
                text === 'Last Call' ? 'Last_Call' : text,
              ),
            )}
            {')'}
          </label>
        )}
      </CCardHeader>
    )
  }
  const configgeneralStatsCharts = (data) => {
    const config = {
      data: [
        {
          type: 'Open PR',
          value: 7,
        },
        {
          type: 'Merged PR',
          value: 18,
        },
        {
          type: 'New Issues',
          value: 4,
        },
        {
          type: 'closed Issues',
          value: 2,
        },
      ],
      color: ['#228be6', '#66d9e8', '#ffa8a8', '#ffe066', '#e599f7', '#c0eb75'],
      isStack: true,
      xField: 'type',
      yField: 'value',
      seriesField: 'type',
      label: {
        position: 'middle',

        style: {
          fill: '#FFFFFF',
          opacity: 0.8,
          fontSize: 14,
          fontWeight: 800,
        },
      },
      legend: {
        position: 'top-right',
      },
    }

    return config
  }

  const findTotalValueZero = (data, name) => {
    if (data.length !== 0) {
      return (
        parseInt(data === undefined ? 0 : data[0][name].Core) +
        parseInt(data === undefined ? 0 : data[0][name].ERC) +
        parseInt(data === undefined ? 0 : data[0][name].Networking) +
        parseInt(data === undefined ? 0 : data[0][name].Interface)
      )
    }
    return 0
  }
  // for date fetching
  const fetchDate = () => {
    let date = new Date().toDateString()
    setDate(date)
  }

  // current Month fetching
  const fetchStatusSum = (monthData, status) => {
    let sum = 0

    for (let i = 0; i < monthData?.length; i++) {
      if (monthData[i].Status === status) {
        sum += parseInt(monthData[i].Core[0])
        sum += parseInt(monthData[i].ERC[0])
        sum += parseInt(monthData[i].Networking[0])
        sum += parseInt(monthData[i].Interface[0])
        sum += parseInt(monthData[i].Meta[0])
        sum += parseInt(monthData[i].Informational[0])
        if (status !== 'Final') sum -= parseInt(monthData[i].Undefined[0])
      }
    }

    return sum
  }

  const statusRows = (name) => {
    return (
      <CTableRow>
        <CTableHeaderCell scope="row">
          <CBadge
            style={{
              color: `${getBadgeColor(name)}`,
              backgroundColor: `${getBadge(name)}`,
              fontSize: '13px',
            }}
          >
            {name}
          </CBadge>
        </CTableHeaderCell>
        <CTableDataCell>
          <label className="relative cursor-pointer">
            <div
              className={`h-7
shadow-2xl font-extrabold rounded-[8px] bg-[${getBadge(name)}] text-[${getBadgeColor(
                name,
              )}] text-[12px] inline-block p-[4px] drop-shadow-sm cursor-pointer`}
              style={{
                color: `${getBadgeColor(name)}`,
                backgroundColor: `${getBadge(name)}`,
              }}
            >
              <Link
                to="/currentMonthTable"
                style={{
                  textDecoration: 'none',
                  color: `${getBadgeColor(name)}`,
                  backgroundColor: `${getBadge(name)}`,
                }}
                className={`githubIcon h-7
shadow-2xl font-extrabold rounded-[8px]  text-[12px] inline-block p-[4px] drop-shadow-sm cursor-pointer`}
                state={{
                  status: name,
                  name: `${currentMonthData[0].Month}_${currentMonthData[0].Year}_Draft`,
                }}
              >
                {parseInt(
                  fetchStatusSum(currentMonthData === undefined ? [] : currentMonthData, name),
                )}
                *
              </Link>
            </div>
            <div
              className={`absolute top-0 right-0 -mr-1 -mt-0 w-2 h-2 rounded-full bg-[${getBadgeColor(
                name,
              )}] animate-ping`}
              style={{
                backgroundColor: `${getBadgeColor(name)}`,
              }}
            ></div>
            <div
              className={`absolute top-0 right-0 -mr-1 -mt-0 w-2 h-2 rounded-full bg-[${getBadgeColor(
                name,
              )}]`}
              style={{
                backgroundColor: `${getBadgeColor(name)}`,
              }}
            ></div>
          </label>
        </CTableDataCell>
      </CTableRow>
    )
  }

  const statusChartTemplate = (name) => {
    return (
      <CCard className="mb-4 cardBorder">
        <Link
          to="/currentMonthTable"
          style={{ textDecoration: 'none', color: 'inherit' }}
          state={{
            type: '',
            status: name,
            category: '',
            month: `${month}`,
            year: `${year}`,
            name: `${currentMonthData[0].Month}_${currentMonthData[0].Year}_${name}`,
          }}
        >
          {header(name)}
        </Link>
        <CCardBody className="childChartContainer">
          {parseInt(
            fetchStatusSum(currentMonthData === undefined ? [] : currentMonthData, name),
          ) === 0 ? (
            <div
              style={{
                textAlign: 'center',
                width: '100%',
                height: '100%',
                position: 'absolute',
                left: '0',
                top: '83px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'rgba(220, 52, 85, 0.5)',
                zIndex: '1',
                fontSize: '26px',
              }}
            >
              <b>No data for you today!</b>
            </div>
          ) : (
            ''
          )}
          <Column
            style={{
              visibility: `${
                parseInt(
                  fetchStatusSum(currentMonthData === undefined ? [] : currentMonthData, name),
                ) === 0
                  ? 'hidden'
                  : 'visible'
              }`,
            }}
            {...configColumnCharts(name, currentMonthData === undefined ? [] : currentMonthData)}
          />
        </CCardBody>
      </CCard>
    )
  }
  useEffect(() => {
    fetchDate()
    if (param['*'] === 'autoCharts') {
      setClick1Function(false)
      setClick2Function(false)
      setClick3Function(false)
    }
    fetchCurrentMonthData()
    // setInfo(localStorage.getItem('count'))
  }, [param['*']])

  return (
    <>
      {loading ? (
        <div>
          <div className="flex justify-center items-center mb-[4rem]">
            <div className="flex justify-center items-center">
              <div
                className="rotate-[270deg] bg-white text-[2rem] tracking-wider p-2 border-b-[#1c7ed6] border-b-[6px] "
                style={{ fontFamily: 'Big Shoulders Display' }}
              >
                {currentMonthData === undefined ? '' : currentMonthData[0].Year}
              </div>
              <div
                className="flex justify-center items-center bg-[#e7f5ff] text-[#1c7ed6] p-2 px-6 text-[5.5rem] shadow-md "
                style={{ fontFamily: 'Big Shoulders Display' }}
              >
                {currentMonthData === undefined ? '' : currentMonthData[0].Month}{' '}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: matches ? 'column' : 'row' }}>
            <div className="p-2" style={{ width: matches ? '100%' : '50%' }}>
              <CCard>
                <CCardBody
                  style={{
                    overflowX: 'auto',
                    overflowY: 'auto',
                    width: '100%',
                    fontFamily: 'Roboto',
                    fontSize: '15px',
                    borderBottom: '2px solid #74c0fc',
                  }}
                >
                  <CTable align="middle" responsive>
                    <CTableHead style={{ borderBottom: '2px solid #4dabf7' }}>
                      <CTableRow>
                        <CTableHeaderCell scope="col" style={{ width: '70%' }}>
                          Status
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ width: '30%' }}>
                          Number
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {parseInt(
                        fetchStatusSum(
                          currentMonthData === undefined ? [] : currentMonthData,
                          'Final',
                        ),
                      ) === 0
                        ? ''
                        : statusRows('Final')}

                      {parseInt(
                        fetchStatusSum(
                          currentMonthData === undefined ? [] : currentMonthData,
                          'Last_Call',
                        ),
                      ) === 0
                        ? ''
                        : statusRows('Last_Call')}
                      {parseInt(
                        fetchStatusSum(
                          currentMonthData === undefined ? [] : currentMonthData,
                          'Review',
                        ),
                      ) === 0
                        ? ''
                        : statusRows('Review')}

                      {parseInt(
                        fetchStatusSum(
                          currentMonthData === undefined ? [] : currentMonthData,
                          'Draft',
                        ),
                      ) === 0
                        ? ''
                        : statusRows('Draft')}
                      {parseInt(
                        fetchStatusSum(
                          currentMonthData === undefined ? [] : currentMonthData,
                          'Stagnant',
                        ),
                      ) === 0
                        ? ''
                        : statusRows('Stagnant')}

                      {parseInt(
                        fetchStatusSum(
                          currentMonthData === undefined ? [] : currentMonthData,
                          'Withdrawn',
                        ),
                      ) === 0
                        ? ''
                        : statusRows('Withdrawn')}
                      {parseInt(
                        fetchStatusSum(
                          currentMonthData === undefined ? [] : currentMonthData,
                          'Living',
                        ),
                      ) === 0
                        ? ''
                        : statusRows('Living')}
                    </CTableBody>
                  </CTable>
                </CCardBody>
                <CCardFooter
                  className="cardFooter bg-[#e7f5ff] text-[#1c7ed6]"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <label style={{ color: '#1c7ed6', fontSize: '15px', fontWeight: 'bold' }}>
                    *Click to see more
                  </label>
                  <label style={{ color: '#1c7ed6', fontSize: '10px' }}>{date}</label>
                </CCardFooter>
              </CCard>
            </div>
            <div className="p-2" style={{ width: matches ? '100%' : '50%' }}>
              <CCol xs={12} className="mb-4">
                <CCard>
                  <CCardBody
                    style={{
                      overflowX: 'auto',
                      overflowY: 'auto',
                      width: '100%',
                      fontFamily: 'Roboto',
                      fontSize: '15px',
                      borderBottom: '2px solid #74c0fc',
                    }}
                  >
                    <CTable align="middle" responsive>
                      <CTableHead style={{ borderBottom: '2px solid #4dabf7' }}>
                        <CTableRow>
                          <CTableHeaderCell scope="col" style={{ width: '70%' }}>
                            Other Stats
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{ width: '30%' }}>
                            Number
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Forks</CTableHeaderCell>
                          <CTableDataCell>4100</CTableDataCell>
                        </CTableRow>

                        <CTableRow>
                          <CTableHeaderCell scope="row">Users</CTableHeaderCell>
                          <CTableDataCell>932</CTableDataCell>
                        </CTableRow>

                        <CTableRow>
                          <CTableHeaderCell scope="row">Authors</CTableHeaderCell>
                          <CTableDataCell>10</CTableDataCell>
                        </CTableRow>

                        <CTableRow>
                          <CTableHeaderCell scope="row">Files</CTableHeaderCell>
                          <CTableDataCell>11</CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </CCard>
                <CCardFooter
                  className="cardFooter bg-[#e7f5ff] text-[#1c7ed6]"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <label></label>
                  <label style={{ color: '#1c7ed6', fontSize: '10px' }}>{date}</label>
                </CCardFooter>
              </CCol>
            </div>
          </div>

          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4 cardBorder">
                {header('GeneralStats')}

                <CCardBody className="childChartContainer">
                  <Column {...configgeneralStatsCharts(data === undefined ? [] : data)} />
                </CCardBody>
              </CCard>
            </CCol>

            {/* status Information */}

            <CCol xs={matches ? 12 : 6}>{statusChartTemplate('Final')}</CCol>
            <CCol xs={matches ? 12 : 6}>{statusChartTemplate('Last_Call')}</CCol>
            <CCol xs={matches ? 12 : 6}>{statusChartTemplate('Review')}</CCol>
            <CCol xs={matches ? 12 : 6}>{statusChartTemplate('Draft')}</CCol>
            <CCol xs={matches ? 12 : 6}>{statusChartTemplate('Stagnant')}</CCol>
            <CCol xs={matches ? 12 : 6}>{statusChartTemplate('Withdrawn')}</CCol>
            <CCol xs={matches ? 12 : 6}>{statusChartTemplate('Living')}</CCol>

            <CCol xs={matches ? 12 : 6}>
              <CCard className="mb-4 cardBorder">
                <CCardHeader
                  className="cardHeader"
                  style={{
                    color: `${coloring('text')}`,
                    background: `${coloring('back')}`,
                    borderBottom: '2px solid #74c0fc',
                  }}
                >
                  Final vs Draft
                </CCardHeader>
                <CCardBody className="childChartContainer">
                  {parseInt(
                    fetchStatusSum(currentMonthData === undefined ? [] : currentMonthData, 'Draft'),
                  ) === 0 &&
                  parseInt(
                    fetchStatusSum(currentMonthData === undefined ? [] : currentMonthData, 'Final'),
                  ) === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        left: '0',
                        top: '83px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'rgba(220, 52, 85, 0.5)',
                        zIndex: '1',
                        fontSize: '26px',
                      }}
                    >
                      <b>No data for you today!</b>
                    </div>
                  ) : (
                    ''
                  )}
                  <Column
                    style={{
                      visibility: `${
                        parseInt(
                          fetchStatusSum(
                            currentMonthData === undefined ? [] : currentMonthData,
                            'Draft',
                          ),
                        ) === 0 &&
                        parseInt(
                          fetchStatusSum(
                            currentMonthData === undefined ? [] : currentMonthData,
                            'Final',
                          ),
                        ) === 0
                          ? 'hidden'
                          : 'visible'
                      }`,
                    }}
                    {...configDraftvsFinalCharts(
                      currentMonthData === undefined ? [] : currentMonthData,
                    )}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default CurrentMonth
