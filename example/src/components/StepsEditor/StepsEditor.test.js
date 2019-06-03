import React from 'react';
import { render, cleanup } from '@testing-library/react';
import StepsEditor from './StepsEditor';

afterEach(cleanup);

describe('StepsEditor', () => {
  it('should render component', () => {
    render(<StepsEditor />);
  });
});
