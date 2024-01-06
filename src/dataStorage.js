/* eslint-disable class-methods-use-this */
import AsyncStorage from "@react-native-async-storage/async-storage"

class DataStorage {
  static instance = null

  constructor(namespace = "measurement") {
    // Make this a singleton class, there were some issues with multiple instances
    if (DataStorage.instance) {
      // eslint-disable-next-line no-constructor-return
      return DataStorage.instance
    }

    this.namespace = namespace

    // These are set elsewhere.
    // They are called when data is added, removed, or cleared.
    // This approach is used for updating the UI when data changes.
    this.onMeasurementAdded = null
    this.onMeasurementRemoved = null
    this.onClearMeasurements = null

    DataStorage.instance = this
  }

  async addMeasurement(newMeasurement) {
    // The key is the timestamp of the first data point in the measurement
    await AsyncStorage.setItem(
      `${newMeasurement[0].timestamp}`,
      JSON.stringify(newMeasurement)
    )

    if (this.onMeasurementAdded) {
      this.onMeasurementAdded(newMeasurement)
    }
  }

  async getMeasurement(timestamp) {
    const rawMeasurement = await AsyncStorage.getItem(timestamp)
    return JSON.parse(rawMeasurement)
  }

  async getMeasurements() {
    const keys = await AsyncStorage.getAllKeys()
    const rawMeasurements = await AsyncStorage.multiGet(keys)
    return rawMeasurements.map(([, value]) => JSON.parse(value))
  }

  async getKeys() {
    const keys = await AsyncStorage.getAllKeys()
    return keys
  }

  async removeMeasurement(timestamp) {
    await AsyncStorage.removeItem(`${timestamp}`)

    if (this.onMeasurementRemoved) {
      this.onMeasurementRemoved(timestamp)
    }
  }

  async clearMeasurements() {
    console.log("CLEARING ALL")
    await AsyncStorage.clear()

    if (this.onClearMeasurements) {
      this.onClearMeasurements()
    }
  }
}

export default DataStorage
