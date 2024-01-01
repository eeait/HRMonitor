import { StyleSheet, View } from "react-native"
import React from "react"
import MeasurementList from "./MeasurementList"
import Accelerometer from "./Accelerometer"

const styles = StyleSheet.create({
  flexContainer: {
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  accelerometerContainer: {
    flex: 0,
  },
  listContainer: {
    flex: 1,
  },
})

const Main = ({ navigation }) => (
  // const [refresh, setRefresh] = useState(0)

  // const handleRefresh = (newRefresh) => {
  //   setRefresh(newRefresh)
  //   console.log("refreshed")
  // }

  <View style={styles.flexContainer}>
    <View style={styles.accelerometerContainer}>
      <Accelerometer />
    </View>
    <View style={styles.listContainer}>
      <MeasurementList navigation={navigation} />
    </View>
  </View>
)

export default Main
