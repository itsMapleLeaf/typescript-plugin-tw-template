import { TemplateContext } from "typescript-template-language-service-decorator"
import {
  createLanguageService,
  LanguageServiceContext,
} from "./language-service"
import { addClassNameToCompletions } from "./tailwind"

const mockContext = (classNames: string[]): LanguageServiceContext => ({
  completionEntries: new Map(classNames.map((name) => [name, { name }])),
})

const mockTemplateContext = (text = "") =>
  ({
    text,
    node: { getSourceFile: () => ({}) },
  } as TemplateContext)

const mockPosition = (line = 0, character = 0): ts.LineAndCharacter => ({
  line,
  character,
})

it("shows class names in autocomplete", () => {
  const ls = createLanguageService(mockContext(["a", "b", "c"]))

  const { entries = [] } =
    ls.getCompletionsAtPosition?.(mockTemplateContext(), mockPosition()) || {}

  expect(entries).toHaveLength(3)
  expect(entries).toContainEqual(expect.objectContaining({ name: "a" }))
  expect(entries).toContainEqual(expect.objectContaining({ name: "b" }))
  expect(entries).toContainEqual(expect.objectContaining({ name: "c" }))
})

it("gives warnings on invalid class names", () => {
  const ls = createLanguageService(mockContext(["a", "b", "c"]))

  const diagnostics = ls.getSemanticDiagnostics?.(
    mockTemplateContext(`invalid1 a invalid2`),
  )

  expect(diagnostics).toHaveLength(2)

  expect(diagnostics).toContainEqual(
    expect.objectContaining({
      messageText: expect.stringContaining(`invalid1`),
      start: 0,
      length: 8,
    }),
  )

  expect(diagnostics).toContainEqual(
    expect.objectContaining({
      messageText: expect.stringContaining(`invalid2`),
      start: 11,
      length: 8,
    }),
  )
})

it("shows variants separate from class names", () => {
  const context = mockContext([])

  addClassNameToCompletions("text-white", context)
  addClassNameToCompletions("hover:text-white", context)
  addClassNameToCompletions("md:hover:text-white", context)

  const ls = createLanguageService(context)

  const { entries = [] } =
    ls.getCompletionsAtPosition?.(mockTemplateContext(), mockPosition()) || {}

  expect(entries).toHaveLength(3)
  expect(entries).toContainEqual(
    expect.objectContaining({ name: "text-white" }),
  )
  expect(entries).toContainEqual(expect.objectContaining({ name: "hover:" }))
  expect(entries).toContainEqual(expect.objectContaining({ name: "md:" }))
})
