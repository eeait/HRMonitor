import { useEffect, useState } from "react"
import { Text, View } from "react-native"
import {
  Chart,
  Line,
  VerticalAxis,
  HorizontalAxis,
} from "react-native-responsive-linechart"
import { fft } from "fft-js"

const DataView = ({ recording }) => {
  const [chartData, setChartData] = useState([{ x: 0, y: 0 }])
  const [fftData, setFftData] = useState([{ x: 0, y: 0 }]) // separate state for fftData
  const [heartFrequency, setHeartFrequency] = useState(0) // separate state for heartFrequency

  const calculateTotalAcceleration = (dataPoint) => {
    const { x, y, z } = dataPoint
    return Math.sqrt(x * x + y * y + z * z)
  }

  const calibrateData = (data) => {
    const meanY =
      data.reduce((sum, point) => sum + point.y, 0) / data.length
    return data.map((point) => ({
      x: point.x,
      y: Math.abs(point.y - meanY),
    }))
  }

  const calculateMovingAverage = (data, windowSize) => {
    const calibratedData = calibrateData(data)
    const window = Array(windowSize).fill(1 / windowSize)
    const movingAverageData = calibratedData
      .map((_, i, arr) => {
        const windowData = arr.slice(i - windowSize + 1, i + 1)
        if (windowData.length === windowSize) {
          const convolvedValue = windowData.reduce(
            (sum, point, j) => sum + point.y * window[j],
            0
          )
          return { x: calibratedData[i].x, y: convolvedValue }
        }
        return null
      })
      .filter(Boolean)
    return movingAverageData
  }

  const padToPowerOfTwo = (data) => {
    let power = 1
    while (power < data.length) power *= 2
    power *= 8 // Pad more zeroes

    return [...data, ...new Array(power - data.length).fill(0)]
  }

  const findSpike = (data) => {
    let maxPoint = data[0]
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < data.length; i++) {
      if (data[i].y > maxPoint.y) {
        maxPoint = data[i]
      }
    }
    return maxPoint.x
  }
  const subtractMean = (data) => {
    const mean =
      data.reduce((sum, point) => sum + point.y, 0) / data.length
    return data.map((point) => ({ x: point.x, y: point.y - mean }))
  }

  const calculateFFT = (data, sampleRate) => {
    if (data.length === 0) {
      return [{ x: 0, y: 0 }] // Return default value
    }

    const pow2 = Math.ceil(Math.log2(data.length))

    const fftInput = padToPowerOfTwo(
      subtractMean(data).map((p) => p.y),
      pow2
    )

    // Convert to complex array format expected by fft-js
    const fftInputComplex = fftInput.map((value) => [value, 0])

    const fftOutput = fft(fftInputComplex)

    // Convert from complex output to magnitude and keep only first half
    const result = fftOutput
      .slice(0, fftOutput.length / 2)
      .map(([re, im], i) => ({
        x: (i * sampleRate) / fftInput.length, // Convert x to Hz
        y: Math.sqrt(re * re + im * im),
      }))

    return result
  }

  useEffect(() => {
    if (recording && recording.length > 0) {
      const firstTimestamp = recording[0].timestamp
      const transformedData = recording.map((dataPoint) => ({
        x: (dataPoint.timestamp - firstTimestamp) / 1000,
        y: calculateTotalAcceleration(dataPoint),
      }))
      const movingAverageData = calculateMovingAverage(
        transformedData,
        50
      )
      setChartData(movingAverageData)

      const fftResult = calculateFFT(movingAverageData, 100)
      setHeartFrequency(findSpike(fftResult))
      console.log(fftResult)
      setFftData(fftResult)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording])

  const xValues = chartData.map((point) => point.x)
  const yValues = chartData.map((point) => point.y)

  const xDomain = {
    min: Math.min(...xValues),
    max: Math.max(...xValues),
  }
  const yDomain = {
    min: Math.min(...yValues),
    max: Math.max(...yValues),
  }

  return (
    <View>
      <Text>{Math.round(heartFrequency * 60)} bpm</Text>
      {chartData.length > 1 && (
        <Chart
          style={{
            height: 200,
            width: "100%",
          }}
          xDomain={xDomain}
          yDomain={yDomain}
          padding={{ left: 40, top: 30, bottom: 30, right: 40 }}
        >
          <Line
            data={chartData}
            smoothing="none"
            theme={{ stroke: { color: "red", width: 1 } }}
          />
          <VerticalAxis tickValues={[0.95, 1, 1.05]} />
          <HorizontalAxis tickCount={3} />
        </Chart>
      )}
      {fftData.length > 1 && (
        <Chart
          style={{
            height: 200,
            width: "100%",
          }}
          // xDomain={{ min: 0, max: 5 }}
          // yDomain={{ min: 0, max: 0.01 }}
          xDomain={{
            min: Math.min(...fftData.map((point) => point.x)),
            max: Math.max(...fftData.map((point) => point.x)) / 40,
          }}
          yDomain={{
            min: Math.min(...fftData.map((point) => point.y)),
            max: Math.max(...fftData.map((point) => point.y)),
          }}
          padding={{ left: 40, top: 30, bottom: 30, right: 40 }}
        >
          <Line
            data={fftData}
            smoothing="none"
            theme={{ stroke: { color: "blue", width: 1 } }}
          />
          <VerticalAxis tickCount={3} />
          <HorizontalAxis
            tickCount={5}
            tickValues={[heartFrequency]}
          />
        </Chart>
      )}
    </View>
  )
}

export default DataView
