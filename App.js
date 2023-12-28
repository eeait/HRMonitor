import React, { useState } from "react"
import { SafeAreaView, StyleSheet, View } from "react-native"
import MeasurementList from "./src/components/MeasurementList"
import Accelerometer from "./src/components/Accelerometer"

const styles = StyleSheet.create({
  flexContainer: {
    backgroundColor: "#F5F5F5",
    flex: 1
  },
  accelerometerContainer: {
    flex: 2
  },
  listContainer: {
    flex: 3,
  },
})

const App = () => {
  const [refresh, setRefresh] = useState(0)

  return (
    <SafeAreaView style={styles.flexContainer}>
      <View style={styles.accelerometerContainer}>
        <Accelerometer setRefresh={setRefresh} />
      </View>
      <View style={styles.listContainer}>
        <MeasurementList key={refresh} />
      </View>
    </SafeAreaView>
  )
}

export default App
