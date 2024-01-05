/* eslint-disable class-methods-use-this */
import AsyncStorage from "@react-native-async-storage/async-storage"

class DataStorage {
  static instance = null

  constructor(namespace = "measurement") {
    if (DataStorage.instance) {
      // eslint-disable-next-line no-constructor-return
      return DataStorage.instance
    }

    this.namespace = namespace

    this.onMeasurementAdded = null
    this.onMeasurementRemoved = null
    this.onClearMeasurements = null

    DataStorage.instance = this
  }

  async addMeasurement(newMeasurement) {
    console.log("newMeasurement: ", newMeasurement)
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
