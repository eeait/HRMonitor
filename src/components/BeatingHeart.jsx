import React, { useEffect, useRef } from "react"
import { Animated, Easing, View, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    margin: 50,
  },
})

// A heart that beats at a given frequency (Hz)
const BeatingHeart = ({ frequency }) => {
  const scaleAnimation = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // If the frequency is not a proper number, return null
    if (
      !frequency ||
      typeof frequency !== "number" ||
      frequency <= 0
    ) {
      return
    }

    const beatDuration = Math.round(1000 / frequency)

    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 0.7,
          duration: beatDuration / 2,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: beatDuration / 2,
          easing: Easing.cubic,
          useNativeDriver: true,
        }),
      ]).start(() => startAnimation())
    }

    startAnimation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frequency])

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleAnimation }],
          },
        ]}
      >
        <Icon name="heart" size={120} color="red" />
      </Animated.View>
    </View>
  )
}

export default BeatingHeart
