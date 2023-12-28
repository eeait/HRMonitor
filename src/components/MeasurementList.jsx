import React, { useEffect, useState } from "react"
import { View, Text, ScrollView, StyleSheet } from "react-native"
import DataStorage from "../dataStorage"

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#F5F5F5",
  },
  item: {
    backgroundColor: "#FFFFFF",
    padding: 10, // Reduced padding to make items slimmer
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    // Removed shadow properties
  },
  text: {
    fontSize: 16,
  },
})

const MeasurementList = () => {
  const [data, setData] = useState([])
  const dataStorage = new DataStorage("accelerometerData")

  useEffect(() => {
    dataStorage
      .getMeasurements()
      .then((retrievedData) => {
        if (retrievedData) {
          setData(retrievedData)
        }
      })
      .catch((error) => {
        console.error(`Failed to retrieve data: ${error}`)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScrollView style={styles.scrollView}>
      {data.map((item) => (
        <View key={item[0].timestamp} style={styles.item}>
          <Text style={styles.text}>
            {`Measurement on ${new Date(
              item[0].timestamp
            ).toLocaleString()}`}
          </Text>
        </View>
      ))}
    </ScrollView>
  )
}

export default MeasurementList
