import React from "react"
import { SafeAreaView } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import Main from "./src/components/Main"
import Measurement from "./src/components/Measurement"

const Stack = createStackNavigator()

const App = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Measurement" component={Measurement} />
      </Stack.Navigator>
    </NavigationContainer>
  </SafeAreaView>
)

export default App
