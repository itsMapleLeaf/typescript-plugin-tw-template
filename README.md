# typescript-plugin-tw-template

Provides autocomplete for tailwind classes in `tw`\`...\` tagged template syntax, like [twin.macro](https://github.com/ben-rogerson/twin.macro)

## Install

```bash
# yarn
yarn add -D typescript-plugin-tw-template

# npm
npm install -D typescript-plugin-tw-template
```

## Usage

Add it to the `"plugins"` section in `tsconfig.json` or `jsconfig.json`

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "typescript-plugin-tw-template" }]
  }
}
```

The plugin will read from a custom `tailwind.config.js` file at the project root, or use the default config

**Make sure you're using the workspace TS version!**

## TODO

- [ ] Config for custom tailwind config filename
- [ ] Show CSS source for class names in autocomplete info
- [ ] Show CSS source when hovering over class names
- [ ] Warnings on unknown tailwind classes
- [x] Filter out already used class names in autocomplete
- [x] Unit Tests
- [ ] Integration / e2e tests (?)

PRs are welcome! ❤
