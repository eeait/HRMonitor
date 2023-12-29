import React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    backgroundColor: "blue",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
  },
})

const Button = ({ style, onPress, disabled, title }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
)

export default Button
