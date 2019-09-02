import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import ReactronicaLogo from './ReactronicaLogo';

afterEach(cleanup);

describe('ReactronicaLogo', () => {
  it('renders ReactronicaLogo component', () => {
    render(<ReactronicaLogo/>);
  });
});
