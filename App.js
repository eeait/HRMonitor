import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import styles from "./src/styles"
import RecordingService from "./src/RecordingService"
import DataList from "./src/components/DataList"
import DataStorage from "./src/dataStorage"

const App = () => {
  const { acceleration, recording, startRecording } =
    RecordingService()
  const dataStorage = new DataStorage("accelerometerData")

  const renderButton = (onPress, text, buttonStyle) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, buttonStyle]}
    >
      <Text>{text}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Accelerometer: (in gs where 1g = 9.81 m/s^2)
      </Text>
      <Text style={styles.text}>x: {acceleration.x}</Text>
      <Text style={styles.text}>y: {acceleration.y}</Text>
      <Text style={styles.text}>z: {acceleration.z}</Text>
      <View style={styles.buttonContainer}>
        {renderButton(
          () => startRecording(3000),
          "Record",
          styles.recordButton
        )}
        {renderButton(
          dataStorage.clearData,
          "Clear Data",
          styles.clearButton
        )}
      </View>
      <Text style={styles.text}>
        {recording ? "RECORDING" : "Not recording"}
      </Text>
      <DataList />
    </View>
  )
}

export default App
