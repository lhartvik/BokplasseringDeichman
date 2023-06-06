import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAsyncStorage(key) {
  const [storedValue, setStoredValue] = useState([]);

  useEffect(() => {
    const load = async () => {
      await AsyncStorage.getItem(key)
        .then(item => (item ? item : '[]'))
        .then(JSON.parse)
        .then(setStoredValue);
    };
    load().catch(e =>
      console.log(`Error loading phone storage ${key}: ${e.message}`),
    );
  }, [key]);

  const save = async value => {
    await AsyncStorage.setItem(key, JSON.stringify(value))
      .then(() => setStoredValue(value))
      .catch(error => {
        console.log(`Error saving phone storage ${key}: ${error.message}`);
      });
  };

  const clear = async () => {
    await AsyncStorage.removeItem(key);
    setStoredValue([]);
  };

  return [storedValue, save, clear];
}
