import { TemplateLanguageService } from "typescript-template-language-service-decorator"
import ts from "typescript/lib/tsserverlibrary"
import { regexExec } from "./helpers"

export type LanguageServiceContext = {
  rules: {
    className: string
    source?: string
  }[]
  classNameSet: Set<string>
}

export function createLanguageService(
  languageServiceContext: LanguageServiceContext,
): TemplateLanguageService {
  return {
    getCompletionsAtPosition(templateContext) {
      const templateClasses = new Set(
        templateContext.text.split(/\s+/).filter(Boolean),
      )

      const entries: ts.CompletionEntry[] = []

      languageServiceContext.rules.forEach((rule) => {
        if (!templateClasses.has(rule.className)) {
          entries.push({
            name: rule.className,
            sortText: rule.className,
            kind: ts.ScriptElementKind.string,
          })
        }
      })

      return {
        entries,
        isGlobalCompletion: false,
        isMemberCompletion: false,
        isNewIdentifierLocation: false,
      }
    },

    getSemanticDiagnostics(templateContext) {
      const diagnostics: ts.Diagnostic[] = []

      for (const match of regexExec(/\S+/g, templateContext.text)) {
        const className = match[0]
        const start = match.index
        const length = match[0].length

        if (!languageServiceContext.classNameSet.has(className)) {
          diagnostics.push({
            messageText: `unknown tailwind class "${className}"`,
            start: start,
            length: length,
            file: templateContext.node.getSourceFile(),
            category: ts.DiagnosticCategory.Warning,
            code: 0, // ???
          })
        }
      }

      return diagnostics
    },
  }
}
