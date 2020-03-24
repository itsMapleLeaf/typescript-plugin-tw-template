export function uniqueBy<T>(
  items: Iterable<T>,
  getKey: (item: T) => unknown,
): T[] {
  const keyedItems = new Map<unknown, T>()
  for (const item of items) {
    keyedItems.set(getKey(item), item)
  }
  return [...keyedItems.values()]
}

export function* regexExec(regex: RegExp, text: string) {
  const regexCopy = new RegExp(regex, "g")
  let match: RegExpExecArray | null
  while ((match = regexCopy.exec(text)) != null) {
    yield match
  }
}
