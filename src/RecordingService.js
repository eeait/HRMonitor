import { useState, useEffect } from "react"
import AccelerometerService from "./AccelerometerService"

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
        console.log("Data being recorded: ", data)
        setRecordedData((prev) => [
          ...prev,
          { ...data, timestamp: Date.now() },
        ])
      }
      return prevRecording
    })
  }

  useEffect(() => {
    subscribe(listener)
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
      console.log("Recorded Data:", recordedData)
      // Save or process recordedData as needed
      setShouldLogData(false) // Reset the flag
    }
  }, [shouldLogData, recordedData])

  return { acceleration, recording, startRecording }
}

export default RecordingService
