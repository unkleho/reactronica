import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import DAWPage from '../pages/daw';

afterEach(cleanup);

describe('DAW Page', () => {
  it('should render DAWPage', () => {
    render(<DAWPage />);
  });
});
