import { TemplateLanguageService } from "typescript-template-language-service-decorator"
import ts from "typescript/lib/tsserverlibrary"
import { uniqueBy } from "./helpers"

export type LanguageServiceContext = {
  rules: {
    className: string
    source?: string
  }[]
}

export function createLanguageService(
  languageServiceContext: LanguageServiceContext,
): TemplateLanguageService {
  return {
    getCompletionsAtPosition(templateContext) {
      const existingClasses = new Set(
        templateContext.text.split(/\s+/).filter(Boolean),
      )

      const uniqueRules = uniqueBy(
        languageServiceContext.rules,
        (rule) => rule.className,
      )

      const entries = uniqueRules
        .filter((rule) => !existingClasses.has(rule.className))
        .map<ts.CompletionEntry>((rule) => ({
          name: rule.className,
          sortText: rule.className,
          kind: ts.ScriptElementKind.string,
        }))

      return {
        entries,
        isGlobalCompletion: false,
        isMemberCompletion: false,
        isNewIdentifierLocation: false,
      }
    },
  }
}
