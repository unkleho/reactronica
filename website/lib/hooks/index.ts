import React from 'react';

/**
 * Call function on key press
 * https://github.com/jacobbuck/react-use-keypress/blob/master/src/index.js
 */
export function useKeyPress(targetKey, handler) {
  const targetKeyRef = useLatest(targetKey);
  const handlerRef = useLatest(handler);

  // Add event listeners
  React.useEffect(() => {
    const upHandler = ({ key }) => {
      if (key === targetKeyRef.current) {
        handlerRef.current();
      }
    };

    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
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
