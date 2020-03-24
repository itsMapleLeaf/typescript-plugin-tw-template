import { TemplateContext } from "typescript-template-language-service-decorator"
import { createLanguageService } from "./language-service"

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
  const ls = createLanguageService({
    rules: [{ className: "a" }, { className: "b" }, { className: "c" }],
  })

  const { entries = [] } =
    ls.getCompletionsAtPosition?.(mockTemplateContext(), mockPosition()) || {}

  expect(entries).toHaveLength(3)
  expect(entries).toContainEqual(expect.objectContaining({ name: "a" }))
  expect(entries).toContainEqual(expect.objectContaining({ name: "b" }))
  expect(entries).toContainEqual(expect.objectContaining({ name: "c" }))
})

it("does not show duplicate classes", () => {
  const ls = createLanguageService({
    rules: [{ className: "a" }, { className: "b" }, { className: "b" }],
  })

  const { entries = [] } =
    ls.getCompletionsAtPosition?.(mockTemplateContext(), mockPosition()) || {}

  expect(entries).toHaveLength(2)
  expect(entries).toContainEqual(expect.objectContaining({ name: "a" }))
  expect(entries).toContainEqual(expect.objectContaining({ name: "b" }))
})

it("gives warnings on invalid class names", () => {
  const ls = createLanguageService({
    rules: [{ className: "a" }, { className: "b" }, { className: "c" }],
  })

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
