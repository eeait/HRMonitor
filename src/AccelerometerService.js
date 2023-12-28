import { useState } from "react"
import { Accelerometer } from "expo-sensors"

const AccelerometerService = () => {
  const [subscription, setSubscription] = useState(null)

  const setUpdateInterval = (interval) => {
    Accelerometer.setUpdateInterval(interval)
  }

  const setUpdateIntervalAfterDelay = async (interval) => {
    /* There's probably a bug in expo-sensors, and this is a workaround function.
    Basically, if we just call setUpdateInterval in subscribe, it doesn't work.
    What this function does is call setUpdateInterval after 1 millisecond. 
    Not clean I think but this is how we do it now. */
    await new Promise((resolve) => {
      setTimeout(resolve, 1)
    })
    setUpdateInterval(interval)
  }

  const subscribe = (listener, interval) => {
    setSubscription(Accelerometer.addListener(listener))
    setUpdateIntervalAfterDelay(interval) // not immediately because it doesn't work, idk why.
  }

  const unsubscribe = () => {
    // eslint-disable-next-line no-unused-expressions
    subscription && subscription.remove()
    setSubscription(null)
  }

  // const toggleSubscription = () =>
  //   subscription ? unsubscribe() : subscribe()

  return { subscribe, unsubscribe }
}

export default AccelerometerService
