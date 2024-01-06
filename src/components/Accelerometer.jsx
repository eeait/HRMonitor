/* eslint-disable react/no-unescaped-entities */
import { View, Text, StyleSheet } from "react-native"
import { useState } from "react"
import RecordingService from "../RecordingService"
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

// eslint-disable-next-line no-unused-vars
const ClearButton = ({ clearMeasurements }) => (
  <Button
    style={styles.buttonClear}
    onPress={clearMeasurements}
    title="Clear"
  />
)

const Accelerometer = () => {
  // States for the button's conditional properties
  const { recording, startRecording } = RecordingService()
  const [starting, setStarting] = useState(false)

  const handleStartRecording = () => {
    setStarting(true)
    setTimeout(() => {
      startRecording()
      setStarting(false)
    }, 3000)
  }

  let buttonTitle = "Measure"
  if (starting) {
    buttonTitle = "Starting measurement"
  } else if (recording) {
    buttonTitle = "Measuring"
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Measure Resting Heart Rate</Text>
      <Text>
        Press "Measure" and place the phone on your chest. Remain
        still and relaxed for ten seconds. Breathe calmly.
      </Text>
      <Button
        style={[
          recording || starting
            ? styles.buttonRecording
            : styles.buttonNotRecording,
        ]}
        onPress={handleStartRecording}
        disabled={recording || starting}
        title={buttonTitle}
      />
    </View>
  )
}

export default Accelerometer
