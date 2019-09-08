import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import StepsEditorExample from './StepsEditorExample';

afterEach(cleanup);

describe('StepsEditorExample', () => {
  it('renders StepsEditorExample component', () => {
    render(<StepsEditorExample/>);
  });
});
