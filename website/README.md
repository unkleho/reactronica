# Reactronica Website

Website for [reactronica.com](https://reactronica.com), with documentation and examples.

## Install

```bash
$ npm install
```

## Deployment

```bash
$ npm run deploy:staging
# or
$ npm run deploy:prod
```

Some audio samples are Git ignored in this repo, so deployments are done using the above commands, rather than using Vercel's GitHub integration.

## Development

```bash
# Ensure npm link has already been run at ../
$ npm link
$ cd website
$ npm link reactronica
# Stop invariant error
$ npm link ../node_modules/react
```
