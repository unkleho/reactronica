# Release

## New Version

- Make changes and commit/merge to `main`
- `npm version major|minor|patch`
- `git push && git push --tags`
- `npm publish`

## Canary

- `npm version prerelease --preid=canary`
- `npm publish --tag canary`
