import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import DocApp from './DocApp';

afterEach(cleanup);

describe('DocApp', () => {
  it('renders DocApp component', () => {
    render(<DocApp/>);
  });
});
