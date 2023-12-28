import { useState, useEffect } from "react"
import AccelerometerService from "./AccelerometerService"
import DataStorage from "./dataStorage"

const RecordingService = () => {
  const { subscribe, unsubscribe } = AccelerometerService()

  // eslint-disable-next-line no-unused-vars
  const [acceleration, setAcceleration] = useState({
    x: 0,
    y: 0,
    z: 0,
  })
  const [recordedData, setRecordedData] = useState([])
  const [shouldLogData, setShouldLogData] = useState(false)
  const [recording, setRecording] = useState(false)

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

  useEffect(() => {
    subscribe(listener, 100)
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stopRecording = () => {
    setRecording(false)
    setShouldLogData(true)
    console.log("Recording stopped")
  }

  const startRecording = (duration) => {
    console.log(`Start recording: ${duration} ms`)
    setRecordedData([])
    setRecording(true)
    setTimeout(() => {
      stopRecording()
    }, duration)
  }

  useEffect(() => {
    if (shouldLogData) {
      const dataStorage = new DataStorage("accelerometerData")
      console.log("Trying to save data...")
      dataStorage
        .saveData(recordedData) // Save the recordedData array
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
      setShouldLogData(false) // Reset the flag
    }
  }, [shouldLogData, recordedData])

  return { acceleration, recording, startRecording }
}

export default RecordingService
