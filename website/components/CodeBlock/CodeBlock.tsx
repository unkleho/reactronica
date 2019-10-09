import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';

import theme from '../../lib/codeTheme';
import './CodeBlock.scss';

const CodeBlock = ({ children, className }) => {
  const language = className.replace(/language-/, '');

  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={children}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{ ...style, fontSize: '15px', padding: '16px' }}
        >
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
