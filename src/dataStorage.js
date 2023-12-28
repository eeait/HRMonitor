import AsyncStorage from "@react-native-async-storage/async-storage"

class DataStorage {
  constructor(namespace = "data") {
    this.namespace = namespace
  }

  async addMeasurement(newMeasurement) {
    const currentData = await this.getMeasurements()
    const newData = [...currentData, newMeasurement]

    await AsyncStorage.setItem(
      `${this.namespace}:measurement`,
      JSON.stringify(newData)
    )
  }

  async getMeasurements() {
    const rawMeasurements = await AsyncStorage.getItem(
      `${this.namespace}:measurement`
    )
    return rawMeasurements ? JSON.parse(rawMeasurements) : []
  }

  async clearMeasurements() {
    console.log("CLEARING ALL")
    await AsyncStorage.removeItem(`${this.namespace}:measurement`)
  }
}

export default DataStorage
