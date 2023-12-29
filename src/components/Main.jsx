import { StyleSheet, View } from "react-native"
import { useState } from "react"
import MeasurementList from "./MeasurementList"
import Accelerometer from "./Accelerometer"

const styles = StyleSheet.create({
  flexContainer: {
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  accelerometerContainer: {
    flex: 2,
  },
  listContainer: {
    flex: 3,
  },
})

const Main = ({ navigation }) => {
  const [refresh, setRefresh] = useState(0)

  return (
    <View style={styles.flexContainer}>
      <View style={styles.accelerometerContainer}>
        <Accelerometer setRefresh={setRefresh} />
      </View>
      <View style={styles.listContainer}>
        <MeasurementList key={refresh} navigation={navigation} />
      </View>
    </View>
  )
}

export default Main
