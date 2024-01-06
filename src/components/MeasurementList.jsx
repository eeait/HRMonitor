import React, { useEffect, useMemo, useState } from "react"
import {
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from "react-native"
import DataStorageContext from "../dataStorageContext"
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
  centeredText: {
    textAlign: "center", // Center the text horizontally
    marginTop: "50%", // Push the text down to the middle of the container
  },
})

const MeasurementList = ({ navigation }) => {
  const dataStorage = new DataStorage("accelerometerData")
  const [measurements, setMeasurements] = useState([])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateMeasurements = async () => {
    dataStorage
      .getKeys()
      .then((keys) => {
        if (keys) {
          setMeasurements(keys.map((key) => Number(key)))
        }
      })
      .catch((error) => {
        console.error(`Failed to retrieve data: ${error}`)
      })
  }

  useEffect(() => {
    updateMeasurements()

    // Subscribe to changes in the data storage

    dataStorage.onMeasurementAdded = (newMeasurement) => {
      // When a new measurement is added:
      const newTimestamp = Number(newMeasurement[0].timestamp)
      setMeasurements((prevMeasurements) => [
        ...prevMeasurements,
        newTimestamp,
      ])
      Vibration.vibrate()
      navigation.navigate("Measurement", {
        item: newTimestamp,
      })
    }

    dataStorage.onMeasurementRemoved = (removedMeasurement) => {
      // When a measurement is removed:
      setMeasurements((prevMeasurements) =>
        prevMeasurements.filter(
          (measurement) => measurement !== removedMeasurement
        )
      )
    }

    dataStorage.onClearMeasurements = () => {
      // When all measurements are cleared:
      setMeasurements([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // A context value to be passed to the context provider
  const contextValue = useMemo(
    () => ({ measurements, updateMeasurements }),
    [measurements, updateMeasurements]
  )

  return (
    <DataStorageContext.Provider value={contextValue}>
      <ScrollView style={styles.scrollView}>
        {measurements.length > 0 ? (
          measurements
            .sort((a, b) => b - a)
            .map((measurement) => (
              <TouchableOpacity
                key={measurement}
                style={styles.item}
                onPress={() =>
                  navigation.navigate("Measurement", {
                    item: measurement,
                  })
                }
              >
                <Text style={styles.text}>
                  {`Measurement on ${new Date(
                    measurement
                  ).toLocaleString()}`}
                </Text>
              </TouchableOpacity>
            ))
        ) : (
          <Text style={styles.centeredText}>
            No measurements available
          </Text>
        )}
      </ScrollView>
    </DataStorageContext.Provider>
  )
}

export default MeasurementList
