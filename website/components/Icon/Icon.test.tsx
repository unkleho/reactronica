import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import Icon from './Icon';

afterEach(cleanup);

describe('Icon', () => {
  it('renders Icon component', () => {
    render(<Icon/>);
  });
});
