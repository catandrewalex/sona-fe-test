/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import { useCallback, useRef } from "react";

/**
 * Create a debounce function that will memoize its value but not its content
 * @see https://stackoverflow.com/questions/59183495/cant-get-lodash-debounce-to-work-properly-executed-multiple-times-reac
 * @param callback the callback function
 * @param delay the delay for the debounce function
 * @returns memoized debounce function
 */
export const useDebouncedCallback = (
  callback: any,
  delay: number
): _.DebouncedFunc<(...args: any) => any> => {
  const callbackRef = useRef<any>();
  callbackRef.current = callback;
  return useCallback(
    _.debounce((...args) => callbackRef.current(...args), delay),
    []
  );
};
