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
    const { getAllByTestId, getByTestId } = render(
      <Tab grid={defaultUkeGrid} instrument="ukulele" />,
    );

    expect(getAllByTestId('tabLines').length).toEqual(4);
    expect(getAllByTestId('tabSteps').length).toEqual(64);
    expect(getByTestId('tabStepInput-0-0').value).toEqual('');
    expect(getByTestId('tabStepInput-1-0').value).toEqual('0');
    expect(getByTestId('tabStepInput-2-0').value).toEqual('');
    expect(getByTestId('tabStepInput-3-0').value).toEqual('');
  });
});
