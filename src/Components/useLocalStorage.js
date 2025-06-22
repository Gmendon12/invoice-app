import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const getStoredValue = () => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (e) {
      console.error("Error parsing localStorage for", key, e);
      return initialValue;
    }
  };

  const [value, setValue] = useState(getStoredValue);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Error setting localStorage for", key, e);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
