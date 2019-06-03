import React from 'react';
import { render, cleanup } from '@testing-library/react';

import StepsEditor from './StepsEditor';
import { melodySteps } from '../../__tests__';

afterEach(cleanup);

describe('StepsEditor', () => {
  it('should render component', () => {
    render(<StepsEditor />);
  });

  it('should render with grid of steps', () => {
    const { getByTestId } = render(
      <StepsEditor steps={melodySteps} subdivision={16} />,
    );

    [...new Array(17)].map((_, i) => {
      const result = getByTestId(`header-${i}`);
      expect(result).toBeDefined();
    });
  });
});
