// Ensure that TS is aware of .scss imports for CSS Modules
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
