import postcss from "postcss"
import { Context } from "./language-service"

export async function populateClassNames(context: Context, configPath: string) {
  const result = await postcss(require("tailwindcss")(configPath)).process(
    `@tailwind utilities;`,
  )

  result.root?.walkRules((rule) => {
    // matches either an escaped colon or anything but a colon,
    // so we stop at the pseudo-class
    const classNameRegex = /^\.((?:\\:|[^:])+)/i
    const classNameMatch = rule.selector.match(classNameRegex)

    // remove the escapes
    const className = classNameMatch?.[1]?.replace(/\\/g, "")

    if (className) {
      context.rules.push({ className, source: rule.toString() })
    }
  })
}
