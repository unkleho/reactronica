import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import Select from './Select';

afterEach(cleanup);

describe('Select', () => {
  it('renders Select component', () => {
    render(<Select/>);
  });
});
