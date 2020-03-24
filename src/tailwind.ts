import postcss from "postcss"
import { uniqueBy } from "./helpers"
import { LanguageServiceContext } from "./language-service"

export async function populateClassNames(
  context: LanguageServiceContext,
  configPath: string,
) {
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

  context.rules = uniqueBy(context.rules, (rule) => rule.className)
  context.classNameSet = new Set(context.rules.map((rule) => rule.className))
}
