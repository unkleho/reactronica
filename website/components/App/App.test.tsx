import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import App from './App';

afterEach(cleanup);

describe('App', () => {
  it('renders App component', () => {
    render(<App/>);
  });
});
