import React from 'react';

/**
 * Call function on key press
 * https://github.com/jacobbuck/react-use-keypress/blob/master/src/index.js
 */
export function useKeyPress(
  targetKey: string,
  upHandler?: (event: KeyboardEvent) => void,
  downHandler?: (event: KeyboardEvent) => void,
) {
  const targetKeyRef = useLatest(targetKey);
  const upHandlerRef = useLatest(upHandler);
  const downHandlerRef = useLatest(downHandler);

  // Add event listeners
  React.useEffect(() => {
    const keyUpHandler = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === targetKeyRef.current) {
        upHandlerRef.current(event);
      }
    };

    const keyDownHandler = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === targetKeyRef.current) {
        downHandlerRef.current(event);
      }
    };

    if (typeof upHandler === 'function') {
      window.addEventListener('keyup', keyUpHandler);
    }

    if (typeof downHandler === 'function') {
      window.addEventListener('keydown', keyDownHandler);
    }
    // Remove event listeners on cleanup
    return () => {
      if (typeof upHandler === 'function') {
        window.removeEventListener('keyup', keyUpHandler);
      }

      if (typeof downHandler === 'function') {
        window.addEventListener('keydown', keyDownHandler);
      }
    };
  }, []);
}

/**
 * A React hook that updates useRef().current with the most recent value each invocation
 * https://github.com/jaredLunde/react-hook/blob/master/packages/latest/src/index.tsx
 */
const useLatest = <T extends any>(current: T) => {
  const storedValue = React.useRef(current);
  React.useEffect(() => {
    storedValue.current = current;
  });
  return storedValue;
};

export default useLatest;
