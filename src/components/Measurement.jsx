import React from "react"
import { View, Text } from "react-native"

const Measurement = ({ route }) => {
  const { item } = route.params

  return (
    <View>
      <Text>{`Measurement on ${new Date(
        item[0].timestamp
      ).toLocaleString()}`}</Text>
      <Text>And other data</Text>
    </View>
  )
}

export default Measurement
