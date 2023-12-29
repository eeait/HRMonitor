/* eslint-disable class-methods-use-this */
import AsyncStorage from "@react-native-async-storage/async-storage"

class DataStorage {
  constructor(namespace = "measurement") {
    this.namespace = namespace
  }

  async addMeasurement(newMeasurement) {
    await AsyncStorage.setItem(
      `${newMeasurement[0].timestamp}`,
      JSON.stringify(newMeasurement)
    )
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
  }

  async clearMeasurements() {
    console.log("CLEARING ALL")
    await AsyncStorage.clear()
  }
}

export default DataStorage
