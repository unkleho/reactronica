import * as React from 'react';
import Select from 'react-select';

import css from './Select.css';

type Props = {
  value?: string;
  options: { value: string; label: string }[];
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

export default SelectComponent;
