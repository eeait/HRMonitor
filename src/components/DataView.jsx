import { View, StyleSheet, Text } from "react-native"
import { Chart, Line } from "react-native-responsive-linechart"
import { useMemo } from "react"
import {
  calculateHeartFrequency,
  calculateMovingAverage,
  adjustTimestamps,
} from "../utils/mathUtils"
import BeatingHeart from "./BeatingHeart"

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bpmText: {
    textAlign: "center",
    fontSize: 36,
  },
  chart: {
    height: 100,
    width: "100%",
  },
})

const DataView = ({ recording }) => {
  // Process and filter the data to only include every 10th point,
  // for a smoother chart
  const chartData = calculateMovingAverage(
    adjustTimestamps(recording)
  ).filter((_, index) => index % 10 === 0)

  // This is a lot of work, so it's only done once
  const heartFrequency = useMemo(
    () => calculateHeartFrequency(recording),
    [recording]
  )

  // Calculate the domain for the chart
  const xValues = chartData.map((point) => point.x)
  const yValues = chartData.map((point) => point.y)
  const xMin = Math.min(...xValues)
  const xMax = Math.max(...xValues)
  const yMin = Math.min(...yValues)
  const yMax = Math.max(...yValues)
  const yRange = yMax - yMin

  const xDomain = {
    min: xMin,
    max: xMax,
  }
  const yDomain = {
    min: yMin - 0.1 * yRange,
    max: yMax + 0.1 * yRange,
  }

  return (
    <View style={styles.container}>
      <BeatingHeart frequency={heartFrequency} />
      <Text style={styles.bpmText}>{`${Math.round(
        60 * heartFrequency
      )} bpm`}</Text>
      <View style={{ flex: 1, flexDirection: "column-reverse" }}>
        {chartData.length > 1 && (
          <Chart
            style={styles.chart}
            xDomain={xDomain}
            yDomain={yDomain}
          >
            <Line
              data={chartData}
              theme={{ stroke: { color: "red", width: 3 } }}
              smoothing="bezier"
            />
          </Chart>
        )}
      </View>
    </View>
  )
}

export default DataView
