import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';

import theme from '../../lib/codeTheme';

const CodeBlock = ({ children }) => {
  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={children}
      language="javascript"
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, padding: '20px' }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default CodeBlock;
