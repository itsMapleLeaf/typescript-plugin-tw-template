import { join } from "path"
import { decorateWithTemplateLanguageService } from "typescript-template-language-service-decorator"
import ts from "typescript/lib/tsserverlibrary"
import { Context, createLanguageService } from "./language-service"
import { createLogFunction } from "./log"
import { populateClassNames } from "./tailwind"

export = function init(mod: { typescript: typeof ts }) {
  return {
    create(info: ts.server.PluginCreateInfo): ts.LanguageService {
      const log = createLogFunction(info)

      const context: Context = {
        rules: [],
      }

      // TODO: make this configurable
      const configPath = join(
        info.project.getCurrentDirectory(),
        "tailwind.config.js",
      )

      populateClassNames(context, configPath).catch((error) => {
        log("an error occured:", String(error))
      })

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
