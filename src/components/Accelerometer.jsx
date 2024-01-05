import { View, Text, StyleSheet } from "react-native"
import RecordingService from "../RecordingService"
import DataStorage from "../dataStorage"
import Button from "./Button"

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  data: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonRecording: {
    backgroundColor: "gray",
  },
  buttonNotRecording: {
    backgroundColor: "orangered",
  },
  buttonClear: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
  },
})

const Accelerometer = () => {
  const { recording, startRecording } = RecordingService()
  const dataStorage = new DataStorage("accelerometerData")

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Measure Acceleration</Text>
      <Button
        style={[
          recording
            ? styles.buttonRecording
            : styles.buttonNotRecording,
        ]}
        onPress={() => startRecording()}
        disabled={recording}
        title="Record"
      />
      <Button
        style={styles.buttonClear}
        onPress={() => {
          dataStorage.clearMeasurements()
          // handleRefresh(Date.now())
        }}
        title="Clear"
      />
    </View>
  )
}

export default Accelerometer
