import React, { useEffect, useState } from "react"
import {
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import DataStorage from "../dataStorage"

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#F5F5F5",
  },
  item: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
  },
})

const MeasurementList = ({ navigation }) => {
  const [timestamps, setTimestamps] = useState([])
  const dataStorage = new DataStorage("accelerometerData")

  useEffect(() => {
    dataStorage
      .getKeys()
      .then((keys) => {
        if (keys) {
          setTimestamps(keys.map((key) => Number(key)))
        }
      })
      .catch((error) => {
        console.error(`Failed to retrieve data: ${error}`)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScrollView style={styles.scrollView}>
      {timestamps.map((timestamp) => (
        <TouchableOpacity
          key={timestamp}
          style={styles.item}
          onPress={() =>
            navigation.navigate("Measurement", { item: timestamp })
          }
        >
          <Text style={styles.text}>
            {`Measurement on ${new Date(timestamp).toLocaleString()}`}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

export default MeasurementList
