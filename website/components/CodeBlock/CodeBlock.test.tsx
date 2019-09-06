import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import CodeBlock from './CodeBlock';

afterEach(cleanup);

describe('CodeBlock', () => {
  it('renders CodeBlock component', () => {
    render(<CodeBlock/>);
  });
});
