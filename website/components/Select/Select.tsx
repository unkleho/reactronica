import * as React from 'react';
import Select from 'react-select';

import css from './Select.module.scss';

type Props = {
  value?: string | number;
  options: { value: string | number; label: string | number }[];
  className?: string;
  onChange?: Function;
};

const SelectComponent: React.FunctionComponent<Props> = ({
  value,
  options,
  className,
  onChange,
}) => {
  return (
    <Select
      // menuIsOpen={true}
      value={options.find((option) => option.value === value)}
      options={options}
      className={[css.select, className || ''].join(' ')}
      classNamePrefix={'react-select'}
      onChange={(selectedOption) => {
        if (typeof onChange === 'function') {
          onChange(selectedOption);
        }
      }}
    />
  );
};

// Need to compare options array by stringifying first, as array comparisons
// always equal false, even when the values are the same.
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options) &&
    prevProps.className === nextProps.className
  );
};

// Memo is required to prevent React Select from re-rendering
// and losing focus due to onStepPlay callback while Song is playing
export default React.memo(SelectComponent, areEqual);
