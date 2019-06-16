import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import StepsEditor from './StepsEditor';
import { melodySteps } from '../../__tests__';

afterEach(cleanup);

describe('StepsEditor', () => {
  it('should render component', () => {
    render(<StepsEditor />);
  });

  it('should render with current steps and keyboard', () => {
    const { getAllByTestId, getByTestId } = render(
      <StepsEditor defaultSteps={melodySteps} subdivision={16} />,
    );

    const headerCells = getAllByTestId('header');
    const keyboardButtons = getAllByTestId('keyboard-button');
    const stepButtons = getAllByTestId(/step-button/);
    const currentStepButtons = getAllByTestId(/-current/);

    expect(headerCells.length).toBe(17);
    expect(keyboardButtons.length).toBe(12);
    expect(stepButtons.length).toBe(192);
    expect(currentStepButtons.length).toBe(6);

    expect(getByTestId('step-button-0-0-current')).toBeDefined();
    expect(getByTestId('step-button-0-7-current')).toBeDefined();
    expect(getByTestId('step-button-2-2-current')).toBeDefined();
    expect(getByTestId('step-button-4-4-current')).toBeDefined();
  });

  it('should add current step after click and send new steps in callback', () => {
    const { getByTestId } = render(
      <StepsEditor
        defaultSteps={melodySteps}
        subdivision={16}
        onStepEditorClick={(steps, note, index) => {
          expect(steps[0]).toEqual([
            { note: 'C3', duration: 0.5 },
            { note: 'G3', duration: 0.5 },
            { note: 'F3', duration: 0.5 },
          ]);
          expect(steps.length).toBe(16);
          expect(note.note).toEqual('F3');
          expect(index).toEqual(0);
        }}
      />,
    );

    fireEvent.click(getByTestId('step-button-0-5'));
    expect(getByTestId('step-button-0-5-current')).toBeDefined();
  });

  it('should remove current step after click and send new steps in callback', () => {
    const { getByTestId } = render(
      <StepsEditor
        defaultSteps={melodySteps}
        subdivision={16}
        onStepEditorClick={(steps, note, index) => {
          expect(steps[0]).toEqual([{ note: 'G3', duration: 0.5 }]);
          expect(steps.length).toBe(16);
          expect(note.note).toEqual('C3');
          expect(index).toEqual(0);
        }}
      />,
    );

    fireEvent.click(getByTestId('step-button-0-0-current'));
    expect(getByTestId('step-button-0-0')).toBeDefined();
  });

  it('should change all steps when defaultSteps is updated', () => {
    const { getAllByTestId, getByTestId, rerender } = render(
      <StepsEditor defaultSteps={melodySteps} subdivision={16} />,
    );

    const currentStepButtonsPrev = getAllByTestId(/-current/);
    expect(currentStepButtonsPrev.length).toBe(6);

    rerender(
      <StepsEditor
        defaultSteps={[
          [
            {
              note: 'D3',
              duration: 0.5,
            },
          ],
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ]}
        subdivision={16}
      />,
    );

    const currentStepButtonsNext = getAllByTestId(/-current/);
    expect(currentStepButtonsNext.length).toBe(1);
    expect(getByTestId('step-button-0-2-current')).toBeDefined();
  });
});
