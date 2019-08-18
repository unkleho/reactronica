import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import DAWClip from './DAWClip';

afterEach(cleanup);

describe('DAWClip', () => {
  it('renders DAWClip component', () => {
    render(<DAWClip/>);
  });
});
