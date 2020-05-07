import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { usePersistedState } from "./hooks/persistedState";
import { useClock } from "./hooks/clock";
import { timeDiff } from "./util/time";

type EventKind = "Start" | "GoToBed" | "TryToSleep" | "WakeUp" | "GetUp";

const nextEventName: { [K in EventKind]: [EventKind] } = {
  Start: ["GoToBed"],
  GoToBed: ["TryToSleep"],
  TryToSleep: ["WakeUp"],
  WakeUp: ["GetUp"],
  GetUp: ["GetUp"],
};

type Event = {
  name: EventKind;
  time_ms: {
    from: number | undefined;
    to: number | undefined;
  };
  pressed: boolean;
  nextEvents: EventKind[];
};

type Events = Event[];

const defaultEvent: Event = {
  name: "Start",
  time_ms: { from: undefined, to: undefined },
  pressed: false,
  nextEvents: ["GoToBed"],
};

const App: React.FC = () => {
  const [pressedTimeMS, setPressedTime] = usePersistedState<undefined | number>(
    "pressed",
    undefined
  );
  const [events, setEvents] = usePersistedState("events", [defaultEvent]);
  const pressedTime = new Date(pressedTimeMS ?? 0);
  const now = useClock();
  const currentEvent = events[events.length - 1];
  const handlePress = () => {
    setPressedTime(new Date().getTime());
  };
  const handleEventPress = (nextEvent: EventKind) => {
    setEvents((prev) => {
      console.log(prev);
      const lastEvent = prev[prev.length - 1];
      const now_ms = new Date().getTime();
      return prev
        .slice(0, prev.length - 1)
        .concat({
          ...lastEvent,
          pressed: true,
          time_ms: { from: lastEvent.time_ms.from, to: now_ms },
        })
        .concat({
          ...defaultEvent,
          name: nextEvent,
          time_ms: { from: now_ms, to: undefined },
          nextEvents: nextEventName[nextEvent],
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
          {!ev.pressed
            ? ev.nextEvents.map((evName, j) => (
                <Button
                  key={j}
                  title={evName}
                  onPress={() => handleEventPress(evName)}
                />
              ))
            : ev.time_ms.from &&
              ev.time_ms.to && (
                <Text>
                  {`${ev.name}: ${timeDiff(
                    new Date(ev.time_ms.from),
                    new Date(ev.time_ms.to)
                  )}`}
                </Text>
              )}
        </View>
      ))}
      {currentEvent.time_ms.from && (
        <Text>
          Time elapsed: {timeDiff(new Date(currentEvent.time_ms.from), now)}
        </Text>
      )}
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
