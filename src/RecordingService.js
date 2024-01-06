import { useState, useEffect } from "react"
import { Accelerometer } from "expo-sensors"
import DataStorage from "./dataStorage"

const RecordingService = () => {
  const [recording, setRecording] = useState(false)
  const [recordedData, setRecordedData] = useState([])
  const [shouldSave, setShouldSave] = useState(false)

  const interval = 10 // ms, 10 is the minimum
  const duration = 10000 // ms

  const setUpdateIntervalAfterDelay = async (updateInterval) => {
    /* There might be a bug in expo-sensors, and this is a workaround function.
    Basically, if we just call setUpdateInterval inside subscribe, it doesn't work.
    What this function does is call setUpdateInterval after 1 millisecond. 
    Not clean I think but this is how we do it now. */
    await new Promise((resolve) => {
      setTimeout(resolve, 1)
    })
    Accelerometer.setUpdateInterval(updateInterval)
  }

  // Listener function for accelerometer
  const listener = (data) => {
    setRecording((prevRecording) => {
      if (prevRecording) {
        setRecordedData((prev) => [
          ...prev,
          { ...data, timestamp: Date.now() },
        ])
      }
      return prevRecording
    })
  }

  const subscribe = (updateInterval) => {
    Accelerometer.addListener(listener)
    setUpdateIntervalAfterDelay(updateInterval)
    // not immediately because it doesn't work, idk why.
  }

  const unsubscribe = () => {
    Accelerometer.removeAllListeners()
  }

  const stopRecording = () => {
    unsubscribe()
    setRecording(false)
    setShouldSave(true)
    console.log("Recording stopped")
  }

  const startRecording = () => {
    console.log(`Start recording: ${duration} ms`)
    subscribe(interval)
    setRecordedData([])
    setRecording(true)
    // Stop recording after duration
    setTimeout(() => {
      stopRecording()
    }, duration)
  }

  useEffect(() => {
    if (shouldSave) {
      const dataStorage = new DataStorage("accelerometerData")
      dataStorage
        .addMeasurement(recordedData)
        .then(() => {
          console.log(
            `Data saved successfully. Recorded Data: ${JSON.stringify(
              recordedData[0]
            )} and ${recordedData.length - 1} more`
          )
        })
        .catch((error) => {
          console.error(`Failed to save data: ${error}`)
        })
      setShouldSave(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldSave])

  return { recording, startRecording }
}

export default RecordingService
