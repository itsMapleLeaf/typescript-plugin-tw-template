import path from "path"
// @ts-ignore
import corePlugins from "tailwindcss/lib/corePlugins"
// @ts-ignore
import processPlugins from "tailwindcss/lib/util/processPlugins"
// @ts-ignore
import resolveTailwindConfig from "tailwindcss/lib/util/resolveConfig"
// @ts-ignore
import defaultTailwindConfig from "tailwindcss/stubs/defaultConfig.stub"
import {
  decorateWithTemplateLanguageService,
  TemplateLanguageService,
} from "typescript-template-language-service-decorator"
import ts from "typescript/lib/tsserverlibrary"

function createLanguageService(
  info: ts.server.PluginCreateInfo,
): TemplateLanguageService {
  const log = (...stuff: unknown[]) => {
    const output = stuff
      .map((value) => JSON.stringify(value, null, 2))
      .join(" ")

    return info.project.projectService.logger.info(
      `[twin-macro-autocomplete] ${output}`,
    )
  }

  return {
    getCompletionsAtPosition(context, position) {
      // log("getting completions")

      const configPath = path.resolve(
        info.project.getCurrentDirectory(),
        `./tailwind.config.js`,
      )
      log(configPath)

      const config = resolveTailwindConfig([
        require(configPath),
        defaultTailwindConfig,
      ])

      const processedPlugins = processPlugins(
        [...corePlugins(config), ...config.plugins],
        config,
      )
      log(processedPlugins)

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
