import React from 'react';
import { render, cleanup } from '@testing-library/react';

import StepsEditor from './StepsEditor';
import { melodySteps } from '../../__tests__';

afterEach(cleanup);

describe('StepsEditor', () => {
  it('should render component', () => {
    render(<StepsEditor />);
  });

  it('should render with steps and keyboard', () => {
    const { getAllByTestId } = render(
      <StepsEditor steps={melodySteps} subdivision={16} />,
    );

    const headerCells = getAllByTestId('header');
    const keyboardButtons = getAllByTestId('keyboard-button');
    const stepButtons = getAllByTestId(/step-button/);
    const currentStepButtons = getAllByTestId(/-current/);

    expect(headerCells.length).toBe(17);
    expect(keyboardButtons.length).toBe(12);
    expect(stepButtons.length).toBe(192);
    expect(currentStepButtons.length).toBe(5);
  });
});
