import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, CardBody, CardTitle, Col, Row, Spinner } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import ReactApexChart from 'react-apexcharts'
import { getPerformance, getPerformanceTrend, downloadAnalyticsCsv, getActiveUsersByDevice } from '@/api/apis'

const RANGES = [
  { key: '24h', label: '24H', ticks: 8 },
  { key: '7d', label: '7D', ticks: 7 },
  { key: '28d', label: '28D', ticks: 14 },
  { key: '3mo', label: '3M', ticks: 28 },
]

const compactFormatter = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })

const Conversions = ({ metricLeft = 'screenPageViews', metricRight = 'activeUsers', metricLeftName = 'Impressions', metricRightName = 'Clicks' }) => {
  const [selectedRange, setSelectedRange] = useState('7d')
  const [loading, setLoading] = useState(false)
  
  // ✅ Consolidate chart data to ensure sync between categories and series
  const [chartData, setChartData] = useState({
    categories: [],
    series: [
      { name: metricLeftName, type: 'bar', data: [] },
      { name: metricRightName, type: 'line', data: [] },
    ],
  })
  
  const [kpis, setKpis] = useState({ totalLeft: 0, totalRight: 0, ctr: null, avgPosition: null })

  // responsive chart height depending on viewport width
  function getChartHeight() {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200
    if (w < 576) return 220
    if (w < 992) return 300
    return 360
  }

  const [chartHeight, setChartHeight] = useState(getChartHeight())
  const [deviceData, setDeviceData] = useState({
    total: 0,
    series: [],
    labels: [],
  })
  const [deviceError, setDeviceError] = useState(null)
  const [deviceLoading, setDeviceLoading] = useState(false)

  useEffect(() => {
    function onResize() {
      setChartHeight(getChartHeight())
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    let mounted = true
    setDeviceLoading(true)
    setDeviceError(null)

    ;(async () => {
      try {
        const data = await getActiveUsersByDevice({ range: selectedRange })
        if (!mounted) return
        const devices = data?.devices || []
        const desktop = devices.find((d) => d.device === 'desktop')?.users || 0
        const mobile = devices.find((d) => d.device === 'mobile')?.users || 0

        setDeviceData({
          total: data?.totalActiveUsers || 0,
          labels: ['Desktop', 'Mobile'],
          series: [desktop, mobile],
        })

        if (desktop === 0 && mobile === 0) {
          setDeviceError('No device data available.')
        }
      } catch (err) {
        console.error('Device analytics load failed:', err)
        if (mounted) setDeviceError('Unable to load device data.')
      } finally {
        if (mounted) setDeviceLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [selectedRange])

  const totalDeviceUsers = useMemo(() => {
    return (deviceData.series || []).reduce((sum, v) => sum + Number(v || 0), 0)
  }, [deviceData.series])

  const shortX = (x) => {
    if (!x) return x
    if (selectedRange === '24h') {
      const parts = x.split(' ')
      return parts[1] ?? parts[0].slice(5)
    }
    return x.slice(5)
  }

  const tickAmount = useMemo(() => {
    const entry = RANGES.find((r) => r.key === selectedRange) || RANGES[1]
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200
    if (w < 576) return Math.max(2, Math.floor(entry.ticks * 0.35))
    if (w < 992) return Math.max(3, Math.floor(entry.ticks * 0.6))
    return entry.ticks
  }, [selectedRange])

  // Chart options (responsive + clean formatting)
  const chartOptions = useMemo(
    () => ({
      chart: {
        height: chartHeight,
        type: 'line',
        toolbar: { show: false },
        animations: { enabled: false },
      },
      stroke: { curve: 'straight', width: [0, 3] },
      plotOptions: { bar: { columnWidth: '40%', borderRadius: 6 } },
      xaxis: {
        type: 'category',
        categories: chartData.categories,
        labels: {
          rotate: -45,
          formatter: (val) => shortX(val),
          hideOverlappingLabels: true,
          trim: true,
          maxHeight: 60,
        },
        tickAmount,
      },
      yaxis: [
        {
          title: { text: metricLeftName },
          labels: { formatter: (v) => compactFormatter.format(Number(v || 0)) },
          min: 0,
        },
        {
          opposite: true,
          title: { text: metricRightName },
          labels: { formatter: (v) => compactFormatter.format(Number(v || 0)) },
          min: 0,
        },
      ],
      tooltip: {
        shared: true,
        x: { formatter: (val) => val },
        y: { formatter: (v) => Number(v || 0).toLocaleString() },
      },
      legend: { show: true, horizontalAlign: 'center', offsetY: 8 },
      colors: ['#7f56da', '#22c55e'],
      grid: { strokeDashArray: 4, yaxis: { lines: { show: true } } },
      markers: { size: 3 },
    }),
    [chartData.categories, chartHeight, metricLeftName, metricRightName, tickAmount, selectedRange],
  )

  // fetch and align series
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)

        const perfResp = await getPerformance(selectedRange).catch(() => null)
        const perfData = perfResp?.data ?? perfResp ?? null

        const [leftResp, rightResp] = await Promise.all([
          getPerformanceTrend(selectedRange, metricLeft).catch(() => null),
          getPerformanceTrend(selectedRange, metricRight).catch(() => null),
        ])

        const leftSeries = leftResp?.data?.series ?? leftResp?.series ?? []
        const rightSeries = rightResp?.data?.series ?? rightResp?.series ?? []

        let timeline = []
        if (leftSeries.length) timeline = leftSeries.map((s) => s.x)
        else if (rightSeries.length) timeline = rightSeries.map((s) => s.x)
        else {
          const days = selectedRange === '24h' ? 24 : selectedRange === '7d' ? 7 : selectedRange === '28d' ? 28 : 90
          const now = new Date()
          if (selectedRange === '24h') {
            timeline = Array.from({ length: days }, (_, i) => {
              const d = new Date(now.getTime() - (days - 1 - i) * 3600 * 1000)
              return `${d.toISOString().slice(0, 10)} ${String(d.getHours()).padStart(2, '0')}:00`
            })
          } else {
            timeline = Array.from({ length: days }, (_, i) => {
              const d = new Date(now.getTime() - (days - 1 - i) * 24 * 3600 * 1000)
              return d.toISOString().slice(0, 10)
            })
          }
        }

        const leftMap = new Map(leftSeries.map((s) => [s.x, Math.round(Number(s.y ?? s.value ?? s[metricLeft] ?? 0))]))
        const rightMap = new Map(rightSeries.map((s) => [s.x, Math.round(Number(s.y ?? s.value ?? s[metricRight] ?? 0))]))

        const leftData = timeline.map((t) => leftMap.get(t) ?? 0)
        const rightData = timeline.map((t) => rightMap.get(t) ?? 0)

        if (!mounted) return

        // ✅ Update both categories and series in ONE state call to prevent mismatch crash
        setChartData({
          categories: timeline,
          series: [
            { name: metricLeftName, type: 'bar', data: leftData },
            { name: metricRightName, type: 'line', data: rightData },
          ]
        })

        const totalLeft = leftData.reduce((s, v) => s + (Number(v) || 0), 0)
        const totalRight = rightData.reduce((s, v) => s + (Number(v) || 0), 0)

        let ctr = null
        const metrics = perfData?.metrics ?? {}
        if (metrics?.ctr) ctr = metrics.ctr
        else {
          const ll = String(metricLeft).toLowerCase()
          const rr = String(metricRight).toLowerCase()
          if ((ll.includes('impress') && rr.includes('click')) || (rr.includes('impress') && ll.includes('click'))) {
            if (ll.includes('impress')) ctr = totalRight > 0 && totalLeft > 0 ? (totalRight / totalLeft) * 100 : null
            else ctr = totalLeft > 0 && totalRight > 0 ? (totalLeft / totalRight) * 100 : null
          }
        }
        const avgPos = metrics?.averagePosition ?? metrics?.average_position ?? null

        setKpis({
          totalLeft,
          totalRight,
          ctr: ctr !== null && ctr !== undefined ? Number(ctr) : null,
          avgPosition: avgPos !== undefined ? Number(avgPos) : null,
        })
      } catch (err) {
        console.error('Performance load error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [selectedRange, metricLeft, metricRight])

  const onExport = async () => {
    try {
      const end = new Date()
      const days = selectedRange === '24h' ? 1 : selectedRange === '7d' ? 7 : selectedRange === '28d' ? 28 : 90
      const startDate = new Date(Date.now() - (days - 1) * 24 * 3600 * 1000)
      const startStr = startDate.toISOString().slice(0, 10)
      const endStr = end.toISOString().slice(0, 10)
      await downloadAnalyticsCsv({ start: startStr, end: endStr, dimensions: 'pagePath,date', metrics: `${metricLeft},${metricRight}` })
    } catch (e) {
      console.error('Export failed', e)
      alert('Export failed')
    }
  }

  const formatNumber = (n) => (n === null || n === undefined ? '-' : Number(n).toLocaleString())

  // make right column have minimum height so chart doesn't shrink too much
  const rightColStyle = { minHeight: Math.max(320, chartHeight - 20) }

  return (
    <Card>
      <CardBody className="p-0">
        <Row className="g-0">
          <Col lg={4} xs={12}>
            <div className="p-3 d-flex flex-column justify-content-between h-100">
              <CardTitle as="h5" className="mb-3 fw-semibold">
                Active users by device
              </CardTitle>

              {/* Donut Chart */}
              <div className="d-flex justify-content-center">
                <ReactApexChart
                  options={{
                    chart: {
                      height: 220,
                      type: 'donut',
                      fontFamily: 'inherit',
                    },
                    labels: deviceData.labels.length ? deviceData.labels : ['Desktop', 'Mobile', 'Tablet'],
                    colors: ['#2563EB', '#22C55E', '#F59E0B'],
                    legend: {
                      position: 'bottom',
                      fontSize: '12px',
                      markers: { radius: 10 },
                      itemMargin: { horizontal: 10, vertical: 4 },
                    },
                    dataLabels: { enabled: false },
                    tooltip: {
                      y: {
                        formatter: (v) => `${v.toLocaleString()} users`,
                      },
                    },
                    plotOptions: {
                      pie: {
                        donut: {
                          size: '72%',
                          labels: {
                            show: true,
                            name: {
                              show: true,
                              fontSize: '12px',
                              color: '#6B7280',
                              offsetY: -4,
                            },
                            value: {
                              show: true,
                              fontSize: '20px',
                              fontWeight: 600,
                              color: '#111827',
                              formatter: (v) => Number(v).toLocaleString(),
                            },
                            total: {
                              show: true,
                              label: 'Total users',
                              fontSize: '12px',
                              color: '#6B7280',
                              formatter: () => totalDeviceUsers.toLocaleString(),
                            },
                          },
                        },
                      },
                    },
                  }}
                  series={deviceData.series.length ? deviceData.series : [0, 0, 0]}
                  height={220}
                  type="donut"
                  className="apex-charts mb-2 mt-n1"
                />
              </div>

              {deviceLoading && <p className="text-muted text-center small mt-1">Loading device analytics…</p>}

              {deviceError && <p className="text-warning text-center small mt-1">Analytics data unavailable</p>}

              {/* Device Breakdown */}
              <div className="mt-3 pt-2 border-top">
                {[
                  { label: 'Desktop', color: '#2563EB', value: deviceData.series[0] || 0 },
                  { label: 'Mobile', color: '#22C55E', value: deviceData.series[1] || 0 },
                  { label: 'Tablet', color: '#F59E0B', value: deviceData.series[2] || 0 },
                ].map((item, idx) => (
                  <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: item.color,
                        }}
                      />
                      <span className="text-muted small">{item.label}</span>
                    </div>
                    <span className="fw-semibold">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          <Col lg={8} xs={12} className="border-start" style={rightColStyle}>
            <div className="p-1 p-lg-3 d-flex flex-column h-100">
              <div className="d-flex justify-content-between align-items-start align-items-md-center">
                <CardTitle as={'h5'}>Performance</CardTitle>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  {/* <Button variant="outline-light" size="sm" onClick={onExport}>
                    EXPORT
                  </Button> */}
                  {RANGES.map((r) => (
                    <Button
                      key={r.key}
                      variant={selectedRange === r.key ? 'primary' : 'outline-light'}
                      size="sm"
                      onClick={() => setSelectedRange(r.key)}
                      className="me-1">
                      {r.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="d-flex gap-3 mt-3 align-items-center">
                <div className="alert alert-info mb-0" style={{ minWidth: 200 }}>
                  {loading ? 'Loading performance...' : 'Performance overview (auto-updates when available).'}
                </div>

                {/* <div className="ms-auto d-flex gap-4 align-items-center">
                  <div className="text-muted text-end">
                    <div style={{ fontSize: 12 }}>CTR</div>
                    <div style={{ fontWeight: 700 }}>{kpis.ctr !== null ? `${Number(kpis.ctr).toFixed(2)}%` : "-"}</div>
                  </div>
                  <div className="text-muted text-end">
                    <div style={{ fontSize: 12 }}>Avg position</div>
                    <div style={{ fontWeight: 700 }}>{kpis.avgPosition !== null ? Number(kpis.avgPosition).toFixed(1) : "-"}</div>
                  </div>
                </div> */}
              </div>

              <div className="mt-3 flex-grow-1 d-flex flex-column">
                {!loading && chartData.categories.length > 0 ? (
                  <ReactApexChart 
                    options={chartOptions} 
                    series={chartData.series} 
                    height={chartHeight} 
                    type="line" 
                    className="apex-charts" 
                  />
                ) : (
                  <div className="flex-centered flex-grow-1" style={{ minHeight: 200 }}>
                    {loading ? (
                      <div className="text-center">
                        <Spinner animation="border" variant="primary" className="mb-2" />
                        <p className="text-muted small">Fetching analytics data...</p>
                      </div>
                    ) : (
                      <div className="text-center text-muted">
                        <IconifyIcon icon="bx:bar-chart-alt-2" className="fs-48 mb-2 opacity-25" />
                        <p>No data available for this period</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default Conversions
