import React from 'react';
import { render, cleanup } from '@testing-library/react';

import Tab from './Tab';
import { defaultUkeGrid } from '../../constants';

afterEach(cleanup);

describe('Tab', () => {
  it('should render component', () => {
    render(<Tab />);
  });

  it('should render tab grid', () => {
    render(<Tab grid={defaultUkeGrid} instrument="ukulele" />);
  });
});
