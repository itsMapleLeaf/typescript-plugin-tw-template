import { TemplateContext } from "typescript-template-language-service-decorator"
import { createLanguageService } from "./language-service"

const mockTemplateContext = (text = "") => ({ text } as TemplateContext)

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
