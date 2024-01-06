// This file contains helper functions to log data in CSV format.
// These are used in development to log raw sensor data to the console.
// Mainly because it's easier to copy and paste from the console
// than to configure a debugger that can access asyncStorage. (I tried.)

// Helper function to calculate total
const calculateTotal = (row) =>
  Math.sqrt(row.x ** 2 + row.y ** 2 + row.z ** 2)

// Helper function to adjust timestamp
const adjustTimestamp = (timestamp, firstTimestamp) =>
  (timestamp - firstTimestamp) / 1000

// Helper function to format row as CSV
const formatRowAsCsv = (row) => Object.values(row).join(",")

const logCsv = (recording) => {
  const firstTimestamp = recording[0].timestamp
  const headers = "timestamp,x,y,z,total"

  const csvData = recording.map((row) => {
    const total = calculateTotal(row)
    const timestamp = adjustTimestamp(row.timestamp, firstTimestamp)
    const newRow = { timestamp, x: row.x, y: row.y, z: row.z, total } // specify order of fields
    return formatRowAsCsv(newRow)
  })

  console.log(`${headers}\n${csvData.join("\n")}`)
}

export default logCsv
