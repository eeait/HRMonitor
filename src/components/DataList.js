import React, { useEffect, useState } from "react"
import { View, Text, ScrollView } from "react-native"
import DataStorage from "../dataStorage"

const DataList = () => {
  const [data, setData] = useState([])
  const dataStorage = new DataStorage("accelerometerData")

  useEffect(() => {
    dataStorage
      .getData()
      .then((retrievedData) => {
        if (retrievedData) {
          setData(retrievedData)
        }
      })
      .catch((error) => {
        console.error(`Failed to retrieve data: ${error}`)
      })
  }, [])

  return (
    <ScrollView>
      
      {data.map((item, index) => (
        <View key={index}>
          <Text>x: {item.x}</Text>
          <Text>y: {item.y}</Text>
          <Text>z: {item.z}</Text>
          <Text>timestamp: {item.timestamp}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

export default DataList
