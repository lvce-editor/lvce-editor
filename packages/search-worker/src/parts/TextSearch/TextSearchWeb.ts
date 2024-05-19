
export const textSearch = (scheme, root, query) => {
  // TODO ask renderer worker for files
  const entries = Object.entries({})
  const results: any[] = []
  for (const [key, value] of entries) {
    // @ts-ignore
    if (value.includes(query)) {
      results.push([
        key,
        [
          {
            absoluteOffset: 0,
            preview: value,
          },
        ],
      ])
    }
  }
  return results
}
