import { View, Text, StyleSheet } from "react-native"
import RecordingService from "../RecordingService"
import DataStorage from "../dataStorage"
import Button from "./Button"
import { RECORDING_DURATION } from "./constants"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  dataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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

const Accelerometer = ({ setRefresh }) => {
  const { acceleration, recording, startRecording } =
    RecordingService()
  const dataStorage = new DataStorage("accelerometerData")

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acceleration (g):</Text>
      <View style={styles.dataContainer}>
        <Text style={styles.data}>
          x: {Number(acceleration.x).toFixed(5)}
        </Text>
        <Text style={styles.data}>
          y: {Number(acceleration.y).toFixed(5)}
        </Text>
        <Text style={styles.data}>
          z: {Number(acceleration.z).toFixed(5)}
        </Text>
      </View>

      <Button
        style={[
          recording
            ? styles.buttonRecording
            : styles.buttonNotRecording,
        ]}
        onPress={() => startRecording(RECORDING_DURATION)}
        disabled={recording}
        title="Record"
      />
      <Button
        onPress={() => setRefresh(Date.now())}
        title="Refresh"
      />
      <Button
        style={styles.buttonClear}
        onPress={() => {
          dataStorage.clearMeasurements()
          setRefresh(Date.now())
        }}
        title="Clear"
      />
    </View>
  )
}

export default Accelerometer
