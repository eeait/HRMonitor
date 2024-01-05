import React, { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import DataStorage from "../dataStorage"
import Button from "./Button"
import { logCsv } from "../../utils"
import DataView from "./DataView"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonRed: {
    backgroundColor: "red",
  },
})

const Measurement = ({ route, navigation }) => {
  const { item } = route.params
  const dataStorage = new DataStorage("accelerometerData")
  const [recording, setRecording] = React.useState([
    { x: 0, y: 0, z: 0, timestamp: 0 },
  ])

  useEffect(() => {
    dataStorage
      .getMeasurement(String(item))
      .then((measurement) => {
        if (measurement !== null) {
          setRecording(measurement)
        } else {
          console.log("No measurement found for timestamp:", item)
        }
      })
      .catch((error) => {
        console.error(`Failed to retrieve data: ${error}`)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const removeMeasurement = async () => {
    await dataStorage.removeMeasurement(item)
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <Text>{`Measurement on ${new Date(
        item
      ).toLocaleString()}`}</Text>
      <Text>
        {`X: ${recording[0].x},`}
        {`\nY: ${recording[0].y},`}
        {`\nZ: ${recording[0].z},`}
        {`\nTimestamp: ${recording[0].timestamp}`}
      </Text>
      <Button
        title="Remove Measurement"
        onPress={removeMeasurement}
        style={styles.buttonRed}
      />
      <Button title="Log data" onPress={() => logCsv(recording)} />
      <DataView recording={recording} />
    </View>
  )
}

export default Measurement
