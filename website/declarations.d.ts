// Ensure that TS is aware of .css imports for CSS Modules
declare module '*.css';

// Ensure that TS is aware of .scss imports for CSS Modules
declare module '*.scss';

// https://goulet.dev/posts/consuming-web-component-react-typescript/
declare namespace JSX {
  interface IntrinsicElements {
    'ion-icon': any;
  }
}

declare module '*.mdx';
declare module '*.md';
