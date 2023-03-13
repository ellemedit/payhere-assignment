"use client";

import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay: number = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (value === debouncedValue) {
      return;
    }
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(timerId);
    };
  }, [value, debouncedValue, delay]);

  return debouncedValue;
}
