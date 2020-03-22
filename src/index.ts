import {
  decorateWithTemplateLanguageService,
  TemplateLanguageService,
} from "typescript-template-language-service-decorator"
import ts from "typescript/lib/tsserverlibrary"

function createLanguageService(
  info: ts.server.PluginCreateInfo,
): TemplateLanguageService {
  return {
    getCompletionsAtPosition(context, position) {
      return {
        isGlobalCompletion: false,
        isMemberCompletion: false,
        isNewIdentifierLocation: false,
        entries: [
          {
            name: "awesomeness",
            kind: ts.ScriptElementKind.string,
            sortText: "awesomeness",
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
        createLanguageService(info),
        { tags: ["tw"] },
      )
    },
  }
}
