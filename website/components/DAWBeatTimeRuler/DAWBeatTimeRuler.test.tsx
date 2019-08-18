import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import DAWBeatTimeRuler from './DAWBeatTimeRuler';

afterEach(cleanup);

describe('DAWBeatTimeRuler', () => {
  it('renders DAWBeatTimeRuler component', () => {
    render(<DAWBeatTimeRuler/>);
  });
});
