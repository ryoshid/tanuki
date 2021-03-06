import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { usePersistedState } from "./hooks/persistedState";
import { useClock } from "./hooks/clock";
import { timeDiff } from "./util/time";

type EventKind =
  | "Start"
  | "GoToBed"
  | "TryToSleep"
  | "WakeUp"
  | "GetUp"
  | "End";

const nextEventName: Readonly<{ [K in EventKind]: EventKind[] }> = {
  Start: ["GoToBed"],
  GoToBed: ["TryToSleep"],
  TryToSleep: ["WakeUp"],
  WakeUp: ["GetUp"],
  GetUp: ["End"],
  End: ["End"],
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

const defaultEvent: Event = {
  name: "Start",
  time_ms: { from: undefined, to: undefined },
  pressed: false,
  nextEvents: ["GoToBed"],
};

const App: React.FC = () => {
  const [events, setEvents] = usePersistedState("events", [defaultEvent]);
  const now = useClock();
  const currentEvent = events[events.length - 1];
  const handleEventPress = (nextEvent: EventKind) => {
    setEvents((prev) => {
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
  const rewindEvent = () => {
    setEvents((prev) => {
      const len = prev.length;
      if (len < 2) return prev;
      const rewindedEvent = prev[len - 2];
      return prev.slice(0, len - 2).concat({
        ...rewindedEvent,
        pressed: false,
        time_ms: { from: rewindedEvent.time_ms.from, to: undefined },
      });
    });
  };
  return (
    <View style={styles.container}>
      <Button
        title="Reset"
        onPress={() => {
          setEvents([defaultEvent]);
        }}
      />
      <Button title="Back" onPress={rewindEvent} />
      {events.map((ev, i) => (
        <View key={i}>
          {!ev.pressed
            ? ev.nextEvents.map((evName, j) =>
                evName !== "End" ? (
                  <Button
                    key={j}
                    title={evName}
                    onPress={() => handleEventPress(evName)}
                  />
                ) : (
                  <Text key={j}>end</Text>
                )
              )
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
        <View>
          <Text>
            {`${currentEvent.name}: ${new Date(currentEvent.time_ms.from)}`}
          </Text>
          {currentEvent.nextEvents[0] !== "End" && (
            <Text>
              Time elapsed: {timeDiff(new Date(currentEvent.time_ms.from), now)}
            </Text>
          )}
        </View>
      )}
      <Button title="log" onPress={() => console.log(events)} />
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
