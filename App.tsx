import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { usePersistedState } from "./hooks/persistedState";
import { useClock } from "./hooks/clock";
import { timeDiff } from "./util/time";

type Event = {
  name: string;
  time_ms: {
    from: number | undefined;
    to: number | undefined;
  };
  pressed: boolean;
};

type Events = Event[];

const defaultEvent: Event = {
  name: "test",
  time_ms: { from: undefined, to: undefined },
  pressed: false,
};

const App: React.FC = () => {
  const [pressedTimeMS, setPressedTime] = usePersistedState<undefined | number>(
    "pressed",
    undefined
  );
  const [events, setEvents] = usePersistedState("events", [defaultEvent]);
  const pressedTime = new Date(pressedTimeMS ?? 0);
  const now = useClock();
  const lastEvent = events[events.length - 1];
  const handlePress = () => {
    setPressedTime(new Date().getTime());
  };
  const handleEventPress = () => {
    setEvents((prev) => {
      console.log(prev);
      const from = prev[prev.length - 1].time_ms.from;
      const now_ms = new Date().getTime();
      return prev
        .slice(0, prev.length - 1)
        .concat({
          ...defaultEvent,
          pressed: true,
          time_ms: { from, to: now_ms },
        })
        .concat({
          ...defaultEvent,
          time_ms: { from: now_ms, to: undefined },
        });
    });
  };
  return (
    <View style={styles.container}>
      <Button
        title="Reset"
        onPress={() => {
          console.log(events);
          setEvents([defaultEvent]);
        }}
      />
      {events.map((ev, i) => (
        <View key={i}>
          {!ev.pressed ? (
            <Button title="Press" onPress={() => handleEventPress()} />
          ) : (
            ev.time_ms.from &&
            ev.time_ms.to && (
              <Text>
                {timeDiff(new Date(ev.time_ms.from), new Date(ev.time_ms.to))}
                since pressed
              </Text>
            )
          )}
        </View>
      ))}
      {lastEvent.time_ms.from && (
        <Text>
          Time elapsed: {timeDiff(new Date(lastEvent.time_ms.from), now)}
        </Text>
      )}
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
  event: {
    padding: 10,
  },
});
