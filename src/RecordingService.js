import { useState, useEffect } from "react"
import { Accelerometer } from "expo-sensors"
import DataStorage from "./dataStorage"

const RecordingService = () => {
  const [acceleration, setAcceleration] = useState({
    x: 0,
    y: 0,
    z: 0,
  })
  const [recording, setRecording] = useState(false)
  const [recordedData, setRecordedData] = useState([])
  const [shouldSave, setShouldSave] = useState(false)

  const setUpdateIntervalAfterDelay = async (interval) => {
    /* There's probably a bug in expo-sensors, and this is a workaround function.
    Basically, if we just call setUpdateInterval in subscribe, it doesn't work.
    What this function does is call setUpdateInterval after 1 millisecond. 
    Not clean I think but this is how we do it now. */
    await new Promise((resolve) => {
      setTimeout(resolve, 1)
    })
    Accelerometer.setUpdateInterval(interval)
  }

  const listener = (data) => {
    setAcceleration(data)
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

  const subscribe = (interval) => {
    Accelerometer.addListener(listener)
    setUpdateIntervalAfterDelay(interval) // not immediately because it doesn't work, idk why.
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
    subscribe(1000)
    setRecordedData([])
    setRecording(true)
    setTimeout(() => {
      stopRecording()
    }, duration)
  }

  useEffect(() => {
    if (shouldSave) {
      const dataStorage = new DataStorage("accelerometerData")
      console.log("Trying to save data...")
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
  }, [shouldSave, recordedData])

  return { acceleration, recording, startRecording }
}

export default RecordingService
