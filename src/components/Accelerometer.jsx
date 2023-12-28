import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import RecordingService from "../RecordingService"
import DataStorage from "../dataStorage"

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
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    backgroundColor: "blue",
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

      <TouchableOpacity
        style={[
          styles.button,
          recording
            ? styles.buttonRecording
            : styles.buttonNotRecording,
        ]}
        onPress={() => startRecording(3000)}
        disabled={recording}
      >
        <Text style={styles.buttonText}>Record</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setRefresh(Date.now())}
      >
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.buttonClear]}
        onPress={() => {
          dataStorage.clearMeasurements()
          setRefresh(Date.now())
        }}
      >
        <Text style={styles.buttonText}>Clear</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Accelerometer
