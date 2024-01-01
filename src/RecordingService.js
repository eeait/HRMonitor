import { useState, useEffect, useRef } from "react"
import { Accelerometer } from "expo-sensors"
import DataStorage from "./dataStorage"
import { SUBSCRIBE_INTERVAL } from "./constants"

const RecordingService = () => {
  const [recording, setRecording] = useState(false)
  const [recordedData, setRecordedData] = useState([])
  const [shouldSave, setShouldSave] = useState(false)
  const batch = useRef([])

  const setUpdateIntervalAfterDelay = async (interval) => {
    /* There might be a bug in expo-sensors, and this is a workaround function.
    Basically, if we just call setUpdateInterval inside subscribe, it doesn't work.
    What this function does is call setUpdateInterval after 1 millisecond. 
    Not clean I think but this is how we do it now. */
    await new Promise((resolve) => {
      setTimeout(resolve, 1)
    })
    Accelerometer.setUpdateInterval(interval)
  }

  // Listener function for accelerometer
  const listener = (data) => {
    setRecording((prevRecording) => {
      if (prevRecording) {
        // Implement batching
        batch.current.push({ ...data, timestamp: Date.now() })
        if (batch.current.length >= 20) {
          setRecordedData((prev) => [...prev, ...batch.current])
          batch.current = []
        }
      }
      return prevRecording
    })
  }

  // Make sure to save data that is left in batch when recording stops
  useEffect(() => {
    if (!recording && batch.current.length > 0) {
      setRecordedData((prev) => [...prev, ...batch.current])
      batch.current = []
    }
  }, [recording])

  const subscribe = (interval) => {
    Accelerometer.addListener(listener)
    setUpdateIntervalAfterDelay(interval)
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

  const startRecording = (duration) => {
    console.log(`Start recording: ${duration} ms`)
    subscribe(SUBSCRIBE_INTERVAL)
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
