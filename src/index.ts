import { join } from "path"
import { decorateWithTemplateLanguageService } from "typescript-template-language-service-decorator"
import ts from "typescript/lib/tsserverlibrary"
import {
  createLanguageService,
  LanguageServiceContext,
} from "./language-service"
import { createLogFunction } from "./log"
import { populateCompletions } from "./tailwind"

export = function init(mod: { typescript: typeof ts }) {
  const context: LanguageServiceContext = {
    completionEntries: new Map(),
  }

  let initialized = false

  return {
    create(info: ts.server.PluginCreateInfo): ts.LanguageService {
      const log = createLogFunction(info)

      // TODO: make this configurable
      const configPath = join(
        info.project.getCurrentDirectory(),
        "tailwind.config.js",
      )

      if (!initialized) {
        populateCompletions(context, configPath).catch((error) => {
          log("an error occured:", String(error))
        })
        initialized = true
      }

      return decorateWithTemplateLanguageService(
        mod.typescript,
        info.languageService,
        info.project,
        createLanguageService(context),
        { tags: ["tw"] },
      )
    },
  }
}
