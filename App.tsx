import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const MS_S = 1000;
const MS_M = MS_S * 60;
const MS_H = MS_M * 60;

const timeDiff = (from: Date, to: Date): string => {
  if (from.getTime() > to.getTime()) return "0:0:0";
  const diff = to.getTime() - from.getTime();
  const hour = Math.floor(diff / MS_H);
  const minute = Math.floor((diff - hour * MS_H) / MS_M);
  const second = Math.floor((diff - (hour * MS_H + minute * MS_M)) / MS_S);
  return `${hour}:${minute}:${second}`;
};

export default function App() {
  const [pressedTime, setPressedTime] = useState<undefined | Date>(undefined);
  const [now, setNow] = useState(new Date());
  const handlePress = () => {
    setPressedTime(new Date());
  };
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <View style={styles.container}>
      <Button title="Press Me" onPress={handlePress} />
      <Text>{pressedTime ? pressedTime.toString() : "Never Pressed"}</Text>
      {pressedTime && <Text>Time elapsed: {timeDiff(pressedTime, now)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
