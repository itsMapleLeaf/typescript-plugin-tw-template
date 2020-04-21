import postcss from "postcss"
import tailwind from "tailwindcss"
import { LanguageServiceContext } from "./language-service"

// matches either an escaped colon or anything but a colon,
// so we stop at the pseudo-class
const classNameRegex = /\.((?:\\:|[^:\s])+)/gi

export async function populateClassNames(
  context: LanguageServiceContext,
  configPath: string,
) {
  const result = await postcss(tailwind(configPath)).process(
    `@tailwind utilities;`,
  )

  context.rules = []
  context.classNameSet.clear()

  result.root?.walkRules((rule) => {
    rule.selector.match(classNameRegex)?.forEach((match) => {
      const className = match.slice(1).replace(/\\/g, "") // remove the dot and escapes
      if (className && !context.classNameSet.has(className)) {
        context.rules.push({ className, source: rule.toString() })
        context.classNameSet.add(className)
      }
    })
  })
}
