# Deprecated!

This plugin was written at a time when the [official VSCode extension](https://github.com/tailwindlabs/tailwindcss-intellisense) didn't have support for twin.macro. Recently, it added support for custom completion contexts, which gives support for tailwind intellisense outside of the class prop, _including_ for twin.macro.

While it doesn't warn on unknown classes at the time of writing this, everything else the extension offers (hover info, color decorators, more speed) more than makes up for it, so I strongly recommend using it instead of this. For details on how to configure with twin.macro, [see this comment](https://github.com/tailwindlabs/tailwindcss-intellisense/issues/129). I'll keep this repo un-archived in case there are further updates.

# typescript-plugin-tw-template

Provides editor support for `tw`\`...\` tagged template syntax, like [twin.macro](https://github.com/ben-rogerson/twin.macro), including:

- Autocomplete for tailwind classes
- Warnings on unknown classes

**Note:** the classes found by this plugin may be different from those supported by twin.macro or other solutions, so you may get false warnings, or some valid classes might be missing from autocomplete. YMMV

## Install

```bash
# yarn
yarn add -D typescript-plugin-tw-template tailwindcss

# npm
npm install -D typescript-plugin-tw-template tailwindcss
```

## Usage

Add it to the `"plugins"` section in `tsconfig.json` or `jsconfig.json`

```json
{
  "compilerOptions": {
    // other options...
    "plugins": [{ "name": "typescript-plugin-tw-template" }]
  }
}
```

The plugin will read from a custom `tailwind.config.js` file at the project root, or use the default config

**Make sure you're using the workspace TS version!** In VSCode, you can do this by opening any TS file, then click on the TS version number in the bottom right.

## TODO

- [ ] Config for custom tailwind config filename
- [ ] Custom pragma config
- [ ] Show CSS source for class names in autocomplete info
- [ ] Show CSS source when hovering over class names
- [x] Warnings on unknown tailwind classes
- [x] Filter out already used class names in autocomplete
- [x] Unit Tests
- [ ] Support `tw` prop (?)
- [ ] Integration / e2e tests (?)
- [ ] Support `!` suffix from twin.macro
- [x] Autocomplete classes and variants separately (?)
