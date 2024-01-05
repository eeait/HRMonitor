import { useEffect, useState } from "react"
import { Text, View } from "react-native"
import {
  Chart,
  Line,
  VerticalAxis,
  HorizontalAxis,
} from "react-native-responsive-linechart"
import {
  calculateFFT,
  calculateHeartFrequency,
  calculateMovingAverage,
  adjustTimestamps,
} from "../utils/mathUtils"

const DataView = ({ recording }) => {
  const [chartData, setChartData] = useState([{ x: 0, y: 0 }])
  const [fftData, setFftData] = useState([{ x: 0, y: 0 }])
  const [heartFrequency, setHeartFrequency] = useState(0)

  useEffect(() => {
    if (recording && recording.length > 0) {
      const movingAverageData = calculateMovingAverage(
        adjustTimestamps(recording)
      )
      setChartData(movingAverageData)

      const fftResult = calculateFFT(movingAverageData, 100)
      setFftData(fftResult)

      setHeartFrequency(calculateHeartFrequency(recording))
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
