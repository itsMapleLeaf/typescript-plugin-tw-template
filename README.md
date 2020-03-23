# typescript-plugin-tw-template

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

## TODO

- [ ] Show CSS source for class names in autocomplete
- [ ] Warnings on unknown tailwind classes
- [ ] Show CSS source when hovering over class names
