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
