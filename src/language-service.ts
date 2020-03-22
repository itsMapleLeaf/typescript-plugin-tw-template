import { TemplateLanguageService } from "typescript-template-language-service-decorator"
import ts from "typescript/lib/tsserverlibrary"

export type Context = {
  rules: {
    className: string
    source?: string
  }[]
}

export function createLanguageService(
  context: Context,
): TemplateLanguageService {
  return {
    getCompletionsAtPosition() {
      return {
        isGlobalCompletion: false,
        isMemberCompletion: false,
        isNewIdentifierLocation: false,
        entries: context.rules.map<ts.CompletionEntry>((rule) => ({
          name: rule.className,
          sortText: rule.className,
          kind: ts.ScriptElementKind.string,
        })),
      }
    },
  }
}
