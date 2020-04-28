import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { usePersistedState } from "./hooks/persistedState";
import { useClock } from "./hooks/clock";
import { timeDiff } from "./util/time";

const App: React.FC = () => {
  const [pressedTimeMS, setPressedTime] = usePersistedState<undefined | number>(
    "pressed",
    undefined
  );
  const pressedTime = new Date(pressedTimeMS ?? 0);
  const now = useClock();
  const handlePress = () => {
    setPressedTime(new Date().getTime());
  };
  return (
    <View style={styles.container}>
      <Button title="Press Me" onPress={handlePress} />
      <Text>{pressedTimeMS ? pressedTime.toString() : "Never Pressed"}</Text>
      {pressedTimeMS && <Text>Time elapsed: {timeDiff(pressedTime, now)}</Text>}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
