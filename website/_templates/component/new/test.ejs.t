---
to: components/<%= name %>/<%= name %>.test.tsx
---
import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import <%= name %> from './<%= name %>';

afterEach(cleanup);

describe('<%= name %>', () => {
  it('renders <%= name %> component', () => {
    render(<<%= name %>/>);
  });
});
