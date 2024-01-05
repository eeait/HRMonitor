import { fft } from "fft-js"

// Calculates the total acceleration from the x, y, and z components
export const calculateTotalAcceleration = (x, y, z) =>
  Math.sqrt(x * x + y * y + z * z)

// Replaces the x, y, and z components with the total acceleration
export const replaceXYZWithTotal = (data) =>
  data.map((point) => ({
    timestamp: point.timestamp,
    totalAcceleration: calculateTotalAcceleration(
      point.x,
      point.y,
      point.z
    ),
  }))

// Adjusts the timestamps so that they start from zero
export const adjustTimestamps = (data) => {
  const firstTimestamp = data[0].timestamp
  return data.map((point) => ({
    x: point.timestamp - firstTimestamp,
    y: point.totalAcceleration,
  }))
}

// Converts y values to their absolute values
export const yAbs = (data) =>
  data.map((point) => ({ x: point.x, y: Math.abs(point.y) }))

// Subtracts the mean from each y value in the data
export const subtractMean = (data) => {
  const mean =
    data.reduce((sum, point) => sum + point.y, 0) / data.length
  return data.map((point) => ({ x: point.x, y: point.y - mean }))
}

// Calculates the moving average of the data
export const calculateMovingAverage = (data, windowSize = 50) => {
  const calibratedData = yAbs(subtractMean(data))
  const window = Array(windowSize).fill(1 / windowSize)
  const movingAverageData = calibratedData
    .map((_, i, arr) => {
      const windowData = arr.slice(i - windowSize + 1, i + 1)
      if (windowData.length === windowSize) {
        const convolvedValue = windowData.reduce(
          (sum, point, j) => sum + point.y * window[j],
          0
        )
        return { x: calibratedData[i].x, y: convolvedValue }
      }
      return null
    })
    .filter(Boolean)
  return movingAverageData
}

// Pads the data to a power of two
export const padToPowerOfTwo = (data, extraPadding = 0) => {
  let power = 1
  while (power < data.length) power *= 2

  // Double the final length extraPadding times
  let more = extraPadding
  while (more > 0) {
    power *= 2
    more -= 1
  }

  return [...data, ...new Array(power - data.length).fill(0)]
}

// Calculates the Fast Fourier Transform (FFT) of the data
// Frequency and magnitude are returned
export const calculateFFT = (data, sampleRate = 100) => {
  if (data.length === 0) {
    return [{ x: 0, y: 0 }] // Return default value
  }

  // Pad to power of two as required by fft-js
  const fftInput = padToPowerOfTwo(
    subtractMean(data).map((p) => p.y),
    3
  )

  // Convert to complex array format expected by fft-js
  const fftInputComplex = fftInput.map((value) => [value, 0])

  const fftOutput = fft(fftInputComplex)

  // Convert from complex output to magnitude and keep only first half
  const result = fftOutput
    .slice(0, fftOutput.length / 2)
    .map(([re, im], i) => ({
      x: (i * sampleRate) / fftInput.length, // Convert x to Hz
      y: Math.sqrt(re * re + im * im),
    }))

  return result
}

// Finds the x value of the maximum y value in the data
export const findSpikeX = (data) => {
  let maxPoint = data[0]
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < data.length; i++) {
    if (data[i].y > maxPoint.y) {
      maxPoint = data[i]
    }
  }
  return maxPoint.x
}

// Calculates the heart frequency from the recording (in Hz)
export const calculateHeartFrequency = (recording) => {
  const fromZero = adjustTimestamps(recording)
  const movingAverage = calculateMovingAverage(fromZero)
  const fftData = calculateFFT(movingAverage)
  const heartFrequency = findSpikeX(fftData)
  return heartFrequency
}
