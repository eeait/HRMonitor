import React, { useEffect, useMemo, useState } from "react"
import {
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dataStorage.onMeasurementAdded = (newMeasurement) => {
      setMeasurements((prevMeasurements) => [
        ...prevMeasurements,
        Number(newMeasurement[0].timestamp),
      ])
    }
    dataStorage.onMeasurementRemoved = (removedMeasurement) => {
      console.log("Measurement removed in ML:", removedMeasurement)
      setMeasurements((prevMeasurements) =>
        prevMeasurements.filter(
          (measurement) => measurement !== removedMeasurement
        )
      )
    }
    dataStorage.onClearMeasurements = () => {
      setMeasurements([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const contextValue = useMemo(
    () => ({ measurements, updateMeasurements }),
    [measurements, updateMeasurements]
  )

  return (
    <DataStorageContext.Provider value={contextValue}>
      <ScrollView style={styles.scrollView}>
        {measurements
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
          ))}
      </ScrollView>
    </DataStorageContext.Provider>
  )
}

export default MeasurementList
