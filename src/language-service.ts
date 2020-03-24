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

      const entries = languageServiceContext.rules
        .filter((rule) => !templateClasses.has(rule.className))
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

    getSemanticDiagnostics(templateContext) {
      const templateClasses = [...regexExec(/\S+/g, templateContext.text)].map(
        (match) => ({
          className: match[0],
          start: match.index,
          length: match[0].length,
        }),
      )

      return templateClasses
        .filter(
          ({ className }) =>
            !languageServiceContext.classNameSet.has(className),
        )
        .map<ts.Diagnostic>((invalidEntry) => ({
          messageText: `unknown tailwind class "${invalidEntry.className}"`,
          start: invalidEntry.start,
          length: invalidEntry.length,
          file: templateContext.node.getSourceFile(),
          category: ts.DiagnosticCategory.Warning,
          code: 0, // ???
        }))
    },
  }
}
