import React from 'react';

/**
 * Call function on key press
 */
export function useKeyPress(targetKey, callback) {
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      callback();
    }
  };

  // Add event listeners
  React.useEffect(() => {
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
}
