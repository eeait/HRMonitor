import React, { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import DataStorage from "../dataStorage"
import Button from "./Button"
import DataView from "./DataView"
import { replaceXYZWithTotal } from "../utils/mathUtils"

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
    { timestamp: 0, totalAcceleration: 0 },
  ])

  useEffect(() => {
    dataStorage
      .getMeasurement(String(item))
      .then((measurement) => {
        if (measurement !== null) {
          setRecording(replaceXYZWithTotal(measurement))
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
      <Button
        title="Remove Measurement"
        onPress={removeMeasurement}
        style={styles.buttonRed}
      />
      <DataView recording={recording} />
    </View>
  )
}

export default Measurement
