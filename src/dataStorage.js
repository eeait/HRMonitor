import AsyncStorage from "@react-native-async-storage/async-storage"

class DataStorage {
  constructor(namespace = "data") {
    this.namespace = namespace
  }

  async saveData(data) {
    try {
      const stringifiedData = JSON.stringify(data)
      await AsyncStorage.setItem(this.namespace, stringifiedData)
    } catch (error) {
      console.error("Failed to save data to storage", error)
    }
  }

  async getData() {
    try {
      const stringifiedData = await AsyncStorage.getItem(
        this.namespace
      )
      return JSON.parse(stringifiedData)
    } catch (error) {
      console.error("Failed to get data from storage", error)
      return null
    }
  }

  async clearData() {
    try {
      await AsyncStorage.removeItem(this.namespace)
    } catch (error) {
      console.error("Failed to clear data from storage", error)
    }
  }
}

export default DataStorage
