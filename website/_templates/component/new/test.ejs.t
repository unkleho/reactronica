---
to: components/<%= name %>/<%= name %>.test.tsx
---
import * as React from 'react';
import { render, cleanup} from 'react-testing-library';

import <%= name %> from './<%= name %>';

afterEach(cleanup);

describe('<%= name %>', () => {
  it('renders <%= name %> component', () => {
    render(<<%= name %>/>);
  });
});
