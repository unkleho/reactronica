import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import DAWPlayhead from './DAWPlayhead';

afterEach(cleanup);

describe('DAWPlayhead', () => {
  it('renders DAWPlayhead component', () => {
    render(<DAWPlayhead/>);
  });
});
