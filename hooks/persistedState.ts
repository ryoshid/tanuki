import { useState, useEffect, SetStateAction } from "react";
import { AsyncStorage } from "react-native";

type PersistedState<T> = [T, React.Dispatch<SetStateAction<T>>];

export const usePersistedState = <T>(
  key: string,
  defaultValue: T
): PersistedState<T> => {
  const [state, setState] = useState(defaultValue);
  useEffect(() => {
    AsyncStorage.getItem(key).then(
      (value) => value && setState(JSON.parse(value) as T)
    );
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
};
