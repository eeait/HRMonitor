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
    justifyContent: "space-between",
  },
  buttonRed: {
    backgroundColor: "red",
    width: "100%",
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
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
      <DataView recording={recording} />
      <Text style={styles.text}>{`Measured on ${new Date(
        item
      ).toLocaleString()}`}</Text>
      <View style={{ flexDirection: "column-reverse" }}>
        <Button
          title="Delete Measurement"
          onPress={removeMeasurement}
          style={styles.buttonRed}
        />
      </View>
    </View>
  )
}

export default Measurement
