import * as FileSystemWeb from '../FileSystem/FileSystemWeb.js'

export const textSearch = (scheme, root, query) => {
  const entries = Object.entries(FileSystemWeb.state.files)
  const results = []
  console.log(entries)
  for (const [key, value] of entries) {
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
