import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import DrumPads from './DrumPads';

afterEach(cleanup);

describe('DrumPads', () => {
  it('renders DrumPads component', () => {
    render(<DrumPads/>);
  });
});
