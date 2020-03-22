import {
  decorateWithTemplateLanguageService,
  TemplateLanguageService,
} from "typescript-template-language-service-decorator"
import ts from "typescript/lib/tsserverlibrary"

function createLanguageService(): TemplateLanguageService {
  return {
    getCompletionsAtPosition(context, position) {
      const line = context.text.split(/\n/g)[position.line]
      return {
        isGlobalCompletion: false,
        isMemberCompletion: false,
        isNewIdentifierLocation: false,
        entries: [
          {
            name: line.slice(0, position.character),
            kind: ts.ScriptElementKind.label,
            kindModifiers: "echo",
            sortText: "echo",
          },
        ],
      }
    },
  }
}

export = function init(mod: { typescript: typeof ts }) {
  return {
    create(info: ts.server.PluginCreateInfo): ts.LanguageService {
      return decorateWithTemplateLanguageService(
        mod.typescript,
        info.languageService,
        info.project,
        createLanguageService(),
        { tags: ["tw"] },
      )
    },
  }
}
